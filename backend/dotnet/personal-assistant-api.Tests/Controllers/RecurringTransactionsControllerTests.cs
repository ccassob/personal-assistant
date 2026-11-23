using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class RecurringTransactionsControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string OtherUserId = "other-user";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    private record GenerateResult(int Generated);

    public RecurringTransactionsControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private int SeedCategory(string userId = TestAuthHandler.UserId)
    {
        return _factory.Seed(new Category { Name = "Bills", Type = "Expense", Color = "#ff0000", Icon = "bill", UserId = userId });
    }

    private static RecurringTransaction Template(
        int categoryId,
        int dayOfMonth,
        string description = "Rent",
        bool isActive = true,
        string userId = TestAuthHandler.UserId)
    {
        return new RecurringTransaction
        {
            Description = description,
            Amount = 100m,
            Type = "Expense",
            CategoryId = categoryId,
            DayOfMonth = dayOfMonth,
            Notes = "monthly",
            IsActive = isActive,
            UserId = userId,
        };
    }

    private void SeedCutoff(int cutoffDay, string userId = TestAuthHandler.UserId)
    {
        _factory.Seed(new AppSettings { CutoffDay = cutoffDay, UserId = userId });
    }

    private async Task<HttpResponseMessage> Generate(int month, int year)
    {
        return await _client.PostAsync($"/api/recurring-transactions/generate?month={month}&year={year}", null);
    }

    private DateOnly[] GeneratedDates()
    {
        return _factory.GetAll<Transaction>().Select(t => t.Date).OrderBy(d => d).ToArray();
    }

    // ── POST /api/recurring-transactions/generate ───────────────────────────

    [Theory]
    [InlineData(0, 2026)]
    [InlineData(13, 2026)]
    [InlineData(-1, 2026)]
    [InlineData(3, 1999)]
    public async Task Generate_ReturnsBadRequest_ForInvalidMonthOrYear(int month, int year)
    {
        var cat = SeedCategory();
        _factory.Seed(Template(cat, 10));

        var response = await Generate(month, year);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        _factory.CountAll<Transaction>().Should().Be(0);
    }

    [Fact]
    public async Task Generate_ReturnsZero_WhenNoTemplates()
    {
        var response = await Generate(3, 2026);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<GenerateResult>();
        result!.Generated.Should().Be(0);
        _factory.CountAll<Transaction>().Should().Be(0);
    }

    [Fact]
    public async Task Generate_PlacesEverythingInSelectedMonth_WhenNoSettings()
    {
        var cat = SeedCategory();
        _factory.SeedMany([Template(cat, 1, "first"), Template(cat, 15, "mid"), Template(cat, 31, "last")]);

        await Generate(3, 2026);

        GeneratedDates().Should().Equal(new DateOnly(2026, 3, 1), new DateOnly(2026, 3, 15), new DateOnly(2026, 3, 31));
    }

    [Fact]
    public async Task Generate_SplitsByCutoff_DayAtOrAboveCutoffStaysInSelectedMonth()
    {
        SeedCutoff(15);
        var cat = SeedCategory();
        _factory.SeedMany([
            Template(cat, 20, "above"),
            Template(cat, 15, "at-cutoff"),
            Template(cat, 14, "just-below"),
            Template(cat, 5, "below"),
        ]);

        await Generate(3, 2026);

        var byDescription = _factory.GetAll<Transaction>().ToDictionary(t => t.Description, t => t.Date);
        byDescription["above"].Should().Be(new DateOnly(2026, 3, 20));
        byDescription["at-cutoff"].Should().Be(new DateOnly(2026, 3, 15));
        byDescription["just-below"].Should().Be(new DateOnly(2026, 4, 14));
        byDescription["below"].Should().Be(new DateOnly(2026, 4, 5));
    }

    [Fact]
    public async Task Generate_RollsOverToNextYear_WhenDecemberTemplateIsBelowCutoff()
    {
        SeedCutoff(15);
        var cat = SeedCategory();
        _factory.SeedMany([Template(cat, 5, "below"), Template(cat, 20, "above")]);

        await Generate(12, 2026);

        GeneratedDates().Should().Equal(new DateOnly(2026, 12, 20), new DateOnly(2027, 1, 5));
    }

    [Fact]
    public async Task Generate_ClampsDayToLastDayOfTargetMonth()
    {
        var cat = SeedCategory();
        _factory.Seed(Template(cat, 31));

        await Generate(2, 2026);

        GeneratedDates().Should().Equal(new DateOnly(2026, 2, 28));
    }

    [Fact]
    public async Task Generate_ClampsDayInLeapYearFebruary()
    {
        var cat = SeedCategory();
        _factory.Seed(Template(cat, 31));

        await Generate(2, 2028);

        GeneratedDates().Should().Equal(new DateOnly(2028, 2, 29));
    }

    [Fact]
    public async Task Generate_ClampsToNextMonth_WhenDayIsBelowCutoffAndNextMonthIsShorter()
    {
        // Day 30 < cutoff 31, so it lands in February (next month) and clamps to the 28th.
        SeedCutoff(31);
        var cat = SeedCategory();
        _factory.Seed(Template(cat, 30));

        await Generate(1, 2026);

        GeneratedDates().Should().Equal(new DateOnly(2026, 2, 28));
    }

    [Fact]
    public async Task Generate_SkipsInactiveTemplates()
    {
        var cat = SeedCategory();
        _factory.SeedMany([Template(cat, 10, "active"), Template(cat, 11, "inactive", isActive: false)]);

        var response = await Generate(3, 2026);

        var result = await response.Content.ReadFromJsonAsync<GenerateResult>();
        result!.Generated.Should().Be(1);
        _factory.GetAll<Transaction>().Select(t => t.Description).Should().Equal("active");
    }

    [Fact]
    public async Task Generate_IgnoresOtherUsersTemplates_AndOtherUsersCutoff()
    {
        SeedCutoff(25, OtherUserId);
        var theirs = SeedCategory(OtherUserId);
        var mine = SeedCategory();
        _factory.SeedMany([
            Template(mine, 10, "mine"),
            Template(theirs, 10, "theirs", userId: OtherUserId),
        ]);

        var response = await Generate(3, 2026);

        var result = await response.Content.ReadFromJsonAsync<GenerateResult>();
        result!.Generated.Should().Be(1);
        var created = _factory.GetAll<Transaction>().Single();
        created.Description.Should().Be("mine");
        created.Date.Should().Be(new DateOnly(2026, 3, 10));
    }

    [Fact]
    public async Task Generate_CopiesTemplateFields_AsPendingTransactionOwnedByCurrentUser()
    {
        var cat = SeedCategory();
        _factory.Seed(new RecurringTransaction
        {
            Description = "Salary",
            Amount = 2500.75m,
            Type = "Income",
            CategoryId = cat,
            DayOfMonth = 1,
            Notes = "paycheck",
            IsActive = true,
            UserId = TestAuthHandler.UserId,
        });

        await Generate(3, 2026);

        var tx = _factory.GetAll<Transaction>().Single();
        tx.Description.Should().Be("Salary");
        tx.Amount.Should().Be(2500.75m);
        tx.Type.Should().Be("Income");
        tx.CategoryId.Should().Be(cat);
        tx.Notes.Should().Be("paycheck");
        tx.IsExecuted.Should().BeFalse();
        tx.UserId.Should().Be(TestAuthHandler.UserId);
    }

    // ── GET /api/recurring-transactions ─────────────────────────────────────

    [Fact]
    public async Task GetAll_OrdersByDistanceFromCutoff()
    {
        SeedCutoff(15);
        var cat = SeedCategory();
        _factory.SeedMany([Template(cat, 5, "d5"), Template(cat, 14, "d14"), Template(cat, 20, "d20"), Template(cat, 15, "d15")]);

        var items = await _client.GetFromJsonAsync<RecurringTransaction[]>("/api/recurring-transactions");

        items!.Select(i => i.Description).Should().Equal("d15", "d20", "d5", "d14");
    }

    [Fact]
    public async Task GetAll_OrdersByDayOfMonth_WhenNoSettings()
    {
        var cat = SeedCategory();
        _factory.SeedMany([Template(cat, 20, "d20"), Template(cat, 5, "d5"), Template(cat, 15, "d15")]);

        var items = await _client.GetFromJsonAsync<RecurringTransaction[]>("/api/recurring-transactions");

        items!.Select(i => i.Description).Should().Equal("d5", "d15", "d20");
    }

    [Fact]
    public async Task GetAll_DoesNotReturnOtherUsersTemplates()
    {
        var mine = SeedCategory();
        var theirs = SeedCategory(OtherUserId);
        _factory.SeedMany([Template(mine, 10, "mine"), Template(theirs, 10, "theirs", userId: OtherUserId)]);

        var items = await _client.GetFromJsonAsync<RecurringTransaction[]>("/api/recurring-transactions");

        items!.Select(i => i.Description).Should().Equal("mine");
    }

    // ── GET /{id}, POST, PUT, DELETE ────────────────────────────────────────

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenOwnedByAnotherUser()
    {
        var theirs = SeedCategory(OtherUserId);
        var id = _factory.Seed(Template(theirs, 10, userId: OtherUserId));

        var response = await _client.GetAsync($"/api/recurring-transactions/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Create_AssignsUserIdFromClaim_IgnoringPayload()
    {
        var cat = SeedCategory();
        var payload = Template(cat, 10, "Created", userId: OtherUserId);

        var response = await _client.PostAsJsonAsync("/api/recurring-transactions", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var saved = _factory.GetAll<RecurringTransaction>().Single();
        saved.UserId.Should().Be(TestAuthHandler.UserId);
        saved.Description.Should().Be("Created");
    }

    [Fact]
    public async Task Update_PersistsAllEditableFields()
    {
        var cat = SeedCategory();
        var id = _factory.Seed(Template(cat, 10, "Old"));
        var payload = new RecurringTransaction
        {
            Id = id,
            Description = "New",
            Amount = 55m,
            Type = "Income",
            CategoryId = cat,
            DayOfMonth = 25,
            Notes = "changed",
            IsActive = false,
        };

        var response = await _client.PutAsJsonAsync($"/api/recurring-transactions/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var saved = _factory.GetAll<RecurringTransaction>().Single();
        saved.Description.Should().Be("New");
        saved.Amount.Should().Be(55m);
        saved.Type.Should().Be("Income");
        saved.DayOfMonth.Should().Be(25);
        saved.Notes.Should().Be("changed");
        saved.IsActive.Should().BeFalse();
        saved.UserId.Should().Be(TestAuthHandler.UserId);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var payload = new RecurringTransaction { Id = 99, Description = "x" };

        var response = await _client.PutAsJsonAsync("/api/recurring-transactions/1", payload);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_AndKeepsData_WhenOwnedByAnotherUser()
    {
        var theirs = SeedCategory(OtherUserId);
        var id = _factory.Seed(Template(theirs, 10, "Theirs", userId: OtherUserId));
        var payload = new RecurringTransaction { Id = id, Description = "Hijacked", Type = "Expense", CategoryId = theirs };

        var response = await _client.PutAsJsonAsync($"/api/recurring-transactions/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<RecurringTransaction>().Single().Description.Should().Be("Theirs");
    }

    [Fact]
    public async Task Delete_RemovesOwnedTemplate()
    {
        var cat = SeedCategory();
        var id = _factory.Seed(Template(cat, 10));

        var response = await _client.DeleteAsync($"/api/recurring-transactions/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.CountAll<RecurringTransaction>().Should().Be(0);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_AndKeepsTemplate_WhenOwnedByAnotherUser()
    {
        var theirs = SeedCategory(OtherUserId);
        var id = _factory.Seed(Template(theirs, 10, userId: OtherUserId));

        var response = await _client.DeleteAsync($"/api/recurring-transactions/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.CountAll<RecurringTransaction>().Should().Be(1);
    }
}
