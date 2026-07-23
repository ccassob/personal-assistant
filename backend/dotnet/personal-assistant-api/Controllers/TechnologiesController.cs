using System.Security.Claims;
using System.Text;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Authorize]
[Route("api/technologies")]
public class TechnologiesController(PersonalAssistantDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    private Task<bool> OwnsTechnology(int id) => db.Technologies.AnyAsync(t => t.Id == id && t.UserId == CurrentUserId);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var technologies = await db.Technologies
            .Where(t => t.UserId == CurrentUserId)
            .OrderBy(t => t.Name)
            .ToListAsync();
        var ids = technologies.Select(t => t.Id).ToList();

        var practiceSections = await db.TechnologyPracticeSections.Where(s => ids.Contains(s.TechnologyId)).ToListAsync();
        var practiceSectionIds = practiceSections.Select(s => s.Id).ToList();
        var practiceItems = await db.TechnologyPracticeItems.Where(p => practiceSectionIds.Contains(p.SectionId)).ToListAsync();

        var theorySections = await db.TechnologyTheorySections.Where(s => ids.Contains(s.TechnologyId)).ToListAsync();
        var theorySectionIds = theorySections.Select(s => s.Id).ToList();
        var theoryQuestions = await db.TechnologyTheoryQuestions.Where(q => theorySectionIds.Contains(q.SectionId)).ToListAsync();

        var result = technologies.Select(t =>
        {
            var mySectionIds = practiceSections.Where(s => s.TechnologyId == t.Id).Select(s => s.Id).ToHashSet();
            var myTheorySectionIds = theorySections.Where(s => s.TechnologyId == t.Id).Select(s => s.Id).ToHashSet();
            return BuildResponse(t,
                practiceItems.Where(p => mySectionIds.Contains(p.SectionId)),
                theoryQuestions.Where(q => myTheorySectionIds.Contains(q.SectionId)));
        });
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var technology = await db.Technologies.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        if (technology is null) return NotFound();

        var sectionIds = await db.TechnologyPracticeSections.Where(s => s.TechnologyId == id).Select(s => s.Id).ToListAsync();
        var practiceItems = await db.TechnologyPracticeItems.Where(p => sectionIds.Contains(p.SectionId)).ToListAsync();

        var theorySectionIds = await db.TechnologyTheorySections.Where(s => s.TechnologyId == id).Select(s => s.Id).ToListAsync();
        var theoryQuestions = await db.TechnologyTheoryQuestions.Where(q => theorySectionIds.Contains(q.SectionId)).ToListAsync();

        return Ok(BuildResponse(technology, practiceItems, theoryQuestions));
    }

    [HttpPost]
    public async Task<IActionResult> Create(Technology technology)
    {
        technology.UserId = CurrentUserId;
        db.Technologies.Add(technology);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = technology.Id }, technology);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Technology technology)
    {
        if (id != technology.Id) return BadRequest();
        var existing = await db.Technologies.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Name = technology.Name;
        existing.Color = technology.Color;
        existing.Icon = technology.Icon;
        existing.Notes = technology.Notes;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var technology = await db.Technologies.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        if (technology is null) return NotFound();

        var practiceSectionIds = await db.TechnologyPracticeSections.Where(s => s.TechnologyId == id).Select(s => s.Id).ToListAsync();
        db.TechnologyPracticeItems.RemoveRange(await db.TechnologyPracticeItems.Where(p => practiceSectionIds.Contains(p.SectionId)).ToListAsync());
        db.TechnologyPracticeSections.RemoveRange(await db.TechnologyPracticeSections.Where(s => s.TechnologyId == id).ToListAsync());

        var theorySectionIds = await db.TechnologyTheorySections.Where(s => s.TechnologyId == id).Select(s => s.Id).ToListAsync();
        db.TechnologyTheoryQuestions.RemoveRange(await db.TechnologyTheoryQuestions.Where(q => theorySectionIds.Contains(q.SectionId)).ToListAsync());
        db.TechnologyTheorySections.RemoveRange(await db.TechnologyTheorySections.Where(s => s.TechnologyId == id).ToListAsync());

        db.Technologies.Remove(technology);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ── Practice sections ────────────────────────────────────────────────────

    [HttpGet("{id}/practice-sections")]
    public async Task<IActionResult> GetPracticeSections(int id)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        return Ok(await db.TechnologyPracticeSections.Where(s => s.TechnologyId == id).OrderBy(s => s.Id).ToListAsync());
    }

    [HttpPost("{id}/practice-sections")]
    public async Task<IActionResult> CreatePracticeSection(int id, [FromBody] CreateSectionRequest req)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var section = new TechnologyPracticeSection { TechnologyId = id, Title = req.Title };
        db.TechnologyPracticeSections.Add(section);
        await db.SaveChangesAsync();
        return Ok(section);
    }

    [HttpPut("{id}/practice-sections/{sectionId}")]
    public async Task<IActionResult> UpdatePracticeSection(int id, int sectionId, [FromBody] CreateSectionRequest req)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var section = await db.TechnologyPracticeSections.FirstOrDefaultAsync(s => s.Id == sectionId && s.TechnologyId == id);
        if (section is null) return NotFound();
        section.Title = req.Title;
        await db.SaveChangesAsync();
        return Ok(section);
    }

    [HttpDelete("{id}/practice-sections/{sectionId}")]
    public async Task<IActionResult> DeletePracticeSection(int id, int sectionId)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var section = await db.TechnologyPracticeSections.FirstOrDefaultAsync(s => s.Id == sectionId && s.TechnologyId == id);
        if (section is null) return NotFound();
        db.TechnologyPracticeItems.RemoveRange(await db.TechnologyPracticeItems.Where(p => p.SectionId == sectionId).ToListAsync());
        db.TechnologyPracticeSections.Remove(section);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ── Practice items ───────────────────────────────────────────────────────

    [HttpGet("{id}/practice-items")]
    public async Task<IActionResult> GetPracticeItems(int id)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var sectionIds = await db.TechnologyPracticeSections.Where(s => s.TechnologyId == id).Select(s => s.Id).ToListAsync();
        return Ok(await db.TechnologyPracticeItems.Where(p => sectionIds.Contains(p.SectionId)).OrderBy(p => p.Order).ToListAsync());
    }

    [HttpPost("{id}/practice-items")]
    public async Task<IActionResult> CreatePracticeItem(int id, [FromBody] CreatePracticeItemRequest req)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        if (!await db.TechnologyPracticeSections.AnyAsync(s => s.Id == req.SectionId && s.TechnologyId == id)) return NotFound();
        var item = new TechnologyPracticeItem
        {
            SectionId = req.SectionId,
            Title = req.Title,
            Subcategory = req.Subcategory ?? "",
            Points = req.Points,
            Order = await NextPracticeOrder(id)
        };
        db.TechnologyPracticeItems.Add(item);
        await db.SaveChangesAsync();
        return Ok(item);
    }

    private async Task<int> NextPracticeOrder(int technologyId)
    {
        var sectionIds = await db.TechnologyPracticeSections.Where(s => s.TechnologyId == technologyId).Select(s => s.Id).ToListAsync();
        var maxOrder = await db.TechnologyPracticeItems.Where(p => sectionIds.Contains(p.SectionId)).Select(p => (int?)p.Order).MaxAsync();
        return (maxOrder ?? -1) + 1;
    }

    [HttpPut("{id}/practice-items/{itemId}")]
    public async Task<IActionResult> UpdatePracticeItem(int id, int itemId, [FromBody] UpdatePracticeItemRequest req)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var item = await FindOwnedPracticeItem(id, itemId);
        if (item is null) return NotFound();

        item.IsDone = req.IsDone;
        item.Notes = req.Notes ?? "";
        item.CompletedAt = req.IsDone ? DateOnly.FromDateTime(DateTime.Today) : null;
        await db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id}/practice-items/{itemId}")]
    public async Task<IActionResult> DeletePracticeItem(int id, int itemId)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var item = await FindOwnedPracticeItem(id, itemId);
        if (item is null) return NotFound();
        db.TechnologyPracticeItems.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private Task<TechnologyPracticeItem?> FindOwnedPracticeItem(int techId, int itemId) =>
        (from i in db.TechnologyPracticeItems
         join s in db.TechnologyPracticeSections on i.SectionId equals s.Id
         where i.Id == itemId && s.TechnologyId == techId
         select i).FirstOrDefaultAsync();

    // ── Theory sections ──────────────────────────────────────────────────────

    [HttpGet("{id}/theory-sections")]
    public async Task<IActionResult> GetTheorySections(int id)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        return Ok(await db.TechnologyTheorySections.Where(s => s.TechnologyId == id).OrderBy(s => s.Id).ToListAsync());
    }

    [HttpPost("{id}/theory-sections")]
    public async Task<IActionResult> CreateTheorySection(int id, [FromBody] CreateSectionRequest req)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var section = new TechnologyTheorySection { TechnologyId = id, Title = req.Title };
        db.TechnologyTheorySections.Add(section);
        await db.SaveChangesAsync();
        return Ok(section);
    }

    [HttpPut("{id}/theory-sections/{sectionId}")]
    public async Task<IActionResult> UpdateTheorySection(int id, int sectionId, [FromBody] CreateSectionRequest req)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var section = await db.TechnologyTheorySections.FirstOrDefaultAsync(s => s.Id == sectionId && s.TechnologyId == id);
        if (section is null) return NotFound();
        section.Title = req.Title;
        await db.SaveChangesAsync();
        return Ok(section);
    }

    [HttpDelete("{id}/theory-sections/{sectionId}")]
    public async Task<IActionResult> DeleteTheorySection(int id, int sectionId)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var section = await db.TechnologyTheorySections.FirstOrDefaultAsync(s => s.Id == sectionId && s.TechnologyId == id);
        if (section is null) return NotFound();
        db.TechnologyTheoryQuestions.RemoveRange(await db.TechnologyTheoryQuestions.Where(q => q.SectionId == sectionId).ToListAsync());
        db.TechnologyTheorySections.Remove(section);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ── Theory questions ─────────────────────────────────────────────────────

    [HttpGet("{id}/theory-questions")]
    public async Task<IActionResult> GetTheoryQuestions(int id)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var sectionIds = await db.TechnologyTheorySections.Where(s => s.TechnologyId == id).Select(s => s.Id).ToListAsync();
        return Ok(await db.TechnologyTheoryQuestions.Where(q => sectionIds.Contains(q.SectionId)).OrderBy(q => q.Order).ToListAsync());
    }

    [HttpPost("{id}/theory-questions")]
    public async Task<IActionResult> CreateTheoryQuestion(int id, [FromBody] CreateTheoryQuestionRequest req)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        if (!await db.TechnologyTheorySections.AnyAsync(s => s.Id == req.SectionId && s.TechnologyId == id)) return NotFound();
        var question = new TechnologyTheoryQuestion
        {
            SectionId = req.SectionId,
            Question = req.Question,
            Subcategory = req.Subcategory ?? "",
            Points = req.Points,
            Order = await NextTheoryOrder(id)
        };
        db.TechnologyTheoryQuestions.Add(question);
        await db.SaveChangesAsync();
        return Ok(question);
    }

    private async Task<int> NextTheoryOrder(int technologyId)
    {
        var sectionIds = await db.TechnologyTheorySections.Where(s => s.TechnologyId == technologyId).Select(s => s.Id).ToListAsync();
        var maxOrder = await db.TechnologyTheoryQuestions.Where(q => sectionIds.Contains(q.SectionId)).Select(q => (int?)q.Order).MaxAsync();
        return (maxOrder ?? -1) + 1;
    }

    [HttpPut("{id}/theory-questions/{questionId}")]
    public async Task<IActionResult> UpdateTheoryQuestion(int id, int questionId, [FromBody] UpdateTheoryQuestionRequest req)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var question = await FindOwnedTheoryQuestion(id, questionId);
        if (question is null) return NotFound();

        question.IsMastered = req.IsMastered;
        question.Notes = req.Notes ?? "";
        question.AnsweredAt = req.IsMastered ? DateOnly.FromDateTime(DateTime.Today) : null;
        await db.SaveChangesAsync();
        return Ok(question);
    }

    [HttpDelete("{id}/theory-questions/{questionId}")]
    public async Task<IActionResult> DeleteTheoryQuestion(int id, int questionId)
    {
        if (!await OwnsTechnology(id)) return NotFound();
        var question = await FindOwnedTheoryQuestion(id, questionId);
        if (question is null) return NotFound();
        db.TechnologyTheoryQuestions.Remove(question);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private Task<TechnologyTheoryQuestion?> FindOwnedTheoryQuestion(int techId, int questionId) =>
        (from q in db.TechnologyTheoryQuestions
         join s in db.TechnologyTheorySections on q.SectionId equals s.Id
         where q.Id == questionId && s.TechnologyId == techId
         select q).FirstOrDefaultAsync();

    // ── CSV import ───────────────────────────────────────────────────────────

    [HttpPost("{id}/import-csv")]
    public async Task<IActionResult> ImportCsv(int id, [FromBody] ImportTopicsRequest req)
    {
        if (!await OwnsTechnology(id)) return NotFound();

        var practiceSections = await db.TechnologyPracticeSections.Where(s => s.TechnologyId == id).ToListAsync();
        var theorySections = await db.TechnologyTheorySections.Where(s => s.TechnologyId == id).ToListAsync();
        var practiceSectionsByTitle = practiceSections.ToDictionary(s => s.Title, s => s, StringComparer.OrdinalIgnoreCase);
        var theorySectionsByTitle = theorySections.ToDictionary(s => s.Title, s => s, StringComparer.OrdinalIgnoreCase);

        var practiceSectionIds = practiceSections.Select(s => s.Id).ToHashSet();
        var theorySectionIds = theorySections.Select(s => s.Id).ToHashSet();
        var existingPracticeItems = await db.TechnologyPracticeItems.Where(p => practiceSectionIds.Contains(p.SectionId)).ToListAsync();
        var existingTheoryQuestions = await db.TechnologyTheoryQuestions.Where(q => theorySectionIds.Contains(q.SectionId)).ToListAsync();

        var practiceSectionTitleById = practiceSections.ToDictionary(s => s.Id, s => s.Title);
        var theorySectionTitleById = theorySections.ToDictionary(s => s.Id, s => s.Title);

        var seenPracticeKeys = existingPracticeItems
            .Select(p => (practiceSectionTitleById[p.SectionId].Trim().ToLowerInvariant(), p.Title.Trim().ToLowerInvariant()))
            .ToHashSet();
        var seenTheoryKeys = existingTheoryQuestions
            .Select(q => (theorySectionTitleById[q.SectionId].Trim().ToLowerInvariant(), q.Question.Trim().ToLowerInvariant()))
            .ToHashSet();

        var nextPracticeOrder = existingPracticeItems.Count > 0 ? existingPracticeItems.Max(p => p.Order) + 1 : 0;
        var nextTheoryOrder = existingTheoryQuestions.Count > 0 ? existingTheoryQuestions.Max(q => q.Order) + 1 : 0;

        var newPracticeSections = new List<TechnologyPracticeSection>();
        var newTheorySections = new List<TechnologyTheorySection>();
        var pendingPracticeItems = new List<(TechnologyPracticeItem item, string sectionName)>();
        var pendingTheoryQuestions = new List<(TechnologyTheoryQuestion question, string sectionName)>();
        var errors = new List<string>();
        int imported = 0, skipped = 0;

        var lines = (req.Csv ?? "")
            .Replace("\r\n", "\n")
            .Split('\n')
            .Where(l => l.Trim().Length > 0)
            .ToList();

        var startIndex = 0;
        if (lines.Count > 0)
        {
            var firstFields = ParseCsvLine(lines[0]);
            if (firstFields.Length != 5 || !int.TryParse(firstFields[4].Trim(), out _)) startIndex = 1; // header row
        }

        for (var i = startIndex; i < lines.Count; i++)
        {
            var rowNumber = i + 1;
            var fields = ParseCsvLine(lines[i]);
            if (fields.Length != 5)
            {
                errors.Add($"Fila {rowNumber}: se esperaban 5 columnas, se encontraron {fields.Length}.");
                continue;
            }

            // NOTE: per the user's clarified intent, "Subcategory" (col 2) is the real grouping used to
            // create/reuse a section (e.g. "Fundamentos"); "Category" (col 1) is just stored informatively
            // on the topic (in practice it tends to just duplicate Type, e.g. "Practice"/"Theory").
            var categoryValue = fields[0].Trim();
            var sectionName = fields[1].Trim();
            var name = fields[2].Trim();
            var typeRaw = fields[3].Trim();
            var pointsRaw = fields[4].Trim();

            if (string.IsNullOrWhiteSpace(sectionName) || string.IsNullOrWhiteSpace(name))
            {
                errors.Add($"Fila {rowNumber}: Subcategory y Name son obligatorios.");
                continue;
            }
            if (!Enum.TryParse<TopicType>(typeRaw, true, out var type))
            {
                errors.Add($"Fila {rowNumber}: Type inválido '{typeRaw}' (debe ser Practice o Theory).");
                continue;
            }
            if (!int.TryParse(pointsRaw, out var points))
            {
                errors.Add($"Fila {rowNumber}: Points inválido '{pointsRaw}'.");
                continue;
            }

            var key = (sectionName.ToLowerInvariant(), name.ToLowerInvariant());

            if (type == TopicType.Practice)
            {
                if (!seenPracticeKeys.Add(key)) { skipped++; continue; }

                if (!practiceSectionsByTitle.TryGetValue(sectionName, out var section))
                {
                    section = new TechnologyPracticeSection { TechnologyId = id, Title = sectionName };
                    practiceSectionsByTitle[sectionName] = section;
                    newPracticeSections.Add(section);
                }
                pendingPracticeItems.Add((new TechnologyPracticeItem
                {
                    Title = name,
                    Subcategory = categoryValue,
                    Points = points,
                    Order = nextPracticeOrder++
                }, sectionName));
            }
            else
            {
                if (!seenTheoryKeys.Add(key)) { skipped++; continue; }

                if (!theorySectionsByTitle.TryGetValue(sectionName, out var section))
                {
                    section = new TechnologyTheorySection { TechnologyId = id, Title = sectionName };
                    theorySectionsByTitle[sectionName] = section;
                    newTheorySections.Add(section);
                }
                pendingTheoryQuestions.Add((new TechnologyTheoryQuestion
                {
                    Question = name,
                    Subcategory = categoryValue,
                    Points = points,
                    Order = nextTheoryOrder++
                }, sectionName));
            }
            imported++;
        }

        // New sections need to exist (and have real Ids) before their topics can reference them.
        if (newPracticeSections.Count > 0) db.TechnologyPracticeSections.AddRange(newPracticeSections);
        if (newTheorySections.Count > 0) db.TechnologyTheorySections.AddRange(newTheorySections);
        if (newPracticeSections.Count > 0 || newTheorySections.Count > 0) await db.SaveChangesAsync();

        foreach (var (item, sectionName) in pendingPracticeItems)
        {
            item.SectionId = practiceSectionsByTitle[sectionName].Id;
            db.TechnologyPracticeItems.Add(item);
        }
        foreach (var (question, sectionName) in pendingTheoryQuestions)
        {
            question.SectionId = theorySectionsByTitle[sectionName].Id;
            db.TechnologyTheoryQuestions.Add(question);
        }
        await db.SaveChangesAsync();

        return Ok(new { imported, skipped, errors });
    }

    private static string[] ParseCsvLine(string line)
    {
        var fields = new List<string>();
        var sb = new StringBuilder();
        var inQuotes = false;
        for (var i = 0; i < line.Length; i++)
        {
            var c = line[i];
            if (inQuotes)
            {
                if (c == '"')
                {
                    if (i + 1 < line.Length && line[i + 1] == '"') { sb.Append('"'); i++; }
                    else inQuotes = false;
                }
                else sb.Append(c);
            }
            else
            {
                if (c == '"') inQuotes = true;
                else if (c == ',') { fields.Add(sb.ToString()); sb.Clear(); }
                else sb.Append(c);
            }
        }
        fields.Add(sb.ToString());
        return fields.ToArray();
    }

    // ── Scoring ──────────────────────────────────────────────────────────────

    private static object BuildResponse(Technology t, IEnumerable<TechnologyPracticeItem> practiceItems, IEnumerable<TechnologyTheoryQuestion> theoryQuestions)
    {
        var practiceEarned = practiceItems.Where(p => p.IsDone).Sum(p => p.Points);
        var practiceTotal = practiceItems.Sum(p => p.Points);
        var theoryEarned = theoryQuestions.Where(q => q.IsMastered).Sum(q => q.Points);
        var theoryTotal = theoryQuestions.Sum(q => q.Points);

        var totalEarned = practiceEarned + theoryEarned;
        var totalPossible = practiceTotal + theoryTotal;
        var totalScore = totalPossible > 0 ? (int)Math.Round(100.0 * totalEarned / totalPossible) : 0;

        return new
        {
            t.Id,
            t.Name,
            t.Color,
            t.Icon,
            t.Notes,
            practiceEarnedPoints = practiceEarned,
            practiceTotalPoints = practiceTotal,
            theoryEarnedPoints = theoryEarned,
            theoryTotalPoints = theoryTotal,
            totalScore,
            level = GetLevel(totalScore)
        };
    }

    private static string GetLevel(int score) => score switch
    {
        100 => "Dominio demostrado",
        >= 81 => "Experto",
        >= 61 => "Avanzado",
        >= 41 => "Intermedio",
        >= 21 => "Básico",
        _ => "Principiante"
    };
}

public record CreateSectionRequest(string Title);
public record CreatePracticeItemRequest(int SectionId, string Title, int Points, string? Subcategory = null);
public record UpdatePracticeItemRequest(bool IsDone, string? Notes);
public record CreateTheoryQuestionRequest(int SectionId, string Question, int Points, string? Subcategory = null);
public record UpdateTheoryQuestionRequest(bool IsMastered, string? Notes);
public record ImportTopicsRequest(string Csv);

public enum TopicType { Practice, Theory }
