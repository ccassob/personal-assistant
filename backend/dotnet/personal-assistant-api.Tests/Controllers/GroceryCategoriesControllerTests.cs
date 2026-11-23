using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class GroceryCategoriesControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string OtherUserId = "other-user";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public GroceryCategoriesControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private int Seed(string name, string color = "primary", string userId = TestAuthHandler.UserId)
    {
        return _factory.Seed(new GroceryCategory { Name = name, Color = color, UserId = userId });
    }

    [Fact]
    public async Task GetAll_OrdersByName_AndExcludesOtherUsers()
    {
        Seed("Dairy");
        Seed("Bakery");
        Seed("Theirs", userId: OtherUserId);

        var rows = await _client.GetFromJsonAsync<GroceryCategory[]>("/api/grocery-categories");

        rows!.Select(c => c.Name).Should().Equal("Bakery", "Dairy");
    }

    [Fact]
    public async Task GetById_ReturnsCategory_AndNotFoundForOtherUsers()
    {
        var mine = Seed("Dairy", "info");
        var theirs = Seed("Theirs", userId: OtherUserId);

        var category = await _client.GetFromJsonAsync<GroceryCategory>($"/api/grocery-categories/{mine}");
        var response = await _client.GetAsync($"/api/grocery-categories/{theirs}");

        category!.Color.Should().Be("info");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Create_AssignsUserIdFromClaim_IgnoringPayload()
    {
        var response = await _client.PostAsJsonAsync("/api/grocery-categories",
            new GroceryCategory { Name = "Produce", Color = "success", UserId = OtherUserId });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var saved = _factory.GetAll<GroceryCategory>().Single();
        saved.UserId.Should().Be(TestAuthHandler.UserId);
        saved.Color.Should().Be("success");
    }

    [Fact]
    public async Task Create_DefaultsColorToPrimary_WhenOmitted()
    {
        await _client.PostAsJsonAsync("/api/grocery-categories", new { name = "Produce" });

        _factory.GetAll<GroceryCategory>().Single().Color.Should().Be("primary");
    }

    [Fact]
    public async Task Update_PersistsNameAndColor()
    {
        var id = Seed("Old", "primary");

        var response = await _client.PutAsJsonAsync($"/api/grocery-categories/{id}",
            new GroceryCategory { Id = id, Name = "New", Color = "danger" });

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var saved = _factory.GetAll<GroceryCategory>().Single();
        saved.Name.Should().Be("New");
        saved.Color.Should().Be("danger");
        saved.UserId.Should().Be(TestAuthHandler.UserId);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var response = await _client.PutAsJsonAsync("/api/grocery-categories/1", new GroceryCategory { Id = 99 });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_AndKeepsData_WhenOwnedByAnotherUser()
    {
        var id = Seed("Theirs", userId: OtherUserId);

        var response = await _client.PutAsJsonAsync($"/api/grocery-categories/{id}", new GroceryCategory { Id = id, Name = "Hijacked" });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<GroceryCategory>().Single().Name.Should().Be("Theirs");
    }

    [Fact]
    public async Task Delete_RemovesOwnedCategory_AndReturnsNotFoundForOthers()
    {
        var mine = Seed("Mine");
        var theirs = Seed("Theirs", userId: OtherUserId);

        var ok = await _client.DeleteAsync($"/api/grocery-categories/{mine}");
        var notFound = await _client.DeleteAsync($"/api/grocery-categories/{theirs}");

        ok.StatusCode.Should().Be(HttpStatusCode.NoContent);
        notFound.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<GroceryCategory>().Single().UserId.Should().Be(OtherUserId);
    }
}
