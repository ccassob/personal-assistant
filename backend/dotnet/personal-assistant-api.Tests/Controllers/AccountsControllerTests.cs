using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class AccountsControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string OtherUserId = "other-user";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public AccountsControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private static DateOnly Today => DateOnly.FromDateTime(DateTime.Today);

    private static Account Acc(string name, decimal amount = 100m, string type = "Regular", string userId = TestAuthHandler.UserId)
    {
        return new Account { Name = name, Amount = amount, AccountType = type, LastModified = new DateOnly(2020, 1, 1), UserId = userId };
    }

    private void SeedHistory(int accountId, DateOnly date, decimal amount)
    {
        _factory.Seed(new AccountHistory { AccountId = accountId, Date = date, Amount = amount });
    }

    // ── GET ─────────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_OrdersByName_AndExcludesOtherUsers()
    {
        _factory.SeedMany([Acc("Savings"), Acc("Checking"), Acc("Theirs", userId: OtherUserId)]);

        var accounts = await _client.GetFromJsonAsync<Account[]>("/api/accounts");

        accounts!.Select(a => a.Name).Should().Equal("Checking", "Savings");
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenOwnedByAnotherUser()
    {
        var id = _factory.Seed(Acc("Theirs", userId: OtherUserId));

        var response = await _client.GetAsync($"/api/accounts/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── POST ────────────────────────────────────────────────────────────────

    [Fact]
    public async Task Create_AssignsUserIdAndLastModified_AndWritesTodaysHistory()
    {
        var before = Today;
        var payload = Acc("Checking", 250.5m, "Investment", OtherUserId);

        var response = await _client.PostAsJsonAsync("/api/accounts", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var saved = _factory.GetAll<Account>().Single();
        saved.UserId.Should().Be(TestAuthHandler.UserId);
        saved.AccountType.Should().Be("Investment");
        saved.LastModified.Should().BeOneOf(before, Today);
        var history = _factory.GetAll<AccountHistory>().Single();
        history.AccountId.Should().Be(saved.Id);
        history.Amount.Should().Be(250.5m);
        history.Date.Should().Be(saved.LastModified);
    }

    // ── PUT ─────────────────────────────────────────────────────────────────

    [Fact]
    public async Task Update_PersistsFields_RefreshesLastModified_AndUpsertsHistory()
    {
        var before = Today;
        var id = _factory.Seed(Acc("Old", 100m));
        var payload = new Account { Id = id, Name = "New", Amount = 175m, AccountType = "Investment" };

        var response = await _client.PutAsJsonAsync($"/api/accounts/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var saved = _factory.GetAll<Account>().Single();
        saved.Name.Should().Be("New");
        saved.Amount.Should().Be(175m);
        saved.AccountType.Should().Be("Investment");
        saved.LastModified.Should().BeOneOf(before, Today);
        saved.UserId.Should().Be(TestAuthHandler.UserId);
        _factory.GetAll<AccountHistory>().Single().Amount.Should().Be(175m);
    }

    [Fact]
    public async Task Update_TwiceInSameDay_KeepsSingleHistoryRowWithLatestAmount()
    {
        var id = _factory.Seed(Acc("Checking", 100m));

        await _client.PutAsJsonAsync($"/api/accounts/{id}", new Account { Id = id, Name = "Checking", Amount = 200m });
        await _client.PutAsJsonAsync($"/api/accounts/{id}", new Account { Id = id, Name = "Checking", Amount = 300m });

        var history = _factory.GetAll<AccountHistory>().Single();
        history.Amount.Should().Be(300m);
    }

    [Fact]
    public async Task Update_KeepsPreviousDaysHistoryUntouched_AndAddsTodaysRow()
    {
        var id = _factory.Seed(Acc("Checking", 100m));
        SeedHistory(id, Today.AddDays(-3), 50m);

        await _client.PutAsJsonAsync($"/api/accounts/{id}", new Account { Id = id, Name = "Checking", Amount = 200m });

        var history = _factory.GetAll<AccountHistory>().OrderBy(h => h.Date).ToList();
        history.Should().HaveCount(2);
        history[0].Amount.Should().Be(50m);
        history[1].Amount.Should().Be(200m);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var response = await _client.PutAsJsonAsync("/api/accounts/1", new Account { Id = 99, Name = "x" });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_AndKeepsDataAndHistory_WhenOwnedByAnotherUser()
    {
        var id = _factory.Seed(Acc("Theirs", 100m, userId: OtherUserId));

        var response = await _client.PutAsJsonAsync($"/api/accounts/{id}", new Account { Id = id, Name = "Hijacked", Amount = 1m });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<Account>().Single().Name.Should().Be("Theirs");
        _factory.CountAll<AccountHistory>().Should().Be(0);
    }

    // ── DELETE ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task Delete_RemovesOwnedAccount()
    {
        var id = _factory.Seed(Acc("Checking"));

        var response = await _client.DeleteAsync($"/api/accounts/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.CountAll<Account>().Should().Be(0);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_AndKeepsAccount_WhenOwnedByAnotherUser()
    {
        var id = _factory.Seed(Acc("Theirs", userId: OtherUserId));

        var response = await _client.DeleteAsync($"/api/accounts/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.CountAll<Account>().Should().Be(1);
    }

    // ── GET /api/accounts/{id}/history ──────────────────────────────────────

    [Fact]
    public async Task GetHistory_ReturnsLastSixMonthsOrderedByDate_ForThatAccountOnly()
    {
        var id = _factory.Seed(Acc("Checking"));
        var otherAccount = _factory.Seed(Acc("Savings"));
        SeedHistory(id, Today.AddMonths(-7), 1m);
        SeedHistory(id, Today.AddDays(-1), 3m);
        SeedHistory(id, Today.AddMonths(-5), 2m);
        SeedHistory(otherAccount, Today.AddDays(-1), 999m);

        var rows = await _client.GetFromJsonAsync<JsonElement[]>($"/api/accounts/{id}/history");

        rows!.Select(r => r.GetProperty("amount").GetDecimal()).Should().Equal(2m, 3m);
    }

    [Fact]
    public async Task GetHistory_ReturnsNotFound_WhenAccountOwnedByAnotherUser()
    {
        var id = _factory.Seed(Acc("Theirs", userId: OtherUserId));
        SeedHistory(id, Today, 10m);

        var response = await _client.GetAsync($"/api/accounts/{id}/history");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── GET /api/accounts/history/total ─────────────────────────────────────

    [Fact]
    public async Task TotalHistory_SumsAmountsPerDateAcrossOwnAccounts_OrderedByDate()
    {
        var a = _factory.Seed(Acc("Checking"));
        var b = _factory.Seed(Acc("Savings"));
        var theirs = _factory.Seed(Acc("Theirs", userId: OtherUserId));
        SeedHistory(a, Today.AddDays(-2), 100m);
        SeedHistory(b, Today.AddDays(-2), 50m);
        SeedHistory(a, Today.AddDays(-1), 120m);
        SeedHistory(theirs, Today.AddDays(-1), 9999m);
        SeedHistory(a, Today.AddMonths(-8), 777m);

        var rows = await _client.GetFromJsonAsync<JsonElement[]>("/api/accounts/history/total");

        rows!.Select(r => r.GetProperty("totalAmount").GetDecimal()).Should().Equal(150m, 120m);
        rows.Select(r => r.GetProperty("date").GetString()).Should().Equal(
            Today.AddDays(-2).ToString("yyyy-MM-dd"),
            Today.AddDays(-1).ToString("yyyy-MM-dd"));
    }

    [Fact]
    public async Task TotalHistory_ReturnsEmpty_WhenUserHasNoAccounts()
    {
        var theirs = _factory.Seed(Acc("Theirs", userId: OtherUserId));
        SeedHistory(theirs, Today, 10m);

        var rows = await _client.GetFromJsonAsync<JsonElement[]>("/api/accounts/history/total");

        rows.Should().BeEmpty();
    }
}
