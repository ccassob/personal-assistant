using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PersonalAssistant.Api.Controllers;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class TransactionsControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string OtherUserId = "other-user";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    private record ImportResult(int Imported, int Errors);

    private record DeleteResult(int Deleted);

    public TransactionsControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private int SeedCategory(string name = "Food", string userId = TestAuthHandler.UserId)
    {
        return _factory.Seed(new Category { Name = name, Type = "Expense", Color = "#ff0000", Icon = "fork", UserId = userId });
    }

    private static Transaction Tx(
        int categoryId,
        string date,
        string description = "Tx",
        string type = "Expense",
        bool isExecuted = true,
        string userId = TestAuthHandler.UserId)
    {
        return new Transaction
        {
            Date = DateOnly.Parse(date),
            Amount = 10m,
            Description = description,
            Type = type,
            CategoryId = categoryId,
            IsExecuted = isExecuted,
            UserId = userId,
        };
    }

    private void SeedCutoff(int cutoffDay)
    {
        _factory.Seed(new AppSettings { CutoffDay = cutoffDay, UserId = TestAuthHandler.UserId });
    }

    private async Task<string[]> GetDescriptions(string query)
    {
        var rows = await _client.GetFromJsonAsync<Transaction[]>($"/api/transactions{query}");

        return rows!.Select(t => t.Description).ToArray();
    }

    // ── GET /api/transactions ───────────────────────────────────────────────

    [Fact]
    public async Task GetAll_DoesNotReturnOtherUsersTransactions()
    {
        var mine = SeedCategory();
        var theirs = SeedCategory("Theirs", OtherUserId);
        _factory.SeedMany([
            Tx(mine, "2026-03-10", "Mine"),
            Tx(theirs, "2026-03-10", "Theirs", userId: OtherUserId),
        ]);

        (await GetDescriptions("")).Should().Equal("Mine");
    }

    [Fact]
    public async Task GetAll_OrdersExecutedFirst_ThenByDateAscending()
    {
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-03-01", "pending-early", isExecuted: false),
            Tx(cat, "2026-03-20", "executed-late"),
            Tx(cat, "2026-03-05", "executed-early"),
            Tx(cat, "2026-03-10", "pending-late", isExecuted: false),
        ]);

        (await GetDescriptions("")).Should().Equal("executed-early", "executed-late", "pending-early", "pending-late");
    }

    [Fact]
    public async Task GetAll_FiltersByCategoryAndType()
    {
        var food = SeedCategory("Food");
        var salary = SeedCategory("Salary");
        _factory.SeedMany([
            Tx(food, "2026-03-10", "food-expense"),
            Tx(salary, "2026-03-10", "salary-income", type: "Income"),
            Tx(salary, "2026-03-11", "salary-expense"),
        ]);

        (await GetDescriptions($"?categoryId={salary}")).Should().BeEquivalentTo("salary-income", "salary-expense");
        (await GetDescriptions("?type=Income")).Should().Equal("salary-income");
        (await GetDescriptions($"?categoryId={salary}&type=Expense")).Should().Equal("salary-expense");
    }

    [Fact]
    public async Task GetAll_WithMonthAndYear_UsesDefaultCutoffOfFirst_WhenNoSettings()
    {
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-02-28", "before"),
            Tx(cat, "2026-03-01", "first-day"),
            Tx(cat, "2026-03-31", "last-day"),
            Tx(cat, "2026-04-01", "after"),
        ]);

        (await GetDescriptions("?month=3&year=2026")).Should().Equal("first-day", "last-day");
    }

    [Fact]
    public async Task GetAll_WithMonthAndYear_FiltersByBillingPeriod_WhenCutoffIs15()
    {
        SeedCutoff(15);
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-03-14", "before-start"),
            Tx(cat, "2026-03-15", "period-start"),
            Tx(cat, "2026-04-14", "period-end"),
            Tx(cat, "2026-04-15", "after-end"),
        ]);

        (await GetDescriptions("?month=3&year=2026")).Should().Equal("period-start", "period-end");
    }

    [Fact]
    public async Task GetAll_WithMonthAndYear_ClampsCutoffToShortMonth()
    {
        // Cutoff 31 in February 2026 (28 days) clamps to the 28th; the period ends on March 27th.
        SeedCutoff(31);
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-02-27", "before"),
            Tx(cat, "2026-02-28", "start"),
            Tx(cat, "2026-03-27", "end"),
            Tx(cat, "2026-03-28", "after"),
        ]);

        (await GetDescriptions("?month=2&year=2026")).Should().Equal("start", "end");
    }

    [Fact]
    public async Task GetAll_WithMonthAndYear_IgnoresOtherUsersCutoff()
    {
        _factory.Seed(new AppSettings { CutoffDay = 20, UserId = OtherUserId });
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-03-05", "in-default-period"),
            Tx(cat, "2026-03-25", "in-default-period-too"),
        ]);

        (await GetDescriptions("?month=3&year=2026")).Should().Equal("in-default-period", "in-default-period-too");
    }

    [Fact]
    public async Task GetAll_WithOnlyMonth_FiltersByCalendarMonthAcrossYears()
    {
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2025-03-10", "march-2025"),
            Tx(cat, "2026-03-10", "march-2026"),
            Tx(cat, "2026-04-10", "april-2026"),
        ]);

        (await GetDescriptions("?month=3")).Should().Equal("march-2025", "march-2026");
    }

    [Fact]
    public async Task GetAll_WithOnlyYear_FiltersByCalendarYear()
    {
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2025-12-31", "last-year"),
            Tx(cat, "2026-01-01", "this-year"),
        ]);

        (await GetDescriptions("?year=2026")).Should().Equal("this-year");
    }

    // ── GET /api/transactions/{id} ──────────────────────────────────────────

    [Fact]
    public async Task GetById_ReturnsTransaction_WhenOwned()
    {
        var cat = SeedCategory();
        var id = _factory.Seed(Tx(cat, "2026-03-10", "Mine"));

        var tx = await _client.GetFromJsonAsync<Transaction>($"/api/transactions/{id}");

        tx!.Description.Should().Be("Mine");
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenOwnedByAnotherUser()
    {
        var theirs = SeedCategory("Theirs", OtherUserId);
        var id = _factory.Seed(Tx(theirs, "2026-03-10", userId: OtherUserId));

        var response = await _client.GetAsync($"/api/transactions/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── POST /api/transactions ──────────────────────────────────────────────

    [Fact]
    public async Task Create_AssignsUserIdFromClaim_IgnoringPayload()
    {
        var cat = SeedCategory();
        var payload = Tx(cat, "2026-03-10", "Created", userId: OtherUserId);

        var response = await _client.PostAsJsonAsync("/api/transactions", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var created = await response.Content.ReadFromJsonAsync<Transaction>();
        created!.UserId.Should().Be(TestAuthHandler.UserId);
        var fetched = await _client.GetFromJsonAsync<Transaction>(response.Headers.Location);
        fetched!.Description.Should().Be("Created");
    }

    // ── PUT /api/transactions/{id} ──────────────────────────────────────────

    [Fact]
    public async Task Update_PersistsAllEditableFields()
    {
        var food = SeedCategory("Food");
        var other = SeedCategory("Other");
        var id = _factory.Seed(Tx(food, "2026-03-10", "Old", isExecuted: false));
        var payload = new Transaction
        {
            Id = id,
            Date = new DateOnly(2026, 4, 2),
            Amount = 99.5m,
            Description = "New",
            Type = "Income",
            CategoryId = other,
            Notes = "note",
            IsExecuted = true,
        };

        var response = await _client.PutAsJsonAsync($"/api/transactions/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var fetched = await _client.GetFromJsonAsync<Transaction>($"/api/transactions/{id}");
        fetched!.Date.Should().Be(new DateOnly(2026, 4, 2));
        fetched.Amount.Should().Be(99.5m);
        fetched.Description.Should().Be("New");
        fetched.Type.Should().Be("Income");
        fetched.CategoryId.Should().Be(other);
        fetched.Notes.Should().Be("note");
        fetched.IsExecuted.Should().BeTrue();
        fetched.UserId.Should().Be(TestAuthHandler.UserId);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var payload = new Transaction { Id = 99, Description = "x" };

        var response = await _client.PutAsJsonAsync("/api/transactions/1", payload);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenOwnedByAnotherUser()
    {
        var theirs = SeedCategory("Theirs", OtherUserId);
        var id = _factory.Seed(Tx(theirs, "2026-03-10", "Theirs", userId: OtherUserId));
        var payload = new Transaction { Id = id, Description = "Hijacked", Type = "Expense", CategoryId = theirs };

        var response = await _client.PutAsJsonAsync($"/api/transactions/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── DELETE /api/transactions/{id} ───────────────────────────────────────

    [Fact]
    public async Task Delete_RemovesOwnedTransaction()
    {
        var cat = SeedCategory();
        var id = _factory.Seed(Tx(cat, "2026-03-10"));

        var response = await _client.DeleteAsync($"/api/transactions/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.CountAll<Transaction>().Should().Be(0);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_AndKeepsTransaction_WhenOwnedByAnotherUser()
    {
        var theirs = SeedCategory("Theirs", OtherUserId);
        var id = _factory.Seed(Tx(theirs, "2026-03-10", userId: OtherUserId));

        var response = await _client.DeleteAsync($"/api/transactions/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.CountAll<Transaction>().Should().Be(1);
    }

    // ── DELETE /api/transactions (bulk) ─────────────────────────────────────

    [Fact]
    public async Task DeleteAll_WithoutFilters_DeletesOnlyOwnTransactions()
    {
        var mine = SeedCategory();
        var theirs = SeedCategory("Theirs", OtherUserId);
        _factory.SeedMany([
            Tx(mine, "2026-03-10", "a"),
            Tx(mine, "2026-03-11", "b"),
            Tx(theirs, "2026-03-10", "theirs", userId: OtherUserId),
        ]);

        var response = await _client.DeleteAsync("/api/transactions");

        var result = await response.Content.ReadFromJsonAsync<DeleteResult>();
        result!.Deleted.Should().Be(2);
        _factory.CountAll<Transaction>().Should().Be(1);
    }

    [Fact]
    public async Task DeleteAll_WithMonthAndYear_RespectsBillingPeriod()
    {
        SeedCutoff(15);
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-03-14", "before"),
            Tx(cat, "2026-03-15", "inside"),
            Tx(cat, "2026-04-15", "after"),
        ]);

        var response = await _client.DeleteAsync("/api/transactions?month=3&year=2026");

        var result = await response.Content.ReadFromJsonAsync<DeleteResult>();
        result!.Deleted.Should().Be(1);
        (await GetDescriptions("")).Should().Equal("before", "after");
    }

    [Fact]
    public async Task DeleteAll_WithTypeFilter_DeletesOnlyMatchingType()
    {
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-03-10", "income", type: "Income"),
            Tx(cat, "2026-03-11", "expense"),
        ]);

        await _client.DeleteAsync("/api/transactions?type=Income");

        (await GetDescriptions("")).Should().Equal("expense");
    }

    // ── POST /api/transactions/import ───────────────────────────────────────

    [Fact]
    public async Task Import_CreatesValidRows_AndMatchesCategoryCaseInsensitively()
    {
        var food = SeedCategory("Food");
        var rows = new[]
        {
            new ImportTransactionRow("2026-03-10", "Lunch", 12.5m, "Expense", "  fOOd ", "n", true),
            new ImportTransactionRow("2026-03-11", "Pay", 100m, "Income", null, null, false),
        };

        var response = await _client.PostAsJsonAsync("/api/transactions/import", rows);

        var result = await response.Content.ReadFromJsonAsync<ImportResult>();
        result.Should().Be(new ImportResult(2, 0));
        var saved = _factory.GetAll<Transaction>();
        var lunch = saved.Single(t => t.Description == "Lunch");
        lunch.CategoryId.Should().Be(food);
        lunch.Amount.Should().Be(12.5m);
        lunch.Notes.Should().Be("n");
        lunch.UserId.Should().Be(TestAuthHandler.UserId);
        saved.Single(t => t.Description == "Pay").CategoryId.Should().Be(0);
    }

    [Fact]
    public async Task Import_CountsInvalidRowsAsErrors_AndImportsTheRest()
    {
        var rows = new[]
        {
            new ImportTransactionRow("not-a-date", "bad date", 10m, "Expense", null, null, true),
            new ImportTransactionRow("2026-03-10", "zero amount", 0m, "Expense", null, null, true),
            new ImportTransactionRow("2026-03-10", "negative amount", -5m, "Expense", null, null, true),
            new ImportTransactionRow("2026-03-10", "bad type", 10m, "Investment", null, null, true),
            new ImportTransactionRow("2026-03-10", "good", 10m, "Expense", null, null, true),
        };

        var response = await _client.PostAsJsonAsync("/api/transactions/import", rows);

        var result = await response.Content.ReadFromJsonAsync<ImportResult>();
        result.Should().Be(new ImportResult(1, 4));
        _factory.GetAll<Transaction>().Select(t => t.Description).Should().Equal("good");
    }

    [Fact]
    public async Task Import_DoesNotMatchCategoriesOwnedByAnotherUser()
    {
        SeedCategory("Shared", OtherUserId);
        var rows = new[] { new ImportTransactionRow("2026-03-10", "Tx", 10m, "Expense", "Shared", null, true) };

        await _client.PostAsJsonAsync("/api/transactions/import", rows);

        _factory.GetAll<Transaction>().Single().CategoryId.Should().Be(0);
    }
}
