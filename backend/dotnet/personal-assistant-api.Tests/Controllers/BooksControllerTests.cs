using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class BooksControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public BooksControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private static Book NewBook(string status, DateOnly? completedDate = null)
    {
        return new Book
        {
            Title = "Clean Code",
            Author = "Robert Martin",
            TotalPages = 400,
            CurrentPage = 100,
            StartDate = new DateOnly(2026, 1, 1),
            Status = status,
            CompletedDate = completedDate,
            UserId = TestAuthHandler.UserId
        };
    }

    private async Task<Book> PutStatusAsync(int id, string status)
    {
        var payload = new { id, title = "Clean Code", author = "Robert Martin", totalPages = 400, currentPage = 400, startDate = "2026-01-01", status, notes = "", bookType = "Literature" };
        var response = await _client.PutAsJsonAsync($"/api/books/{id}", payload);
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var book = await _client.GetFromJsonAsync<Book>($"/api/books/{id}");

        return book!;
    }

    [Fact]
    public async Task Update_ToCompleted_SetsCompletedDate()
    {
        var id = _factory.Seed(NewBook("Reading"));

        var book = await PutStatusAsync(id, "Completed");

        book.CompletedDate.Should().Be(DateOnly.FromDateTime(DateTime.Today));
    }

    [Fact]
    public async Task Update_AwayFromCompleted_ClearsCompletedDate()
    {
        var id = _factory.Seed(NewBook("Completed", new DateOnly(2026, 3, 1)));

        var book = await PutStatusAsync(id, "Reading");

        book.CompletedDate.Should().BeNull();
    }

    [Fact]
    public async Task Update_StaysCompleted_KeepsOriginalCompletedDate()
    {
        var id = _factory.Seed(NewBook("Completed", new DateOnly(2026, 3, 1)));

        var book = await PutStatusAsync(id, "Completed");

        book.CompletedDate.Should().Be(new DateOnly(2026, 3, 1));
    }

    // ── Rating (1–10) ───────────────────────────────────────────────────────

    private static object BookPayload(int id, int? rating)
    {
        return new { id, title = "Clean Code", author = "Robert Martin", totalPages = 400, currentPage = 400, startDate = "2026-01-01", status = "Completed", notes = "", bookType = "Literature", rating };
    }

    [Theory]
    [InlineData(1)]
    [InlineData(7)]
    [InlineData(10)]
    public async Task Create_PersistsRating_WhenWithinOneToTen(int rating)
    {
        var payload = new { title = "Clean Code", author = "Robert Martin", totalPages = 400, currentPage = 400, startDate = "2026-01-01", status = "Completed", notes = "", bookType = "Literature", rating };

        var response = await _client.PostAsJsonAsync("/api/books", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        _factory.GetAll<Book>().Single().Rating.Should().Be(rating);
    }

    [Fact]
    public async Task Create_LeavesRatingNull_WhenOmitted()
    {
        var payload = new { title = "Clean Code", author = "Robert Martin", totalPages = 400, currentPage = 0, startDate = "2026-01-01", status = "Reading", notes = "", bookType = "Literature" };

        await _client.PostAsJsonAsync("/api/books", payload);

        _factory.GetAll<Book>().Single().Rating.Should().BeNull();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(11)]
    public async Task Create_ReturnsBadRequest_WhenRatingOutOfRange(int rating)
    {
        var payload = new { title = "Clean Code", author = "Robert Martin", totalPages = 400, currentPage = 0, startDate = "2026-01-01", status = "Reading", notes = "", bookType = "Literature", rating };

        var response = await _client.PostAsJsonAsync("/api/books", payload);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        _factory.CountAll<Book>().Should().Be(0);
    }

    [Fact]
    public async Task Update_PersistsRating_AndCanChangeItLater()
    {
        var id = _factory.Seed(NewBook("Completed", new DateOnly(2026, 3, 1)));

        await _client.PutAsJsonAsync($"/api/books/{id}", BookPayload(id, 8));
        _factory.GetAll<Book>().Single().Rating.Should().Be(8);

        await _client.PutAsJsonAsync($"/api/books/{id}", BookPayload(id, 10));
        _factory.GetAll<Book>().Single().Rating.Should().Be(10);
    }

    [Fact]
    public async Task Update_WithNullRating_ClearsPreviousRating()
    {
        var book = NewBook("Completed", new DateOnly(2026, 3, 1));
        book.Rating = 9;
        var id = _factory.Seed(book);

        var response = await _client.PutAsJsonAsync($"/api/books/{id}", BookPayload(id, null));

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.GetAll<Book>().Single().Rating.Should().BeNull();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(11)]
    public async Task Update_ReturnsBadRequest_AndKeepsRating_WhenRatingOutOfRange(int rating)
    {
        var book = NewBook("Completed", new DateOnly(2026, 3, 1));
        book.Rating = 6;
        var id = _factory.Seed(book);

        var response = await _client.PutAsJsonAsync($"/api/books/{id}", BookPayload(id, rating));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        _factory.GetAll<Book>().Single().Rating.Should().Be(6);
    }

    [Fact]
    public async Task GetById_ReturnsRating()
    {
        var book = NewBook("Completed", new DateOnly(2026, 3, 1));
        book.Rating = 9;
        var id = _factory.Seed(book);

        var fetched = await _client.GetFromJsonAsync<Book>($"/api/books/{id}");

        fetched!.Rating.Should().Be(9);
    }
}
