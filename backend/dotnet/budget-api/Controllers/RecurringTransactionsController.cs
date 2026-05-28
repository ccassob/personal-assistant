using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Route("api/recurring-transactions")]
public class RecurringTransactionsController(BudgetDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var settings = await db.AppSettings.FirstOrDefaultAsync();
        var cutoffDay = settings?.CutoffDay ?? 1;
        var items = await db.RecurringTransactions.Include(r => r.Category).ToListAsync();
        return Ok(items.OrderBy(r => (r.DayOfMonth - cutoffDay + 31) % 31));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await db.RecurringTransactions.Include(r => r.Category).FirstOrDefaultAsync(r => r.Id == id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(RecurringTransaction item)
    {
        db.RecurringTransactions.Add(item);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, RecurringTransaction item)
    {
        if (id != item.Id) return BadRequest();
        db.Entry(item).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await db.RecurringTransactions.FindAsync(id);
        if (item is null) return NotFound();
        db.RecurringTransactions.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromQuery] int month, [FromQuery] int year)
    {
        if (month < 1 || month > 12 || year < 2000) return BadRequest("Invalid month or year.");

        var settings = await db.AppSettings.FirstOrDefaultAsync();
        var cutoffDay = settings?.CutoffDay ?? 1;

        var nextMonth = month % 12 + 1;
        var nextYear = month == 12 ? year + 1 : year;

        var templates = await db.RecurringTransactions.Where(r => r.IsActive).ToListAsync();
        var created = new List<Transaction>();

        foreach (var template in templates)
        {
            int targetYear, targetMonth;
            if (template.DayOfMonth >= cutoffDay)
            {
                targetYear = year;
                targetMonth = month;
            }
            else
            {
                targetYear = nextYear;
                targetMonth = nextMonth;
            }

            var lastDay = DateTime.DaysInMonth(targetYear, targetMonth);
            var day = Math.Min(template.DayOfMonth, lastDay);
            var transaction = new Transaction
            {
                Date = new DateOnly(targetYear, targetMonth, day),
                Amount = template.Amount,
                Description = template.Description,
                Type = template.Type,
                CategoryId = template.CategoryId,
                Notes = template.Notes,
            };
            db.Transactions.Add(transaction);
            created.Add(transaction);
        }

        await db.SaveChangesAsync();
        return Ok(created);
    }
}
