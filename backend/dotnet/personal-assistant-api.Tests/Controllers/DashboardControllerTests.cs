using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class DashboardControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string OtherUserId = "other-user";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public DashboardControllerTests(PersonalAssistantApiFactory factory)
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
        decimal amount,
        string type = "Expense",
        string userId = TestAuthHandler.UserId)
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

    private void SeedCutoff(int cutoffDay, string userId = TestAuthHandler.UserId)
    {
        _factory.Seed(new AppSettings { CutoffDay = cutoffDay, UserId = userId });
    }

    private async Task<JsonElement> GetJson(string url)
    {
        var response = await _client.GetAsync(url);
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());

        return doc.RootElement.Clone();
    }

    // ── GET /api/dashboard/summary ──────────────────────────────────────────

    [Fact]
    public async Task Summary_ReturnsZerosAndEmptyLists_WhenNoData()
    {
        var json = await GetJson("/api/dashboard/summary?month=3&year=2026");

        json.GetProperty("totalIncome").GetDecimal().Should().Be(0);
        json.GetProperty("totalExpense").GetDecimal().Should().Be(0);
        json.GetProperty("totalInvested").GetDecimal().Should().Be(0);
        json.GetProperty("netBalance").GetDecimal().Should().Be(0);
        json.GetProperty("spendingByCategory").GetArrayLength().Should().Be(0);
        json.GetProperty("budgetVsActual").GetArrayLength().Should().Be(0);
        json.GetProperty("goals").GetArrayLength().Should().Be(0);
    }

    [Fact]
    public async Task Summary_TotalsByType_NetBalanceExcludesInvestments()
    {
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-03-05", 1000m, "Income"),
            Tx(cat, "2026-03-06", 250m, "Income"),
            Tx(cat, "2026-03-10", 300m),
            Tx(cat, "2026-03-11", 50.5m),
            Tx(cat, "2026-03-12", 400m, "Investment"),
        ]);

        var json = await GetJson("/api/dashboard/summary?month=3&year=2026");

        json.GetProperty("totalIncome").GetDecimal().Should().Be(1250m);
        json.GetProperty("totalExpense").GetDecimal().Should().Be(350.5m);
        json.GetProperty("totalInvested").GetDecimal().Should().Be(400m);
        json.GetProperty("netBalance").GetDecimal().Should().Be(899.5m);
    }

    [Fact]
    public async Task Summary_UsesCalendarMonth_WhenNoSettings()
    {
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-02-28", 1m),
            Tx(cat, "2026-03-01", 10m),
            Tx(cat, "2026-03-31", 20m),
            Tx(cat, "2026-04-01", 2m),
        ]);

        var json = await GetJson("/api/dashboard/summary?month=3&year=2026");

        json.GetProperty("totalExpense").GetDecimal().Should().Be(30m);
    }

    [Fact]
    public async Task Summary_UsesBillingPeriod_WhenCutoffIs15()
    {
        SeedCutoff(15);
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-03-14", 1m),
            Tx(cat, "2026-03-15", 10m),
            Tx(cat, "2026-04-14", 20m),
            Tx(cat, "2026-04-15", 2m),
        ]);

        var json = await GetJson("/api/dashboard/summary?month=3&year=2026");

        json.GetProperty("totalExpense").GetDecimal().Should().Be(30m);
    }

    [Fact]
    public async Task Summary_ClampsCutoffToShortMonth()
    {
        // Cutoff 31 in February 2026 clamps to the 28th; the period ends on March 27th.
        SeedCutoff(31);
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-02-27", 1m),
            Tx(cat, "2026-02-28", 10m),
            Tx(cat, "2026-03-27", 20m),
            Tx(cat, "2026-03-28", 2m),
        ]);

        var json = await GetJson("/api/dashboard/summary?month=2&year=2026");

        json.GetProperty("totalExpense").GetDecimal().Should().Be(30m);
    }

    [Fact]
    public async Task Summary_SpendingByCategory_GroupsOnlyExpenses()
    {
        var food = SeedCategory("Food");
        var rent = SeedCategory("Rent");
        _factory.SeedMany([
            Tx(food, "2026-03-05", 10m),
            Tx(food, "2026-03-06", 15m),
            Tx(rent, "2026-03-07", 500m),
            Tx(food, "2026-03-08", 999m, "Income"),
            Tx(rent, "2026-03-09", 999m, "Investment"),
        ]);

        var json = await GetJson("/api/dashboard/summary?month=3&year=2026");

        var rows = json.GetProperty("spendingByCategory").EnumerateArray().ToList();
        rows.Should().HaveCount(2);
        var foodRow = rows.Single(r => r.GetProperty("categoryName").GetString() == "Food");
        foodRow.GetProperty("categoryId").GetInt32().Should().Be(food);
        foodRow.GetProperty("color").GetString().Should().Be("#ff0000");
        foodRow.GetProperty("amount").GetDecimal().Should().Be(25m);
        rows.Single(r => r.GetProperty("categoryName").GetString() == "Rent")
            .GetProperty("amount").GetDecimal().Should().Be(500m);
    }

    [Fact]
    public async Task Summary_BudgetVsActual_ComparesTargetWithExpensesOfThatCategoryInPeriod()
    {
        var food = SeedCategory("Food");
        var rent = SeedCategory("Rent");
        _factory.SeedMany([
            new Budget { CategoryId = food, Month = 3, Year = 2026, TargetAmount = 200m, UserId = TestAuthHandler.UserId },
            new Budget { CategoryId = rent, Month = 3, Year = 2026, TargetAmount = 600m, UserId = TestAuthHandler.UserId },
            new Budget { CategoryId = food, Month = 4, Year = 2026, TargetAmount = 999m, UserId = TestAuthHandler.UserId },
            new Budget { CategoryId = food, Month = 3, Year = 2025, TargetAmount = 888m, UserId = TestAuthHandler.UserId },
        ]);
        _factory.SeedMany([
            Tx(food, "2026-03-05", 40m),
            Tx(food, "2026-03-06", 60m),
            Tx(food, "2026-03-07", 500m, "Income"),
            Tx(food, "2026-04-02", 700m),
        ]);

        var json = await GetJson("/api/dashboard/summary?month=3&year=2026");

        var rows = json.GetProperty("budgetVsActual").EnumerateArray().ToList();
        rows.Should().HaveCount(2);
        var foodRow = rows.Single(r => r.GetProperty("categoryId").GetInt32() == food);
        foodRow.GetProperty("categoryName").GetString().Should().Be("Food");
        foodRow.GetProperty("target").GetDecimal().Should().Be(200m);
        foodRow.GetProperty("actual").GetDecimal().Should().Be(100m);
        var rentRow = rows.Single(r => r.GetProperty("categoryId").GetInt32() == rent);
        rentRow.GetProperty("target").GetDecimal().Should().Be(600m);
        rentRow.GetProperty("actual").GetDecimal().Should().Be(0m);
    }

    [Fact]
    public async Task Summary_Goals_ReturnsAllOwnGoals_RegardlessOfPeriod()
    {
        _factory.SeedMany([
            new Goal { Name = "Car", TargetAmount = 20000m, CurrentAmount = 5000m, Status = "Active", Deadline = new DateOnly(2030, 1, 1), UserId = TestAuthHandler.UserId },
            new Goal { Name = "Trip", TargetAmount = 3000m, CurrentAmount = 3000m, Status = "Completed", Deadline = new DateOnly(2020, 1, 1), UserId = TestAuthHandler.UserId },
            new Goal { Name = "Theirs", TargetAmount = 1m, CurrentAmount = 1m, Status = "Active", Deadline = new DateOnly(2030, 1, 1), UserId = OtherUserId },
        ]);

        var json = await GetJson("/api/dashboard/summary?month=3&year=2026");

        var goals = json.GetProperty("goals").EnumerateArray().ToList();
        goals.Select(g => g.GetProperty("name").GetString()).Should().BeEquivalentTo("Car", "Trip");
        var car = goals.Single(g => g.GetProperty("name").GetString() == "Car");
        car.GetProperty("targetAmount").GetDecimal().Should().Be(20000m);
        car.GetProperty("currentAmount").GetDecimal().Should().Be(5000m);
        car.GetProperty("status").GetString().Should().Be("Active");
    }

    [Fact]
    public async Task Summary_IgnoresOtherUsersTransactionsBudgetsAndCutoff()
    {
        SeedCutoff(20, OtherUserId);
        var mine = SeedCategory("Food");
        var theirs = SeedCategory("Theirs", OtherUserId);
        _factory.SeedMany([
            Tx(mine, "2026-03-05", 10m),
            Tx(theirs, "2026-03-05", 777m, userId: OtherUserId),
            Tx(theirs, "2026-03-06", 777m, "Income", OtherUserId),
        ]);
        _factory.Seed(new Budget { CategoryId = theirs, Month = 3, Year = 2026, TargetAmount = 5m, UserId = OtherUserId });

        var json = await GetJson("/api/dashboard/summary?month=3&year=2026");

        json.GetProperty("totalExpense").GetDecimal().Should().Be(10m);
        json.GetProperty("totalIncome").GetDecimal().Should().Be(0m);
        json.GetProperty("spendingByCategory").GetArrayLength().Should().Be(1);
        json.GetProperty("budgetVsActual").GetArrayLength().Should().Be(0);
    }

    // ── GET /api/dashboard/trend ────────────────────────────────────────────

    [Fact]
    public async Task Trend_ReturnsOnePointPerMonth_OldestFirst_EndingAtRequestedMonth()
    {
        var json = await GetJson("/api/dashboard/trend?months=3&month=3&year=2026");

        var points = json.EnumerateArray().ToList();
        points.Select(p => (p.GetProperty("year").GetInt32(), p.GetProperty("month").GetInt32()))
            .Should().Equal((2026, 1), (2026, 2), (2026, 3));
    }

    [Fact]
    public async Task Trend_CrossesYearBoundary()
    {
        var json = await GetJson("/api/dashboard/trend?months=3&month=1&year=2026");

        json.EnumerateArray()
            .Select(p => (p.GetProperty("year").GetInt32(), p.GetProperty("month").GetInt32()))
            .Should().Equal((2025, 11), (2025, 12), (2026, 1));
    }

    [Fact]
    public async Task Trend_DefaultsToSixMonths()
    {
        var json = await GetJson("/api/dashboard/trend");

        json.GetArrayLength().Should().Be(6);
    }

    [Fact]
    public async Task Trend_SumsIncomeExpenseAndInvestedPerPeriod()
    {
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-02-10", 100m, "Income"),
            Tx(cat, "2026-02-11", 30m),
            Tx(cat, "2026-02-12", 20m),
            Tx(cat, "2026-02-13", 40m, "Investment"),
            Tx(cat, "2026-03-10", 500m, "Income"),
            Tx(cat, "2026-03-11", 5m),
        ]);

        var json = await GetJson("/api/dashboard/trend?months=2&month=3&year=2026");

        var points = json.EnumerateArray().ToList();
        points[0].GetProperty("income").GetDecimal().Should().Be(100m);
        points[0].GetProperty("expense").GetDecimal().Should().Be(50m);
        points[0].GetProperty("invested").GetDecimal().Should().Be(40m);
        points[1].GetProperty("income").GetDecimal().Should().Be(500m);
        points[1].GetProperty("expense").GetDecimal().Should().Be(5m);
        points[1].GetProperty("invested").GetDecimal().Should().Be(0m);
    }

    [Fact]
    public async Task Trend_UsesBillingPeriods_WhenCutoffIs15()
    {
        SeedCutoff(15);
        var cat = SeedCategory();
        _factory.SeedMany([
            Tx(cat, "2026-02-14", 1m),
            Tx(cat, "2026-02-15", 10m),
            Tx(cat, "2026-03-14", 20m),
            Tx(cat, "2026-03-15", 300m),
        ]);

        var json = await GetJson("/api/dashboard/trend?months=2&month=3&year=2026");

        // Period "February" = Feb 15..Mar 14; period "March" = Mar 15..Apr 14.
        var points = json.EnumerateArray().ToList();
        points[0].GetProperty("expense").GetDecimal().Should().Be(30m);
        points[1].GetProperty("expense").GetDecimal().Should().Be(300m);
    }

    [Fact]
    public async Task Trend_IgnoresOtherUsersTransactions()
    {
        var mine = SeedCategory();
        var theirs = SeedCategory("Theirs", OtherUserId);
        _factory.SeedMany([
            Tx(mine, "2026-03-10", 5m),
            Tx(theirs, "2026-03-10", 999m, userId: OtherUserId),
        ]);

        var json = await GetJson("/api/dashboard/trend?months=1&month=3&year=2026");

        json.EnumerateArray().Single().GetProperty("expense").GetDecimal().Should().Be(5m);
    }
}
