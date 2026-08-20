using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using PersonalAssistant.Api.Models;
using PersonalAssistant.Api.Services;

namespace PersonalAssistant.Tests.Controllers;

// UploadStatement/ReprocessStatement/DeleteStatement are covered against fakes of
// IBlobStorageService/IStatementExtractionPipeline (registered via ConfigureTestServices) instead
// of real Azure Storage / Document Intelligence / Claude — see IBlobStorageService and
// IStatementExtractionPipeline for the rationale.
public class CreditCardsControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;
    private readonly FakeBlobStorageService _fakeBlob = new();
    private readonly FakeStatementExtractionPipeline _fakePipeline = new();

    public CreditCardsControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        factory.ResetDatabase();

        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureTestServices(services =>
            {
                services.AddScoped<IBlobStorageService>(_ => _fakeBlob);
                services.AddScoped<IStatementExtractionPipeline>(_ => _fakePipeline);
            });
        }).CreateClient();
    }

    private int SeedCardId(string userId = null!) =>
        _factory.Seed(new CreditCard
        {
            Name = "Visa",
            LastFourDigits = "4242",
            Color = "#343a40",
            Notes = "",
            CreatedAt = DateTime.UtcNow,
            UserId = userId ?? TestAuthHandler.UserId
        });

    private int SeedCategoryId(string name = "Groceries") =>
        _factory.Seed(new CreditCardCategory { Name = name, Color = "#6c757d", Icon = "", UserId = TestAuthHandler.UserId });

    private static MultipartFormDataContent BuildPdfUpload(string fileName = "statement.pdf")
    {
        var content = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent([0x25, 0x50, 0x44, 0x46]);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
        content.Add(fileContent, "file", fileName);
        return content;
    }

    // ── UploadStatement ──────────────────────────────────────────────────────────

    [Fact]
    public async Task UploadStatement_Returns404_WhenCardNotOwned()
    {
        var otherCardId = SeedCardId(userId: "other-user");

        var response = await _client.PostAsync($"/api/credit-cards/{otherCardId}/statements", BuildPdfUpload());

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UploadStatement_ReturnsBadRequest_WhenNotPdf()
    {
        var cardId = SeedCardId();
        var content = BuildPdfUpload("statement.txt");

        var response = await _client.PostAsync($"/api/credit-cards/{cardId}/statements", content);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UploadStatement_ReturnsUnprocessableEntity_WhenNoCategories()
    {
        var cardId = SeedCardId();

        var response = await _client.PostAsync($"/api/credit-cards/{cardId}/statements", BuildPdfUpload());

        response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task UploadStatement_HappyPath_ReturnsOkProcessed_WithTransactions()
    {
        var cardId = SeedCardId();
        var categoryId = SeedCategoryId();
        _fakePipeline.Transactions =
        [
            new ExtractedTransaction(new DateOnly(2026, 8, 1), "Coffee", 4.50m, "Expense", categoryId, null)
        ];

        var response = await _client.PostAsync($"/api/credit-cards/{cardId}/statements", BuildPdfUpload());

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<StatementResponse>();
        body!.status.Should().Be("Processed");
        body.transactionCount.Should().Be(1);
        body.totalAmount.Should().Be(4.50m);
        body.statementMonth.Should().Be(8);
        body.statementYear.Should().Be(2026);

        _fakeBlob.UploadedBlobName.Should().NotBeNull();
        _fakePipeline.LastCategories.Should().ContainSingle(c => c.Id == categoryId && c.Name == "Groceries");
    }

    [Fact]
    public async Task UploadStatement_BusinessFailure_ReturnsOkFailed_WithErrorMessage()
    {
        var cardId = SeedCardId();
        SeedCategoryId();
        _fakePipeline.ThrowException = new StatementProcessingBusinessException("No se encontraron transacciones en el statement.");

        var response = await _client.PostAsync($"/api/credit-cards/{cardId}/statements", BuildPdfUpload());

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<StatementResponse>();
        body!.status.Should().Be("Failed");
        body.errorMessage.Should().Be("No se encontraron transacciones en el statement.");
        body.transactionCount.Should().Be(0);
    }

    [Fact]
    public async Task UploadStatement_TransientFailure_ReturnsOkFailed_WithGenericMessage()
    {
        var cardId = SeedCardId();
        SeedCategoryId();
        _fakePipeline.ThrowException = new InvalidOperationException("Anthropic API failed (503 Service Unavailable): boom");

        var response = await _client.PostAsync($"/api/credit-cards/{cardId}/statements", BuildPdfUpload());

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<StatementResponse>();
        body!.status.Should().Be("Failed");
        body.errorMessage.Should().NotContain("Anthropic API failed");
        body.transactionCount.Should().Be(0);
    }

    // ── ReprocessStatement ───────────────────────────────────────────────────────

    [Fact]
    public async Task ReprocessStatement_Returns404_WhenNotOwned()
    {
        var otherCardId = SeedCardId(userId: "other-user");
        var stmtId = _factory.Seed(new CreditCardStatement
        {
            CreditCardId = otherCardId, UserId = "other-user", FileName = "s.pdf",
            BlobName = "statements/other-user/x.pdf", Status = "Failed", UploadedAt = DateTime.UtcNow
        });

        var response = await _client.PostAsync($"/api/credit-cards/statements/{stmtId}/reprocess", null);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ReprocessStatement_ReturnsUnprocessableEntity_WhenNoCategories()
    {
        var cardId = SeedCardId();
        var stmtId = _factory.Seed(new CreditCardStatement
        {
            CreditCardId = cardId, UserId = TestAuthHandler.UserId, FileName = "s.pdf",
            BlobName = "statements/x/y.pdf", Status = "Failed", UploadedAt = DateTime.UtcNow
        });

        var response = await _client.PostAsync($"/api/credit-cards/statements/{stmtId}/reprocess", null);

        response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task ReprocessStatement_HappyPath_DownloadsBlob_ReplacesTransactions_AndReturnsProcessed()
    {
        var cardId = SeedCardId();
        var categoryId = SeedCategoryId();
        var stmtId = _factory.Seed(new CreditCardStatement
        {
            CreditCardId = cardId, UserId = TestAuthHandler.UserId, FileName = "s.pdf",
            BlobName = "statements/x/y.pdf", Status = "Failed", ErrorMessage = "boom", UploadedAt = DateTime.UtcNow
        });
        _fakePipeline.Transactions =
        [
            new ExtractedTransaction(new DateOnly(2026, 8, 2), "Groceries", 20m, "Expense", categoryId, null)
        ];

        var response = await _client.PostAsync($"/api/credit-cards/statements/{stmtId}/reprocess", null);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<StatementResponse>();
        body!.status.Should().Be("Processed");
        body.errorMessage.Should().Be("");
        body.transactionCount.Should().Be(1);

        _fakeBlob.DownloadedBlobNames.Should().ContainSingle("statements/x/y.pdf");
    }

    // ── DeleteStatement ──────────────────────────────────────────────────────────

    [Fact]
    public async Task DeleteStatement_DeletesBlob_AndRemovesRow()
    {
        var cardId = SeedCardId();
        var stmtId = _factory.Seed(new CreditCardStatement
        {
            CreditCardId = cardId, UserId = TestAuthHandler.UserId, FileName = "s.pdf",
            BlobName = "statements/x/y.pdf", Status = "Processed", UploadedAt = DateTime.UtcNow
        });

        var response = await _client.DeleteAsync($"/api/credit-cards/statements/{stmtId}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _fakeBlob.DeletedBlobs.Should().ContainSingle("statements/x/y.pdf");
        _factory.CountAll<CreditCardStatement>().Should().Be(0);
    }

    private class FakeBlobStorageService : IBlobStorageService
    {
        public string? UploadedBlobName { get; private set; }
        public List<string> DownloadedBlobNames { get; } = [];
        public List<string> DeletedBlobs { get; } = [];

        public Task<string> UploadAsync(Stream stream, string blobName, string contentType,
            Dictionary<string, string>? metadata = null, string? containerName = null)
        {
            UploadedBlobName = blobName;
            return Task.FromResult(blobName);
        }

        public Task<byte[]> DownloadBytesAsync(string blobName, string? containerName = null)
        {
            DownloadedBlobNames.Add(blobName);
            return Task.FromResult(new byte[] { 0x25, 0x50, 0x44, 0x46 });
        }

        public Task DeleteAsync(string blobName, string? containerName = null)
        {
            DeletedBlobs.Add(blobName);
            return Task.CompletedTask;
        }
    }

    private class FakeStatementExtractionPipeline : IStatementExtractionPipeline
    {
        public List<ExtractedTransaction> Transactions { get; set; } = [];
        public Exception? ThrowException { get; set; }
        public IReadOnlyList<CategoryRef>? LastCategories { get; private set; }

        public Task<List<ExtractedTransaction>> ProcessAsync(
            byte[] pdfBytes, IReadOnlyList<CategoryRef> categories, CancellationToken ct = default)
        {
            LastCategories = categories;
            if (ThrowException is not null) throw ThrowException;
            return Task.FromResult(Transactions);
        }
    }

    private record StatementResponse(int id, int creditCardId, string fileName, string status, string errorMessage,
        DateTime uploadedAt, DateTime? processedAt, int? statementMonth, int? statementYear, decimal? totalAmount,
        int transactionCount);
}
