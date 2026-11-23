using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class SupermarketsControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string OtherUserId = "other-user";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public SupermarketsControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private int Seed(string name, string userId = TestAuthHandler.UserId)
    {
        return _factory.Seed(new Supermarket { Name = name, UserId = userId });
    }

    private void SeedPurchase(int supermarketId, string userId = TestAuthHandler.UserId)
    {
        _factory.Seed(new GroceryPurchase
        {
            GroceryItemId = 1, SupermarketId = supermarketId, PurchasedAt = new DateTime(2026, 3, 1), Price = 1m, Quantity = 1m, UserId = userId,
        });
    }

    [Fact]
    public async Task GetAll_OrdersByName_AndExcludesOtherUsers()
    {
        Seed("Walmart");
        Seed("Costco");
        Seed("Theirs", OtherUserId);

        var rows = await _client.GetFromJsonAsync<Supermarket[]>("/api/supermarkets");

        rows!.Select(s => s.Name).Should().Equal("Costco", "Walmart");
    }

    [Fact]
    public async Task GetById_ReturnsSupermarket_AndNotFoundForOtherUsers()
    {
        var mine = Seed("Costco");
        var theirs = Seed("Theirs", OtherUserId);

        var supermarket = await _client.GetFromJsonAsync<Supermarket>($"/api/supermarkets/{mine}");
        var response = await _client.GetAsync($"/api/supermarkets/{theirs}");

        supermarket!.Name.Should().Be("Costco");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Create_AssignsUserIdFromClaim_IgnoringPayload()
    {
        var response = await _client.PostAsJsonAsync("/api/supermarkets", new Supermarket { Name = "Aldi", UserId = OtherUserId });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        _factory.GetAll<Supermarket>().Single().UserId.Should().Be(TestAuthHandler.UserId);
    }

    [Fact]
    public async Task Update_PersistsName()
    {
        var id = Seed("Old");

        var response = await _client.PutAsJsonAsync($"/api/supermarkets/{id}", new Supermarket { Id = id, Name = "New" });

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.GetAll<Supermarket>().Single().Name.Should().Be("New");
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var response = await _client.PutAsJsonAsync("/api/supermarkets/1", new Supermarket { Id = 99 });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_AndKeepsData_WhenOwnedByAnotherUser()
    {
        var id = Seed("Theirs", OtherUserId);

        var response = await _client.PutAsJsonAsync($"/api/supermarkets/{id}", new Supermarket { Id = id, Name = "Hijacked" });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<Supermarket>().Single().Name.Should().Be("Theirs");
    }

    [Fact]
    public async Task Delete_RemovesSupermarketWithoutPurchases()
    {
        var id = Seed("Costco");

        var response = await _client.DeleteAsync($"/api/supermarkets/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.CountAll<Supermarket>().Should().Be(0);
    }

    [Fact]
    public async Task Delete_ReturnsConflict_AndKeepsSupermarket_WhenPurchaseHistoryExists()
    {
        var id = Seed("Costco");
        SeedPurchase(id);

        var response = await _client.DeleteAsync($"/api/supermarkets/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
        (await response.Content.ReadAsStringAsync()).Should().Contain("purchase history");
        _factory.CountAll<Supermarket>().Should().Be(1);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_AndKeepsSupermarket_WhenOwnedByAnotherUser()
    {
        var id = Seed("Theirs", OtherUserId);

        var response = await _client.DeleteAsync($"/api/supermarkets/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.CountAll<Supermarket>().Should().Be(1);
    }
}
