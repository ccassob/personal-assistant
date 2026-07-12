using System.Security.Claims;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Authorize]
[Route("api/recurring-transactions")]
public class RecurringTransactionsController(PersonalAssistantDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var settings = await db.AppSettings.FirstOrDefaultAsync(s => s.UserId == CurrentUserId);
        var cutoffDay = settings?.CutoffDay ?? 1;
        var items = await db.RecurringTransactions.Include(r => r.Category)
            .Where(r => r.UserId == CurrentUserId).ToListAsync();
        return Ok(items.OrderBy(r => (r.DayOfMonth - cutoffDay + 31) % 31));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await db.RecurringTransactions.Include(r => r.Category)
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == CurrentUserId);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(RecurringTransaction item)
    {
        item.UserId = CurrentUserId;
        db.RecurringTransactions.Add(item);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, RecurringTransaction item)
    {
        if (id != item.Id) return BadRequest();
        var existing = await db.RecurringTransactions
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Description = item.Description;
        existing.Amount = item.Amount;
        existing.Type = item.Type;
        existing.CategoryId = item.CategoryId;
        existing.DayOfMonth = item.DayOfMonth;
        existing.Notes = item.Notes;
        existing.IsActive = item.IsActive;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await db.RecurringTransactions
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == CurrentUserId);
        if (item is null) return NotFound();
        db.RecurringTransactions.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromQuery] int month, [FromQuery] int year)
    {
        if (month < 1 || month > 12 || year < 2000) return BadRequest("Invalid month or year.");

        var settings = await db.AppSettings.FirstOrDefaultAsync(s => s.UserId == CurrentUserId);
        var cutoffDay = settings?.CutoffDay ?? 1;
        var nextMonth = month % 12 + 1;
        var nextYear = month == 12 ? year + 1 : year;

        var templates = await db.RecurringTransactions
            .Where(r => r.IsActive && r.UserId == CurrentUserId).ToListAsync();
        var created = new List<Transaction>();

        foreach (var template in templates)
        {
            int targetYear, targetMonth;
            if (template.DayOfMonth >= cutoffDay) { targetYear = year; targetMonth = month; }
            else { targetYear = nextYear; targetMonth = nextMonth; }

            var lastDay = DateTime.DaysInMonth(targetYear, targetMonth);
            db.Transactions.Add(new Transaction
            {
                Date = new DateOnly(targetYear, targetMonth, Math.Min(template.DayOfMonth, lastDay)),
                Amount = template.Amount,
                Description = template.Description,
                Type = template.Type,
                CategoryId = template.CategoryId,
                Notes = template.Notes,
                UserId = CurrentUserId,
            });
        }
        await db.SaveChangesAsync();
        return Ok(new { generated = templates.Count });
    }
}
