using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using personal_assistant_api.Models;

namespace personal_assistant_api.Tests.Controllers;

// Covers the controller logic that does NOT call Azure (session listing, SSML save, ownership,
// validation, file/delete not-found). The audio synthesis (Speech + Blob) requires live Azure
// credentials and is verified manually / against real services, not in these in-memory tests.
public class StudyAudioControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public StudyAudioControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private int SeedTechnologyId(string name = "Angular", string userId = null!) =>
        _factory.Seed(new Technology
        {
            Name = name,
            Color = "#dd0031",
            Icon = "brand-angular",
            Notes = "",
            UserId = userId ?? TestAuthHandler.UserId
        });

    private int SeedTheorySectionId(int techId, string title) =>
        _factory.Seed(new TechnologyTheorySection { TechnologyId = techId, Title = title });

    // ── Session listing ────────────────────────────────────────────────────────

    [Fact]
    public async Task GetSessions_Returns404_WhenTechnologyNotOwned()
    {
        var otherTechId = SeedTechnologyId(userId: "other-user");

        var response = await _client.GetAsync($"/api/technologies/{otherTechId}/study-audio");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetSessions_DerivesSessionsFromTheorySections_WithSequentialNumbers()
    {
        var techId = SeedTechnologyId();
        var section1 = SeedTheorySectionId(techId, "1. Fundamentos");
        var section2 = SeedTheorySectionId(techId, "2. Componentes");
        _factory.SeedMany([
            new TechnologyTheoryQuestion { SectionId = section1, Question = "¿Qué es un signal?", Points = 5 },
            new TechnologyTheoryQuestion { SectionId = section1, Question = "¿Qué es DI?", Points = 5 },
            new TechnologyTheoryQuestion { SectionId = section2, Question = "¿Qué es un componente?", Points = 5 },
        ]);

        var sessions = await _client.GetFromJsonAsync<SessionResponse[]>($"/api/technologies/{techId}/study-audio");

        sessions.Should().HaveCount(2);
        sessions![0].sessionNumber.Should().Be(1);
        sessions[0].theorySectionId.Should().Be(section1);
        sessions[0].sectionTitle.Should().Be("1. Fundamentos");
        sessions[0].questionCount.Should().Be(2);
        sessions[0].ssml.Should().Be("");
        sessions[0].hasAudio.Should().BeFalse();
        sessions[1].sessionNumber.Should().Be(2);
        sessions[1].questionCount.Should().Be(1);
    }

    [Fact]
    public async Task GetSessions_ReflectsSavedSsmlAndGeneratedAudio()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId, "1. Fundamentos");
        _factory.Seed(new StudyAudioSession
        {
            TechnologyId = techId,
            TheorySectionId = sectionId,
            SessionNumber = 1,
            Title = "Angular 1. Fundamentos 1",
            Album = "Angular",
            Status = "Ready",
            Ssml = "<speak>hola</speak>",
            BlobName = $"{TestAuthHandler.UserId}/{techId}/session-1.mp3",
            GeneratedAt = DateTime.UtcNow,
            UserId = TestAuthHandler.UserId
        });

        var sessions = await _client.GetFromJsonAsync<SessionResponse[]>($"/api/technologies/{techId}/study-audio");

        sessions.Should().ContainSingle();
        sessions![0].ssml.Should().Be("<speak>hola</speak>");
        sessions[0].status.Should().Be("Ready");
        sessions[0].hasAudio.Should().BeTrue();
    }

    // ── Save SSML ────────────────────────────────────────────────────────────────

    [Fact]
    public async Task SaveSsml_CreatesDraftRow_AndListsItBack()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId, "1. Fundamentos");

        var response = await _client.PutAsJsonAsync(
            $"/api/technologies/{techId}/study-audio/{sectionId}/ssml",
            new { ssml = "<speak version=\"1.0\">contenido</speak>" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        _factory.CountAll<StudyAudioSession>().Should().Be(1);

        var sessions = await _client.GetFromJsonAsync<SessionResponse[]>($"/api/technologies/{techId}/study-audio");
        sessions![0].ssml.Should().Be("<speak version=\"1.0\">contenido</speak>");
        sessions[0].status.Should().Be("Draft");
        sessions[0].hasAudio.Should().BeFalse();
    }

    [Fact]
    public async Task SaveSsml_UpdatesExistingRow_WithoutCreatingDuplicate()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId, "1. Fundamentos");

        await _client.PutAsJsonAsync($"/api/technologies/{techId}/study-audio/{sectionId}/ssml", new { ssml = "<speak>v1</speak>" });
        await _client.PutAsJsonAsync($"/api/technologies/{techId}/study-audio/{sectionId}/ssml", new { ssml = "<speak>v2</speak>" });

        _factory.CountAll<StudyAudioSession>().Should().Be(1);
        var sessions = await _client.GetFromJsonAsync<SessionResponse[]>($"/api/technologies/{techId}/study-audio");
        sessions![0].ssml.Should().Be("<speak>v2</speak>");
    }

    [Fact]
    public async Task SaveSsml_Returns404_WhenSectionNotInTechnology()
    {
        var techId = SeedTechnologyId();
        var otherTechId = SeedTechnologyId(name: "React");
        var otherSectionId = SeedTheorySectionId(otherTechId, "Otra");

        var response = await _client.PutAsJsonAsync(
            $"/api/technologies/{techId}/study-audio/{otherSectionId}/ssml", new { ssml = "<speak/>" });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── Generate validation (pre-Azure) ──────────────────────────────────────────

    [Fact]
    public async Task Generate_Returns404_WhenTechnologyNotOwned()
    {
        var otherTechId = SeedTechnologyId(userId: "other-user");
        var sectionId = SeedTheorySectionId(otherTechId, "1. Fundamentos");

        var response = await _client.PostAsync($"/api/technologies/{otherTechId}/study-audio/{sectionId}/generate", null);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Generate_ReturnsBadRequest_WhenNoSsmlSaved()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId, "1. Fundamentos");

        var response = await _client.PostAsync($"/api/technologies/{techId}/study-audio/{sectionId}/generate", null);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    // ── File / delete ────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetFile_Returns404_WhenNoAudioForSection()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId, "1. Fundamentos");

        var response = await _client.GetAsync($"/api/technologies/{techId}/study-audio/{sectionId}/file");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetFile_Returns404_WhenRowIsDraftWithoutBlob()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId, "1. Fundamentos");
        _factory.Seed(new StudyAudioSession
        {
            TechnologyId = techId,
            TheorySectionId = sectionId,
            SessionNumber = 1,
            Title = "x",
            Album = "Angular",
            Status = "Draft",
            Ssml = "<speak/>",
            BlobName = "",
            GeneratedAt = DateTime.UtcNow,
            UserId = TestAuthHandler.UserId
        });

        var response = await _client.GetAsync($"/api/technologies/{techId}/study-audio/{sectionId}/file");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_RemovesDraftRow()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId, "1. Fundamentos");
        await _client.PutAsJsonAsync($"/api/technologies/{techId}/study-audio/{sectionId}/ssml", new { ssml = "<speak/>" });
        _factory.CountAll<StudyAudioSession>().Should().Be(1);

        var response = await _client.DeleteAsync($"/api/technologies/{techId}/study-audio/{sectionId}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.CountAll<StudyAudioSession>().Should().Be(0);
    }

    [Fact]
    public async Task Delete_Returns404_WhenNoRow()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId, "1. Fundamentos");

        var response = await _client.DeleteAsync($"/api/technologies/{techId}/study-audio/{sectionId}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    private record SessionResponse(int sessionNumber, int theorySectionId, string sectionTitle,
        int questionCount, string ssml, string? status, bool hasAudio, DateTime? generatedAt);
}
