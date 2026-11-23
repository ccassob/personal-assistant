using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class GoalsControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string OtherUserId = "other-user";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public GoalsControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private int Seed(string name, string status = "Active", string userId = TestAuthHandler.UserId)
    {
        return _factory.Seed(new Goal
        {
            Name = name,
            Description = "d",
            TargetAmount = 1000m,
            CurrentAmount = 250m,
            Deadline = new DateOnly(2027, 1, 1),
            Status = status,
            UserId = userId,
        });
    }

    [Fact]
    public async Task GetAll_ReturnsOnlyOwnGoals()
    {
        Seed("Car");
        Seed("Trip", "Paused");
        Seed("Theirs", userId: OtherUserId);

        var goals = await _client.GetFromJsonAsync<Goal[]>("/api/goals");

        goals!.Select(g => g.Name).Should().BeEquivalentTo("Car", "Trip");
    }

    [Fact]
    public async Task GetAll_ReturnsEmptyArray_WhenNoGoals()
    {
        var goals = await _client.GetFromJsonAsync<Goal[]>("/api/goals");

        goals.Should().BeEmpty();
    }

    [Fact]
    public async Task GetById_ReturnsAllFields_ForOwnGoal()
    {
        var id = Seed("Car", "Completed");

        var goal = await _client.GetFromJsonAsync<Goal>($"/api/goals/{id}");

        goal!.Name.Should().Be("Car");
        goal.Description.Should().Be("d");
        goal.TargetAmount.Should().Be(1000m);
        goal.CurrentAmount.Should().Be(250m);
        goal.Deadline.Should().Be(new DateOnly(2027, 1, 1));
        goal.Status.Should().Be("Completed");
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissingOrOwnedByAnotherUser()
    {
        var theirs = Seed("Theirs", userId: OtherUserId);

        var other = await _client.GetAsync($"/api/goals/{theirs}");
        var missing = await _client.GetAsync("/api/goals/9999");

        other.StatusCode.Should().Be(HttpStatusCode.NotFound);
        missing.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Create_AssignsUserIdFromClaim_AndPersistsFields()
    {
        var payload = new Goal
        {
            Name = "House", Description = "Down payment", TargetAmount = 50000m, CurrentAmount = 1200.5m,
            Deadline = new DateOnly(2030, 6, 30), Status = "Active", UserId = OtherUserId,
        };

        var response = await _client.PostAsJsonAsync("/api/goals", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();
        var saved = _factory.GetAll<Goal>().Single();
        saved.UserId.Should().Be(TestAuthHandler.UserId);
        saved.Name.Should().Be("House");
        saved.TargetAmount.Should().Be(50000m);
        saved.CurrentAmount.Should().Be(1200.5m);
        saved.Deadline.Should().Be(new DateOnly(2030, 6, 30));
    }

    [Fact]
    public async Task Create_DefaultsStatusToActive_WhenOmitted()
    {
        await _client.PostAsJsonAsync("/api/goals", new { name = "House", targetAmount = 1m });

        _factory.GetAll<Goal>().Single().Status.Should().Be("Active");
    }

    [Fact]
    public async Task Update_PersistsAllEditableFields()
    {
        var id = Seed("Old");
        var payload = new Goal
        {
            Id = id, Name = "New", Description = "changed", TargetAmount = 2000m, CurrentAmount = 2000m,
            Deadline = new DateOnly(2028, 12, 31), Status = "Completed",
        };

        var response = await _client.PutAsJsonAsync($"/api/goals/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var saved = _factory.GetAll<Goal>().Single();
        saved.Name.Should().Be("New");
        saved.Description.Should().Be("changed");
        saved.TargetAmount.Should().Be(2000m);
        saved.CurrentAmount.Should().Be(2000m);
        saved.Deadline.Should().Be(new DateOnly(2028, 12, 31));
        saved.Status.Should().Be("Completed");
        saved.UserId.Should().Be(TestAuthHandler.UserId);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var response = await _client.PutAsJsonAsync("/api/goals/1", new Goal { Id = 99, Name = "x" });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_AndKeepsData_WhenOwnedByAnotherUser()
    {
        var id = Seed("Theirs", userId: OtherUserId);

        var response = await _client.PutAsJsonAsync($"/api/goals/{id}", new Goal { Id = id, Name = "Hijacked", Status = "Completed" });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var saved = _factory.GetAll<Goal>().Single();
        saved.Name.Should().Be("Theirs");
        saved.Status.Should().Be("Active");
    }

    [Fact]
    public async Task Delete_RemovesOwnGoal()
    {
        var id = Seed("Car");

        var response = await _client.DeleteAsync($"/api/goals/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.CountAll<Goal>().Should().Be(0);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_AndKeepsGoal_WhenOwnedByAnotherUser()
    {
        var id = Seed("Theirs", userId: OtherUserId);

        var response = await _client.DeleteAsync($"/api/goals/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.CountAll<Goal>().Should().Be(1);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenMissing()
    {
        var response = await _client.DeleteAsync("/api/goals/9999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
