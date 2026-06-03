using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using budget_api.Models;

namespace budget_api.Tests.Controllers;

public class CategoriesControllerTests : IClassFixture<BudgetApiFactory>
{
    private readonly HttpClient _client;
    private readonly BudgetApiFactory _factory;

    public CategoriesControllerTests(BudgetApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    // ── GET /api/categories ─────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_ReturnsEmptyArray_WhenNoCategoriesExist()
    {
        var response = await _client.GetAsync("/api/categories");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadAsStringAsync();
        body.Should().Be("[]");
    }

    [Fact]
    public async Task GetAll_ReturnsAllCategories()
    {
        _factory.SeedMany([
            new Category { Name = "Salary", Type = "Income",  Color = "#00ff00", Icon = "cash" },
            new Category { Name = "Food",   Type = "Expense", Color = "#ff0000", Icon = "fork" },
        ]);

        var categories = await _client.GetFromJsonAsync<Category[]>("/api/categories");

        categories.Should().HaveCount(2);
        categories.Should().ContainSingle(c => c.Name == "Salary");
        categories.Should().ContainSingle(c => c.Name == "Food");
    }

    // ── GET /api/categories/{id} ────────────────────────────────────────────

    [Fact]
    public async Task GetById_ReturnsCategory_WhenExists()
    {
        var id = _factory.Seed(new Category { Name = "Salary", Type = "Income", Color = "#00ff00", Icon = "cash" });

        var category = await _client.GetFromJsonAsync<Category>($"/api/categories/{id}");

        category!.Name.Should().Be("Salary");
        category.Type.Should().Be("Income");
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenNotExists()
    {
        var response = await _client.GetAsync("/api/categories/9999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── POST /api/categories ────────────────────────────────────────────────

    [Fact]
    public async Task Create_ReturnsCreated_WithLocationHeader()
    {
        var payload = new Category { Name = "Salary", Type = "Income", Color = "#00ff00", Icon = "cash" };

        var response = await _client.PostAsJsonAsync("/api/categories", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();
    }

    [Fact]
    public async Task Create_PersistsCategory()
    {
        var payload = new Category { Name = "Groceries", Type = "Expense", Color = "#ff0000", Icon = "cart" };

        var response = await _client.PostAsJsonAsync("/api/categories", payload);
        var created = await response.Content.ReadFromJsonAsync<Category>();

        var fetched = await _client.GetFromJsonAsync<Category>($"/api/categories/{created!.Id}");
        fetched!.Name.Should().Be("Groceries");
        fetched.Type.Should().Be("Expense");
        fetched.Color.Should().Be("#ff0000");
        fetched.Icon.Should().Be("cart");
    }

    // ── PUT /api/categories/{id} ────────────────────────────────────────────

    [Fact]
    public async Task Update_ReturnsNoContent_WhenSuccessful()
    {
        var id = _factory.Seed(new Category { Name = "Salary", Type = "Income", Color = "#00ff00", Icon = "cash" });
        var updated = new Category { Id = id, Name = "Wages", Type = "Income", Color = "#00ff00", Icon = "cash" };

        var response = await _client.PutAsJsonAsync($"/api/categories/{id}", updated);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var payload = new Category { Id = 99, Name = "Salary", Type = "Income", Color = "#00ff00", Icon = "cash" };

        var response = await _client.PutAsJsonAsync("/api/categories/1", payload);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_PersistsChanges()
    {
        var id = _factory.Seed(new Category { Name = "Old Name", Type = "Income", Color = "#00ff00", Icon = "cash" });
        var updated = new Category { Id = id, Name = "New Name", Type = "Expense", Color = "#ff0000", Icon = "tag" };

        await _client.PutAsJsonAsync($"/api/categories/{id}", updated);

        var fetched = await _client.GetFromJsonAsync<Category>($"/api/categories/{id}");
        fetched!.Name.Should().Be("New Name");
        fetched.Type.Should().Be("Expense");
        fetched.Color.Should().Be("#ff0000");
    }

    // ── DELETE /api/categories/{id} ─────────────────────────────────────────

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenSuccessful()
    {
        var id = _factory.Seed(new Category { Name = "Salary", Type = "Income", Color = "#00ff00", Icon = "cash" });

        var response = await _client.DeleteAsync($"/api/categories/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenNotExists()
    {
        var response = await _client.DeleteAsync("/api/categories/9999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_RemovesCategory()
    {
        var id = _factory.Seed(new Category { Name = "Salary", Type = "Income", Color = "#00ff00", Icon = "cash" });

        await _client.DeleteAsync($"/api/categories/{id}");

        var response = await _client.GetAsync($"/api/categories/{id}");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
