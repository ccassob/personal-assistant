using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using personal_assistant_api.Models;

namespace personal_assistant_api.Tests.Controllers;

public class TechnologiesControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public TechnologiesControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private int SeedTechnologyId(string name = "Kubernetes", string userId = null!) =>
        _factory.Seed(new Technology
        {
            Name = name,
            Color = "#326ce5",
            Icon = "cpu",
            Notes = "",
            UserId = userId ?? TestAuthHandler.UserId
        });

    private int SeedPracticeSectionId(int techId, string title = "Fundamentos") =>
        _factory.Seed(new TechnologyPracticeSection { TechnologyId = techId, Title = title });

    private int SeedTheorySectionId(int techId, string title = "Fundamentos") =>
        _factory.Seed(new TechnologyTheorySection { TechnologyId = techId, Title = title });

    // ── CRUD ─────────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_ReturnsEmptyArray_WhenNoTechnologiesExist()
    {
        var response = await _client.GetAsync("/api/technologies");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadAsStringAsync();
        body.Should().Be("[]");
    }

    [Fact]
    public async Task Create_ReturnsCreated_WithLocationHeader()
    {
        var payload = new { name = "Docker", color = "#0db7ed", icon = "container", notes = "" };

        var response = await _client.PostAsJsonAsync("/api/technologies", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var id = SeedTechnologyId();
        var payload = new { id = id + 1, name = "Renamed", color = "#000000", icon = "cpu", notes = "" };

        var response = await _client.PutAsJsonAsync($"/api/technologies/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_PersistsChanges()
    {
        var id = SeedTechnologyId();
        var payload = new { id, name = "Renamed", color = "#111111", icon = "brand-docker", notes = "updated" };

        var response = await _client.PutAsJsonAsync($"/api/technologies/{id}", payload);
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var fetched = await _client.GetFromJsonAsync<TechnologyResponse>($"/api/technologies/{id}");
        fetched!.name.Should().Be("Renamed");
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenNotOwned()
    {
        var otherTechId = SeedTechnologyId(userId: "other-user");

        var response = await _client.GetAsync($"/api/technologies/{otherTechId}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_RemovesTechnology_AndCascadesSectionsAndItems()
    {
        var techId = SeedTechnologyId();
        var practiceSectionId = SeedPracticeSectionId(techId);
        _factory.Seed(new TechnologyPracticeItem { SectionId = practiceSectionId, Title = "Crear un Deployment", Points = 2 });
        var theorySectionId = SeedTheorySectionId(techId);
        _factory.Seed(new TechnologyTheoryQuestion { SectionId = theorySectionId, Question = "¿Qué es un Pod?", Points = 5 });

        var deleteResponse = await _client.DeleteAsync($"/api/technologies/{techId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        _factory.CountAll<TechnologyPracticeSection>().Should().Be(0);
        _factory.CountAll<TechnologyPracticeItem>().Should().Be(0);
        _factory.CountAll<TechnologyTheorySection>().Should().Be(0);
        _factory.CountAll<TechnologyTheoryQuestion>().Should().Be(0);
    }

    // ── Scoring ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_ReturnsProportionalScore_BasedOnCombinedPointsPool()
    {
        var techId = SeedTechnologyId();
        var practiceSectionId = SeedPracticeSectionId(techId);
        var theorySectionId = SeedTheorySectionId(techId);
        // Practice: 100 total defined, 60 earned. Theory: 20 total defined, 20 earned.
        // Combined: 120 total, 80 earned -> round(100 * 80 / 120) = 67
        _factory.SeedMany([
            new TechnologyPracticeItem { SectionId = practiceSectionId, Title = "Item A", Points = 60, IsDone = true, CompletedAt = new DateOnly(2026, 1, 1) },
            new TechnologyPracticeItem { SectionId = practiceSectionId, Title = "Item B", Points = 40, IsDone = false },
        ]);
        _factory.SeedMany([
            new TechnologyTheoryQuestion { SectionId = theorySectionId, Question = "Q1", Points = 20, IsMastered = true, AnsweredAt = new DateOnly(2026, 1, 1) },
        ]);

        var technologies = await _client.GetFromJsonAsync<TechnologyResponse[]>("/api/technologies");

        var tech = technologies!.Single(t => t.id == techId);
        tech.practiceEarnedPoints.Should().Be(60);
        tech.practiceTotalPoints.Should().Be(100);
        tech.theoryEarnedPoints.Should().Be(20);
        tech.theoryTotalPoints.Should().Be(20);
        tech.totalScore.Should().Be(67);
    }

    [Fact]
    public async Task GetAll_ReturnsZeroScore_WhenNoItemsDefined()
    {
        var techId = SeedTechnologyId();

        var technologies = await _client.GetFromJsonAsync<TechnologyResponse[]>("/api/technologies");

        var tech = technologies!.Single(t => t.id == techId);
        tech.totalScore.Should().Be(0);
        tech.level.Should().Be("Principiante");
    }

    [Fact]
    public async Task GetAll_ScoreDrops_WhenNewIncompleteItemIsAdded()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedPracticeSectionId(techId);
        _factory.Seed(new TechnologyPracticeItem { SectionId = sectionId, Title = "Done item", Points = 50, IsDone = true, CompletedAt = new DateOnly(2026, 1, 1) });

        var before = await _client.GetFromJsonAsync<TechnologyResponse[]>("/api/technologies");
        before!.Single(t => t.id == techId).totalScore.Should().Be(100);

        var createResponse = await _client.PostAsJsonAsync($"/api/technologies/{techId}/practice-items", new { sectionId, title = "New undone item", points = 50 });
        createResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var after = await _client.GetFromJsonAsync<TechnologyResponse[]>("/api/technologies");
        after!.Single(t => t.id == techId).totalScore.Should().Be(50);
    }

    [Theory]
    [InlineData(0, "Principiante")]
    [InlineData(20, "Principiante")]
    [InlineData(21, "Básico")]
    [InlineData(40, "Básico")]
    [InlineData(41, "Intermedio")]
    [InlineData(60, "Intermedio")]
    [InlineData(61, "Avanzado")]
    [InlineData(80, "Avanzado")]
    [InlineData(81, "Experto")]
    [InlineData(99, "Experto")]
    [InlineData(100, "Dominio demostrado")]
    public async Task GetAll_MapsScoreToCorrectLevel(int targetScore, string expectedLevel)
    {
        // Total pool fixed at 100 points: one item worth `targetScore` marked done,
        // and (if not 100) a second undone item covering the remainder, so
        // totalScore == targetScore exactly (round(100 * targetScore / 100)).
        var techId = SeedTechnologyId(name: $"Tech-{targetScore}");
        var sectionId = SeedPracticeSectionId(techId);
        if (targetScore > 0)
        {
            _factory.Seed(new TechnologyPracticeItem
            {
                SectionId = sectionId,
                Title = "Done item",
                Points = targetScore,
                IsDone = true,
                CompletedAt = new DateOnly(2026, 1, 1)
            });
        }
        if (targetScore < 100)
        {
            _factory.Seed(new TechnologyPracticeItem
            {
                SectionId = sectionId,
                Title = "Remaining item",
                Points = 100 - targetScore,
                IsDone = false
            });
        }

        var technologies = await _client.GetFromJsonAsync<TechnologyResponse[]>("/api/technologies");
        var tech = technologies!.Single(t => t.id == techId);
        tech.totalScore.Should().Be(targetScore);
        tech.level.Should().Be(expectedLevel);
    }

    // ── Practice sections ────────────────────────────────────────────────────

    [Fact]
    public async Task GetPracticeSections_Returns404_WhenTechnologyNotOwned()
    {
        var otherTechId = SeedTechnologyId(userId: "other-user");

        var response = await _client.GetAsync($"/api/technologies/{otherTechId}/practice-sections");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreatePracticeSection_ReturnsSection()
    {
        var techId = SeedTechnologyId();

        var response = await _client.PostAsJsonAsync($"/api/technologies/{techId}/practice-sections", new { title = "1. Fundamentos" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var created = await response.Content.ReadFromJsonAsync<TechnologyPracticeSection>();
        created!.Title.Should().Be("1. Fundamentos");
    }

    [Fact]
    public async Task UpdatePracticeSection_RenamesSection()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedPracticeSectionId(techId, "Old Title");

        var response = await _client.PutAsJsonAsync($"/api/technologies/{techId}/practice-sections/{sectionId}", new { title = "New Title" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updated = await response.Content.ReadFromJsonAsync<TechnologyPracticeSection>();
        updated!.Title.Should().Be("New Title");
    }

    [Fact]
    public async Task DeletePracticeSection_CascadesItems()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedPracticeSectionId(techId);
        _factory.Seed(new TechnologyPracticeItem { SectionId = sectionId, Title = "Item", Points = 2 });

        var deleteResponse = await _client.DeleteAsync($"/api/technologies/{techId}/practice-sections/{sectionId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var items = await _client.GetFromJsonAsync<TechnologyPracticeItem[]>($"/api/technologies/{techId}/practice-items");
        items.Should().BeEmpty();
    }

    // ── Practice items ───────────────────────────────────────────────────────

    [Fact]
    public async Task GetPracticeItems_Returns404_WhenTechnologyNotOwned()
    {
        var otherTechId = SeedTechnologyId(userId: "other-user");

        var response = await _client.GetAsync($"/api/technologies/{otherTechId}/practice-items");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreatePracticeItem_ReturnsItem()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedPracticeSectionId(techId);

        var response = await _client.PostAsJsonAsync($"/api/technologies/{techId}/practice-items", new { sectionId, title = "Crear un Service", points = 2 });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var created = await response.Content.ReadFromJsonAsync<TechnologyPracticeItem>();
        created!.Title.Should().Be("Crear un Service");
        created.Points.Should().Be(2);
        created.IsDone.Should().BeFalse();
    }

    [Fact]
    public async Task CreatePracticeItem_Returns404_WhenSectionNotInTechnology()
    {
        var techId = SeedTechnologyId();
        var otherTechId = SeedTechnologyId(name: "Other");
        var otherSectionId = SeedPracticeSectionId(otherTechId);

        var response = await _client.PostAsJsonAsync($"/api/technologies/{techId}/practice-items", new { sectionId = otherSectionId, title = "X", points = 1 });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdatePracticeItem_SetsCompletedAt_WhenMarkedDone()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedPracticeSectionId(techId);
        var itemId = _factory.Seed(new TechnologyPracticeItem { SectionId = sectionId, Title = "Crear un Deployment", Points = 2 });

        var response = await _client.PutAsJsonAsync($"/api/technologies/{techId}/practice-items/{itemId}", new { isDone = true, notes = "Desplegué nginx" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updated = await response.Content.ReadFromJsonAsync<TechnologyPracticeItem>();
        updated!.IsDone.Should().BeTrue();
        updated.CompletedAt.Should().Be(DateOnly.FromDateTime(DateTime.Today));
        updated.Notes.Should().Be("Desplegué nginx");
    }

    [Fact]
    public async Task UpdatePracticeItem_ClearsCompletedAt_WhenMarkedNotDone()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedPracticeSectionId(techId);
        var itemId = _factory.Seed(new TechnologyPracticeItem
        {
            SectionId = sectionId,
            Title = "Crear un Deployment",
            Points = 2,
            IsDone = true,
            CompletedAt = new DateOnly(2026, 1, 1),
            Notes = "old note"
        });

        var response = await _client.PutAsJsonAsync($"/api/technologies/{techId}/practice-items/{itemId}", new { isDone = false, notes = (string?)null });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updated = await response.Content.ReadFromJsonAsync<TechnologyPracticeItem>();
        updated!.IsDone.Should().BeFalse();
        updated.CompletedAt.Should().BeNull();
    }

    [Fact]
    public async Task UpdatePracticeItem_Returns404_WhenItemBelongsToDifferentTechnology()
    {
        var techId = SeedTechnologyId();
        var otherTechId = SeedTechnologyId(name: "Other");
        var otherSectionId = SeedPracticeSectionId(otherTechId);
        var otherItemId = _factory.Seed(new TechnologyPracticeItem { SectionId = otherSectionId, Title = "X", Points = 1 });

        var response = await _client.PutAsJsonAsync($"/api/technologies/{techId}/practice-items/{otherItemId}", new { isDone = true, notes = (string?)null });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeletePracticeItem_RemovesItem()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedPracticeSectionId(techId);
        var itemId = _factory.Seed(new TechnologyPracticeItem { SectionId = sectionId, Title = "Crear un Deployment", Points = 2 });

        var deleteResponse = await _client.DeleteAsync($"/api/technologies/{techId}/practice-items/{itemId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var items = await _client.GetFromJsonAsync<TechnologyPracticeItem[]>($"/api/technologies/{techId}/practice-items");
        items.Should().BeEmpty();
    }

    // ── Theory sections ──────────────────────────────────────────────────────

    [Fact]
    public async Task GetTheorySections_Returns404_WhenTechnologyNotOwned()
    {
        var otherTechId = SeedTechnologyId(userId: "other-user");

        var response = await _client.GetAsync($"/api/technologies/{otherTechId}/theory-sections");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateTheorySection_ReturnsSection()
    {
        var techId = SeedTechnologyId();

        var response = await _client.PostAsJsonAsync($"/api/technologies/{techId}/theory-sections", new { title = "Fundamentos" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var created = await response.Content.ReadFromJsonAsync<TechnologyTheorySection>();
        created!.Title.Should().Be("Fundamentos");
    }

    [Fact]
    public async Task DeleteTheorySection_CascadesQuestions()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId);
        _factory.Seed(new TechnologyTheoryQuestion { SectionId = sectionId, Question = "¿Qué es un Pod?", Points = 5 });

        var deleteResponse = await _client.DeleteAsync($"/api/technologies/{techId}/theory-sections/{sectionId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var questions = await _client.GetFromJsonAsync<TechnologyTheoryQuestion[]>($"/api/technologies/{techId}/theory-questions");
        questions.Should().BeEmpty();
    }

    // ── Theory questions ─────────────────────────────────────────────────────

    [Fact]
    public async Task GetTheoryQuestions_Returns404_WhenTechnologyNotOwned()
    {
        var otherTechId = SeedTechnologyId(userId: "other-user");

        var response = await _client.GetAsync($"/api/technologies/{otherTechId}/theory-questions");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateTheoryQuestion_ReturnsQuestion()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId);

        var response = await _client.PostAsJsonAsync($"/api/technologies/{techId}/theory-questions", new { sectionId, question = "¿Qué es un Pod?", points = 5 });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var created = await response.Content.ReadFromJsonAsync<TechnologyTheoryQuestion>();
        created!.Question.Should().Be("¿Qué es un Pod?");
        created.Points.Should().Be(5);
        created.IsMastered.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateTheoryQuestion_SetsAnsweredAt_WhenMarkedMastered()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId);
        var questionId = _factory.Seed(new TechnologyTheoryQuestion { SectionId = sectionId, Question = "¿Qué es un Pod?", Points = 5 });

        var response = await _client.PutAsJsonAsync($"/api/technologies/{techId}/theory-questions/{questionId}", new { isMastered = true, notes = "" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updated = await response.Content.ReadFromJsonAsync<TechnologyTheoryQuestion>();
        updated!.IsMastered.Should().BeTrue();
        updated.AnsweredAt.Should().Be(DateOnly.FromDateTime(DateTime.Today));
    }

    [Fact]
    public async Task UpdateTheoryQuestion_ClearsAnsweredAt_WhenMarkedNotMastered()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId);
        var questionId = _factory.Seed(new TechnologyTheoryQuestion
        {
            SectionId = sectionId,
            Question = "¿Qué es un Pod?",
            Points = 5,
            IsMastered = true,
            AnsweredAt = new DateOnly(2026, 1, 1)
        });

        var response = await _client.PutAsJsonAsync($"/api/technologies/{techId}/theory-questions/{questionId}", new { isMastered = false, notes = (string?)null });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updated = await response.Content.ReadFromJsonAsync<TechnologyTheoryQuestion>();
        updated!.IsMastered.Should().BeFalse();
        updated.AnsweredAt.Should().BeNull();
    }

    [Fact]
    public async Task DeleteTheoryQuestion_RemovesQuestion()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedTheorySectionId(techId);
        var questionId = _factory.Seed(new TechnologyTheoryQuestion { SectionId = sectionId, Question = "¿Qué es un Pod?", Points = 5 });

        var deleteResponse = await _client.DeleteAsync($"/api/technologies/{techId}/theory-questions/{questionId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var questions = await _client.GetFromJsonAsync<TechnologyTheoryQuestion[]>($"/api/technologies/{techId}/theory-questions");
        questions.Should().BeEmpty();
    }

    // ── CSV import ───────────────────────────────────────────────────────────

    [Fact]
    public async Task ImportCsv_Returns404_WhenTechnologyNotOwned()
    {
        var otherTechId = SeedTechnologyId(userId: "other-user");

        var response = await _client.PostAsJsonAsync($"/api/technologies/{otherTechId}/import-csv", new { csv = "Practice,Fundamentos,Item,Practice,5" });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ImportCsv_CreatesNewCategoriesAndTopics()
    {
        // NOTE: per CSV format Category,Subcategory,Name,Type,Points — "Subcategory" (col 2) is the
        // real grouping used to create/reuse a section (e.g. "Basics"/"Networking"/"Architecture");
        // "Category" (col 1) is just stored informatively on the topic (here it mirrors Type, which
        // is how the user's real-world data tends to look — always "Practice" or "Theory").
        var techId = SeedTechnologyId();
        var csv = string.Join('\n', new[]
        {
            "Practice,Basics,Instalar Minikube o Kind,Practice,5",
            "Practice,Basics,Instalar kubectl,Practice,3",
            "Practice,Networking,Configurar Ingress,Practice,20",
            "Theory,Architecture,¿Qué es Kubernetes?,Theory,5",
        });

        var response = await _client.PostAsJsonAsync($"/api/technologies/{techId}/import-csv", new { csv });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<ImportResult>();
        result!.imported.Should().Be(4);
        result.skipped.Should().Be(0);
        result.errors.Should().BeEmpty();

        var practiceSections = await _client.GetFromJsonAsync<TechnologyPracticeSection[]>($"/api/technologies/{techId}/practice-sections");
        practiceSections.Should().HaveCount(2);
        practiceSections.Should().Contain(s => s.Title == "Basics");
        practiceSections.Should().Contain(s => s.Title == "Networking");

        var theorySections = await _client.GetFromJsonAsync<TechnologyTheorySection[]>($"/api/technologies/{techId}/theory-sections");
        theorySections.Should().ContainSingle(s => s.Title == "Architecture");

        var practiceItems = await _client.GetFromJsonAsync<TechnologyPracticeItem[]>($"/api/technologies/{techId}/practice-items");
        practiceItems.Should().HaveCount(3);
        // Order must respect CSV row order
        practiceItems!.OrderBy(p => p.Order).Select(p => p.Title).Should().ContainInOrder("Instalar Minikube o Kind", "Instalar kubectl", "Configurar Ingress");

        var theoryQuestions = await _client.GetFromJsonAsync<TechnologyTheoryQuestion[]>($"/api/technologies/{techId}/theory-questions");
        theoryQuestions.Should().ContainSingle(q => q.Question == "¿Qué es Kubernetes?" && q.Points == 5);
    }

    [Fact]
    public async Task ImportCsv_ReusesExistingCategoryByName()
    {
        var techId = SeedTechnologyId();
        var existingSectionId = SeedPracticeSectionId(techId, "Basics");

        var response = await _client.PostAsJsonAsync($"/api/technologies/{techId}/import-csv",
            new { csv = "Practice,Basics,Instalar kubectl,Practice,3" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var practiceSections = await _client.GetFromJsonAsync<TechnologyPracticeSection[]>($"/api/technologies/{techId}/practice-sections");
        practiceSections.Should().ContainSingle(); // no duplicate section created

        var items = await _client.GetFromJsonAsync<TechnologyPracticeItem[]>($"/api/technologies/{techId}/practice-items");
        items.Should().ContainSingle(i => i.SectionId == existingSectionId);
    }

    [Fact]
    public async Task ImportCsv_SkipsDuplicateTopics_SameCategoryAndName()
    {
        var techId = SeedTechnologyId();
        var sectionId = SeedPracticeSectionId(techId, "Basics");
        _factory.Seed(new TechnologyPracticeItem { SectionId = sectionId, Title = "Instalar kubectl", Points = 3 });

        var response = await _client.PostAsJsonAsync($"/api/technologies/{techId}/import-csv",
            new { csv = "Practice,Basics,Instalar kubectl,Practice,99\nPractice,Basics,Instalar kubectl,Practice,99" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<ImportResult>();
        result!.imported.Should().Be(0);
        result.skipped.Should().Be(2); // one dup against existing DB row, one dup against itself within the file

        var items = await _client.GetFromJsonAsync<TechnologyPracticeItem[]>($"/api/technologies/{techId}/practice-items");
        items.Should().ContainSingle(); // still just the original seeded row
    }

    [Fact]
    public async Task ImportCsv_RecordsErrors_AndContinuesOtherRows()
    {
        var techId = SeedTechnologyId();
        var csv = string.Join('\n', new[]
        {
            "Practice,Fundamentos,Instalar kubectl,Practice,3",
            "Practice,Fundamentos,Bad Row Missing Columns",
            "Practice,Fundamentos,Bad Type,Unknown,5",
            "Practice,Fundamentos,Bad Points,Practice,notanumber",
            "Theory,Arquitectura,¿Qué es un Pod?,Theory,5",
        });

        var response = await _client.PostAsJsonAsync($"/api/technologies/{techId}/import-csv", new { csv });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<ImportResult>();
        result!.imported.Should().Be(2);
        result.skipped.Should().Be(0);
        result.errors.Should().HaveCount(3);
    }

    [Fact]
    public async Task ImportCsv_SkipsHeaderRow_WhenPresent()
    {
        var techId = SeedTechnologyId();
        var csv = "Category,Subcategory,Name,Type,Points\nPractice,Fundamentos,Instalar kubectl,Practice,3";

        var response = await _client.PostAsJsonAsync($"/api/technologies/{techId}/import-csv", new { csv });

        var result = await response.Content.ReadFromJsonAsync<ImportResult>();
        result!.imported.Should().Be(1);

        var items = await _client.GetFromJsonAsync<TechnologyPracticeItem[]>($"/api/technologies/{techId}/practice-items");
        items.Should().ContainSingle(i => i.Title == "Instalar kubectl");
    }

    [Fact]
    public async Task ImportCsv_UsesSubcategoryColumnAsSection_AndCategoryColumnAsInformativeField()
    {
        var techId = SeedTechnologyId();

        await _client.PostAsJsonAsync($"/api/technologies/{techId}/import-csv",
            new { csv = "Practice,Fundamentos,Instalar kubectl,Practice,3" });

        var sections = await _client.GetFromJsonAsync<TechnologyPracticeSection[]>($"/api/technologies/{techId}/practice-sections");
        sections!.Single().Title.Should().Be("Fundamentos"); // Subcategory column (col 2) becomes the section

        var items = await _client.GetFromJsonAsync<TechnologyPracticeItem[]>($"/api/technologies/{techId}/practice-items");
        items!.Single().Subcategory.Should().Be("Practice"); // Category column (col 1) is just informative
    }

    private record ImportResult(int imported, int skipped, string[] errors);

    private record TechnologyResponse(int id, string name, string color, string icon, string notes,
        int practiceEarnedPoints, int practiceTotalPoints, int theoryEarnedPoints, int theoryTotalPoints,
        int totalScore, string level);
}
