using System.Security.Claims;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using personal_assistant_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Authorize]
[Route("api/technologies/{technologyId}/study-audio")]
public class StudyAudioController(PersonalAssistantDbContext db, StudyAudioService studyAudio) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    private Task<bool> OwnsTechnology(int id) =>
        db.Technologies.AnyAsync(t => t.Id == id && t.UserId == CurrentUserId);

    // Each theory section is a "session"; its 1-based position (ordered by Id) is the track number.
    [HttpGet]
    public async Task<IActionResult> GetSessions(int technologyId)
    {
        if (!await OwnsTechnology(technologyId)) return NotFound();

        var sections = await db.TechnologyTheorySections
            .Where(s => s.TechnologyId == technologyId)
            .OrderBy(s => s.Id)
            .ToListAsync();
        var sectionIds = sections.Select(s => s.Id).ToList();

        var questionCounts = await db.TechnologyTheoryQuestions
            .Where(q => sectionIds.Contains(q.SectionId))
            .GroupBy(q => q.SectionId)
            .Select(g => new { SectionId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.SectionId, x => x.Count);

        var rows = await db.StudyAudioSessions
            .Where(a => a.TechnologyId == technologyId && a.UserId == CurrentUserId)
            .ToListAsync();
        var bySection = rows.ToDictionary(a => a.TheorySectionId, a => a);

        var result = sections.Select((s, index) =>
        {
            bySection.TryGetValue(s.Id, out var row);
            var hasAudio = row is not null && !string.IsNullOrEmpty(row.BlobName);
            return new
            {
                sessionNumber = index + 1,
                theorySectionId = s.Id,
                sectionTitle = s.Title,
                questionCount = questionCounts.GetValueOrDefault(s.Id, 0),
                ssml = row?.Ssml ?? "",
                status = row?.Status,
                hasAudio,
                generatedAt = hasAudio ? row!.GeneratedAt : (DateTime?)null
            };
        });
        return Ok(result);
    }

    // Save (upsert) the user-authored SSML for a session. Does not synthesize audio.
    [HttpPut("{sectionId}/ssml")]
    public async Task<IActionResult> SaveSsml(int technologyId, int sectionId, [FromBody] SaveSsmlRequest req)
    {
        var technology = await db.Technologies
            .FirstOrDefaultAsync(t => t.Id == technologyId && t.UserId == CurrentUserId);
        if (technology is null) return NotFound();

        var section = await db.TechnologyTheorySections
            .FirstOrDefaultAsync(s => s.Id == sectionId && s.TechnologyId == technologyId);
        if (section is null) return NotFound();

        var sessionNumber = await SessionNumber(technologyId, sectionId);
        var row = await db.StudyAudioSessions.FirstOrDefaultAsync(a =>
            a.TechnologyId == technologyId && a.TheorySectionId == sectionId && a.UserId == CurrentUserId);

        if (row is null)
        {
            row = new StudyAudioSession
            {
                TechnologyId = technologyId,
                TheorySectionId = sectionId,
                SessionNumber = sessionNumber,
                Title = $"{technology.Name} {section.Title} {sessionNumber}".Trim(),
                Album = technology.Name,
                Status = "Draft",
                Ssml = req.Ssml ?? "",
                BlobName = "",
                GeneratedAt = DateTime.UtcNow,
                UserId = CurrentUserId
            };
            db.StudyAudioSessions.Add(row);
        }
        else
        {
            row.Ssml = req.Ssml ?? "";
            row.SessionNumber = sessionNumber;
            row.Title = $"{technology.Name} {section.Title} {sessionNumber}".Trim();
            row.Album = technology.Name;
            if (string.IsNullOrEmpty(row.BlobName)) row.Status = "Draft";
        }
        await db.SaveChangesAsync();
        return Ok(row);
    }

    // Synthesize the MP3 from the previously saved SSML.
    [HttpPost("{sectionId}/generate")]
    public async Task<IActionResult> Generate(int technologyId, int sectionId)
    {
        var technology = await db.Technologies
            .FirstOrDefaultAsync(t => t.Id == technologyId && t.UserId == CurrentUserId);
        if (technology is null) return NotFound();

        var section = await db.TechnologyTheorySections
            .FirstOrDefaultAsync(s => s.Id == sectionId && s.TechnologyId == technologyId);
        if (section is null) return NotFound();

        var row = await db.StudyAudioSessions.FirstOrDefaultAsync(a =>
            a.TechnologyId == technologyId && a.TheorySectionId == sectionId && a.UserId == CurrentUserId);
        if (row is null || string.IsNullOrWhiteSpace(row.Ssml))
            return BadRequest(new { message = "Guarda el SSML de esta sesión antes de generar el MP3." });

        try
        {
            var blobName = await studyAudio.SynthesizeAsync(technology, section, row.SessionNumber, row.Ssml);
            row.BlobName = blobName;
            row.Status = "Ready";
            row.GeneratedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return Problem(detail: ex.Message, statusCode: StatusCodes.Status502BadGateway,
                title: "No se pudo sintetizar el audio.");
        }
        return Ok(row);
    }

    [HttpGet("{sectionId}/file")]
    public async Task<IActionResult> GetFile(int technologyId, int sectionId)
    {
        var row = await db.StudyAudioSessions.FirstOrDefaultAsync(a =>
            a.TechnologyId == technologyId && a.TheorySectionId == sectionId && a.UserId == CurrentUserId);
        if (row is null || string.IsNullOrEmpty(row.BlobName)) return NotFound();

        var bytes = await studyAudio.GetAudioBytesAsync(row.BlobName);
        return File(bytes, "audio/mpeg", $"{row.Title}.mp3");
    }

    [HttpDelete("{sectionId}")]
    public async Task<IActionResult> Delete(int technologyId, int sectionId)
    {
        var row = await db.StudyAudioSessions.FirstOrDefaultAsync(a =>
            a.TechnologyId == technologyId && a.TheorySectionId == sectionId && a.UserId == CurrentUserId);
        if (row is null) return NotFound();

        if (!string.IsNullOrEmpty(row.BlobName)) await studyAudio.DeleteAudioAsync(row.BlobName);
        db.StudyAudioSessions.Remove(row);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<int> SessionNumber(int technologyId, int sectionId)
    {
        var ordered = await db.TechnologyTheorySections
            .Where(s => s.TechnologyId == technologyId)
            .OrderBy(s => s.Id)
            .Select(s => s.Id)
            .ToListAsync();
        return ordered.IndexOf(sectionId) + 1;
    }
}

public record SaveSsmlRequest(string Ssml);
