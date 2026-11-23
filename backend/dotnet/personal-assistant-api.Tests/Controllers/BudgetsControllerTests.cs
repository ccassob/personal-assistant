using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using PersonalAssistant.Api.Controllers;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class BudgetsControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string OtherUserId = "other-user";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public BudgetsControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private int SeedCategory(string name = "Food", string type = "Expense", string userId = TestAuthHandler.UserId)
    {
        return _factory.Seed(new Category { Name = name, Type = type, Color = "#ff0000", Icon = "fork", UserId = userId });
    }

    private static Budget Bud(int categoryId, int month, int year, decimal target = 100m, string userId = TestAuthHandler.UserId)
    {
        return new Budget { CategoryId = categoryId, Month = month, Year = year, TargetAmount = target, UserId = userId };
    }

    private static Transaction Tx(int categoryId, string date, decimal amount, string type = "Expense", string userId = TestAuthHandler.UserId)
    {
        return new Transaction
        {
            Date = DateOnly.Parse(date),
            Amount = amount,
            Description = "Tx",
            Type = type,
            CategoryId = categoryId,
            UserId = userId,
        };
    }

    // ── GET /api/budgets ────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_FiltersByMonthAndYear_AndExcludesOtherUsers()
    {
        var food = SeedCategory();
        var theirs = SeedCategory("Theirs", userId: OtherUserId);
        _factory.SeedMany([
            Bud(food, 3, 2026, 10m),
            Bud(food, 4, 2026, 20m),
            Bud(food, 3, 2025, 30m),
            Bud(theirs, 3, 2026, 40m, OtherUserId),
        ]);

        (await _client.GetFromJsonAsync<Budget[]>("/api/budgets"))!.Select(b => b.TargetAmount)
            .Should().BeEquivalentTo([10m, 20m, 30m]);
        (await _client.GetFromJsonAsync<Budget[]>("/api/budgets?month=3"))!.Select(b => b.TargetAmount)
            .Should().BeEquivalentTo([10m, 30m]);
        (await _client.GetFromJsonAsync<Budget[]>("/api/budgets?year=2026"))!.Select(b => b.TargetAmount)
            .Should().BeEquivalentTo([10m, 20m]);
        (await _client.GetFromJsonAsync<Budget[]>("/api/budgets?month=3&year=2026"))!.Select(b => b.TargetAmount)
            .Should().Equal(10m);
    }

    [Fact]
    public async Task GetById_IncludesCategory_AndReturnsNotFoundForOtherUsers()
    {
        var food = SeedCategory("Food");
        var theirs = SeedCategory("Theirs", userId: OtherUserId);
        var mineId = _factory.Seed(Bud(food, 3, 2026));
        var theirsId = _factory.Seed(Bud(theirs, 3, 2026, userId: OtherUserId));

        var mine = await _client.GetFromJsonAsync<Budget>($"/api/budgets/{mineId}");
        var response = await _client.GetAsync($"/api/budgets/{theirsId}");

        mine!.Category!.Name.Should().Be("Food");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── POST / PUT / DELETE ─────────────────────────────────────────────────

    [Fact]
    public async Task Create_AssignsUserIdFromClaim_IgnoringPayload()
    {
        var food = SeedCategory();

        var response = await _client.PostAsJsonAsync("/api/budgets", Bud(food, 3, 2026, 150m, OtherUserId));

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var saved = _factory.GetAll<Budget>().Single();
        saved.UserId.Should().Be(TestAuthHandler.UserId);
        saved.TargetAmount.Should().Be(150m);
    }

    [Fact]
    public async Task Update_PersistsAllEditableFields()
    {
        var food = SeedCategory("Food");
        var rent = SeedCategory("Rent");
        var id = _factory.Seed(Bud(food, 3, 2026, 100m));
        var payload = new Budget { Id = id, CategoryId = rent, Month = 5, Year = 2027, TargetAmount = 999m };

        var response = await _client.PutAsJsonAsync($"/api/budgets/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var saved = _factory.GetAll<Budget>().Single();
        saved.CategoryId.Should().Be(rent);
        saved.Month.Should().Be(5);
        saved.Year.Should().Be(2027);
        saved.TargetAmount.Should().Be(999m);
        saved.UserId.Should().Be(TestAuthHandler.UserId);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var response = await _client.PutAsJsonAsync("/api/budgets/1", new Budget { Id = 99 });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_AndKeepsData_WhenOwnedByAnotherUser()
    {
        var theirs = SeedCategory("Theirs", userId: OtherUserId);
        var id = _factory.Seed(Bud(theirs, 3, 2026, 100m, OtherUserId));

        var response = await _client.PutAsJsonAsync($"/api/budgets/{id}", new Budget { Id = id, CategoryId = theirs, Month = 3, Year = 2026, TargetAmount = 1m });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<Budget>().Single().TargetAmount.Should().Be(100m);
    }

    [Fact]
    public async Task Delete_RemovesOwnedBudget_AndKeepsOtherUsers()
    {
        var food = SeedCategory();
        var theirs = SeedCategory("Theirs", userId: OtherUserId);
        var mineId = _factory.Seed(Bud(food, 3, 2026));
        var theirsId = _factory.Seed(Bud(theirs, 3, 2026, userId: OtherUserId));

        var ok = await _client.DeleteAsync($"/api/budgets/{mineId}");
        var notFound = await _client.DeleteAsync($"/api/budgets/{theirsId}");

        ok.StatusCode.Should().Be(HttpStatusCode.NoContent);
        notFound.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<Budget>().Single().UserId.Should().Be(OtherUserId);
    }

    // ── POST /api/budgets/upsert ────────────────────────────────────────────

    [Fact]
    public async Task Upsert_CreatesBudget_WhenNoneExistsForCategoryMonthYear()
    {
        var food = SeedCategory();

        var response = await _client.PostAsJsonAsync("/api/budgets/upsert", new UpsertBudgetRequest(food, 3, 2026, 250m));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var saved = _factory.GetAll<Budget>().Single();
        saved.CategoryId.Should().Be(food);
        saved.Month.Should().Be(3);
        saved.Year.Should().Be(2026);
        saved.TargetAmount.Should().Be(250m);
        saved.UserId.Should().Be(TestAuthHandler.UserId);
    }

    [Fact]
    public async Task Upsert_UpdatesExistingBudget_WithoutCreatingDuplicate()
    {
        var food = SeedCategory();
        var id = _factory.Seed(Bud(food, 3, 2026, 100m));

        var response = await _client.PostAsJsonAsync("/api/budgets/upsert", new UpsertBudgetRequest(food, 3, 2026, 300m));

        var returned = await response.Content.ReadFromJsonAsync<Budget>();
        returned!.Id.Should().Be(id);
        var saved = _factory.GetAll<Budget>().Single();
        saved.TargetAmount.Should().Be(300m);
    }

    [Fact]
    public async Task Upsert_CreatesSeparateBudget_ForDifferentMonthYearOrCategory()
    {
        var food = SeedCategory("Food");
        var rent = SeedCategory("Rent");
        _factory.Seed(Bud(food, 3, 2026, 100m));

        await _client.PostAsJsonAsync("/api/budgets/upsert", new UpsertBudgetRequest(food, 4, 2026, 1m));
        await _client.PostAsJsonAsync("/api/budgets/upsert", new UpsertBudgetRequest(food, 3, 2027, 2m));
        await _client.PostAsJsonAsync("/api/budgets/upsert", new UpsertBudgetRequest(rent, 3, 2026, 3m));

        _factory.CountAll<Budget>().Should().Be(4);
        _factory.GetAll<Budget>().Single(b => b.CategoryId == food && b.Month == 3 && b.Year == 2026).TargetAmount.Should().Be(100m);
    }

    [Fact]
    public async Task Upsert_DoesNotTouchAnotherUsersBudgetWithSameKey()
    {
        var food = SeedCategory();
        _factory.Seed(Bud(food, 3, 2026, 100m, OtherUserId));

        await _client.PostAsJsonAsync("/api/budgets/upsert", new UpsertBudgetRequest(food, 3, 2026, 300m));

        var all = _factory.GetAll<Budget>();
        all.Should().HaveCount(2);
        all.Single(b => b.UserId == OtherUserId).TargetAmount.Should().Be(100m);
        all.Single(b => b.UserId == TestAuthHandler.UserId).TargetAmount.Should().Be(300m);
    }

    // ── GET /api/budgets/year-summary ───────────────────────────────────────

    [Fact]
    public async Task YearSummary_ReturnsTwelveRowsPerExpenseCategory_AndSkipsIncomeCategories()
    {
        SeedCategory("Food");
        SeedCategory("Rent");
        SeedCategory("Salary", "Income");

        var rows = await _client.GetFromJsonAsync<JsonElement[]>("/api/budgets/year-summary?year=2026");

        rows.Should().HaveCount(24);
        rows!.Select(r => r.GetProperty("categoryName").GetString()).Distinct().Should().BeEquivalentTo("Food", "Rent");
        rows.Where(r => r.GetProperty("categoryName").GetString() == "Food")
            .Select(r => r.GetProperty("month").GetInt32()).Should().Equal(Enumerable.Range(1, 12));
        rows.Should().OnlyContain(r => r.GetProperty("year").GetInt32() == 2026);
        rows.Should().OnlyContain(r => r.GetProperty("targetAmount").GetDecimal() == 0m && r.GetProperty("actualSpent").GetDecimal() == 0m);
    }

    [Fact]
    public async Task YearSummary_FillsTargetsAndActualSpentPerMonth()
    {
        var food = SeedCategory("Food");
        _factory.SeedMany([
            Bud(food, 3, 2026, 200m),
            Bud(food, 4, 2026, 300m),
            Bud(food, 3, 2025, 999m),
        ]);
        _factory.SeedMany([
            Tx(food, "2026-03-05", 40m),
            Tx(food, "2026-03-20", 60m),
            Tx(food, "2026-03-21", 500m, "Income"),
            Tx(food, "2026-05-02", 70m),
            Tx(food, "2025-03-05", 888m),
        ]);

        var rows = await _client.GetFromJsonAsync<JsonElement[]>("/api/budgets/year-summary?year=2026");

        JsonElement Row(int month) => rows!.Single(r => r.GetProperty("month").GetInt32() == month);
        Row(3).GetProperty("targetAmount").GetDecimal().Should().Be(200m);
        Row(3).GetProperty("actualSpent").GetDecimal().Should().Be(100m);
        Row(4).GetProperty("targetAmount").GetDecimal().Should().Be(300m);
        Row(4).GetProperty("actualSpent").GetDecimal().Should().Be(0m);
        Row(5).GetProperty("targetAmount").GetDecimal().Should().Be(0m);
        Row(5).GetProperty("actualSpent").GetDecimal().Should().Be(70m);
        Row(1).GetProperty("actualSpent").GetDecimal().Should().Be(0m);
    }

    [Fact]
    public async Task YearSummary_IgnoresOtherUsersCategoriesBudgetsAndTransactions()
    {
        var mine = SeedCategory("Food");
        var theirs = SeedCategory("Theirs", userId: OtherUserId);
        _factory.Seed(Bud(theirs, 3, 2026, 777m, OtherUserId));
        _factory.Seed(Tx(theirs, "2026-03-05", 777m, userId: OtherUserId));
        _factory.Seed(Tx(mine, "2026-03-05", 5m));

        var rows = await _client.GetFromJsonAsync<JsonElement[]>("/api/budgets/year-summary?year=2026");

        rows.Should().HaveCount(12);
        rows!.Select(r => r.GetProperty("categoryName").GetString()).Distinct().Should().Equal("Food");
        rows.Single(r => r.GetProperty("month").GetInt32() == 3).GetProperty("actualSpent").GetDecimal().Should().Be(5m);
        rows.Should().OnlyContain(r => r.GetProperty("targetAmount").GetDecimal() == 0m);
    }
}
