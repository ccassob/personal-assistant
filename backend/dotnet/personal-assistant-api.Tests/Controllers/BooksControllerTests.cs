using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class BooksControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public BooksControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private static Book NewBook(string status, DateOnly? completedDate = null)
    {
        return new Book
        {
            Title = "Clean Code",
            Author = "Robert Martin",
            TotalPages = 400,
            CurrentPage = 100,
            StartDate = new DateOnly(2026, 1, 1),
            Status = status,
            CompletedDate = completedDate,
            UserId = TestAuthHandler.UserId
        };
    }

    private async Task<Book> PutStatusAsync(int id, string status)
    {
        var payload = new { id, title = "Clean Code", author = "Robert Martin", totalPages = 400, currentPage = 400, startDate = "2026-01-01", status, notes = "", bookType = "Literature" };
        var response = await _client.PutAsJsonAsync($"/api/books/{id}", payload);
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var book = await _client.GetFromJsonAsync<Book>($"/api/books/{id}");

        return book!;
    }

    [Fact]
    public async Task Update_ToCompleted_SetsCompletedDate()
    {
        var id = _factory.Seed(NewBook("Reading"));

        var book = await PutStatusAsync(id, "Completed");

        book.CompletedDate.Should().Be(DateOnly.FromDateTime(DateTime.Today));
    }

    [Fact]
    public async Task Update_AwayFromCompleted_ClearsCompletedDate()
    {
        var id = _factory.Seed(NewBook("Completed", new DateOnly(2026, 3, 1)));

        var book = await PutStatusAsync(id, "Reading");

        book.CompletedDate.Should().BeNull();
    }

    [Fact]
    public async Task Update_StaysCompleted_KeepsOriginalCompletedDate()
    {
        var id = _factory.Seed(NewBook("Completed", new DateOnly(2026, 3, 1)));

        var book = await PutStatusAsync(id, "Completed");

        book.CompletedDate.Should().Be(new DateOnly(2026, 3, 1));
    }
}
