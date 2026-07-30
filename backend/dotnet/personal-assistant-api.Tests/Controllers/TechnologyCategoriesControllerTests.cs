using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using personal_assistant_api.Models;

namespace personal_assistant_api.Tests.Controllers;

public class TechnologyCategoriesControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public TechnologyCategoriesControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private static TechnologyCategory Cat(string name, string userId = null!) =>
        new() { Name = name, Color = "#0078d4", Icon = "tabler:brand-azure", UserId = userId ?? TestAuthHandler.UserId };

    // ── GET /api/technology-categories ──────────────────────────────────────

    [Fact]
    public async Task GetAll_ReturnsEmptyArray_WhenNoneExist()
    {
        var response = await _client.GetAsync("/api/technology-categories");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadAsStringAsync();
        body.Should().Be("[]");
    }

    [Fact]
    public async Task GetAll_ReturnsOwnCategoriesOnly_OrderedByName()
    {
        _factory.Seed(Cat("Docker"));
        _factory.Seed(Cat("Azure"));
        _factory.Seed(Cat("Theirs", userId: "other-user"));

        var categories = await _client.GetFromJsonAsync<TechnologyCategory[]>("/api/technology-categories");

        categories!.Select(c => c.Name).Should().ContainInOrder("Azure", "Docker");
        categories.Should().NotContain(c => c.Name == "Theirs");
    }

    // ── POST /api/technology-categories ─────────────────────────────────────

    [Fact]
    public async Task Create_PersistsCategory()
    {
        var payload = new { name = "Azure", color = "#0078d4", icon = "tabler:brand-azure" };

        var response = await _client.PostAsJsonAsync("/api/technology-categories", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var categories = await _client.GetFromJsonAsync<TechnologyCategory[]>("/api/technology-categories");
        categories.Should().ContainSingle(c => c.Name == "Azure" && c.Color == "#0078d4" && c.Icon == "tabler:brand-azure");
    }

    // ── PUT /api/technology-categories/{id} ─────────────────────────────────

    [Fact]
    public async Task Update_PersistsChanges()
    {
        var id = _factory.Seed(Cat("Old Name"));
        var payload = new { id, name = "New Name", color = "#111111", icon = "tabler:tag" };

        var response = await _client.PutAsJsonAsync($"/api/technology-categories/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var categories = await _client.GetFromJsonAsync<TechnologyCategory[]>("/api/technology-categories");
        categories.Should().ContainSingle(c => c.Name == "New Name" && c.Color == "#111111");
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenNotOwned()
    {
        var id = _factory.Seed(Cat("Theirs", userId: "other-user"));
        var payload = new { id, name = "Hijacked", color = "#000000", icon = "" };

        var response = await _client.PutAsJsonAsync($"/api/technology-categories/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── DELETE /api/technology-categories/{id} ──────────────────────────────

    [Fact]
    public async Task Delete_RemovesCategory()
    {
        var id = _factory.Seed(Cat("Azure"));

        var response = await _client.DeleteAsync($"/api/technology-categories/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var categories = await _client.GetFromJsonAsync<TechnologyCategory[]>("/api/technology-categories");
        categories.Should().BeEmpty();
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenNotOwned()
    {
        var id = _factory.Seed(Cat("Theirs", userId: "other-user"));

        var response = await _client.DeleteAsync($"/api/technology-categories/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_SetsTechnologyCategoryIdToNull_WhenCategoryInUse()
    {
        var categoryId = _factory.Seed(Cat("Azure"));
        var techId = _factory.Seed(new Technology { Name = "Azure Functions", Color = "#0078d4", Icon = "cpu", Notes = "", CategoryId = categoryId, UserId = TestAuthHandler.UserId });

        var deleteResponse = await _client.DeleteAsync($"/api/technology-categories/{categoryId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var tech = await _client.GetFromJsonAsync<TechResponse>($"/api/technologies/{techId}");
        tech!.categoryId.Should().BeNull();
    }

    private record TechResponse(int id, string name, int? categoryId, string? categoryName);
}
