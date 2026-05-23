using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController(BudgetDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? categoryId,
        [FromQuery] string? type,
        [FromQuery] int? month,
        [FromQuery] int? year)
    {
        var query = db.Transactions.Include(t => t.Category).AsQueryable();

        if (categoryId.HasValue) query = query.Where(t => t.CategoryId == categoryId);
        if (!string.IsNullOrEmpty(type)) query = query.Where(t => t.Type == type);

        if (month.HasValue && year.HasValue)
        {
            var settings = await db.AppSettings.FirstOrDefaultAsync();
            var cutoffDay = settings?.CutoffDay ?? 1;
            var (startDate, endDate) = GetPeriod(cutoffDay, month.Value, year.Value);
            query = query.Where(t => t.Date >= startDate && t.Date <= endDate);
        }
        else if (month.HasValue)
        {
            query = query.Where(t => t.Date.Month == month);
        }
        else if (year.HasValue)
        {
            query = query.Where(t => t.Date.Year == year);
        }

        return Ok(await query.OrderByDescending(t => t.IsExecuted).ThenBy(t => t.Date).ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var transaction = await db.Transactions.Include(t => t.Category).FirstOrDefaultAsync(t => t.Id == id);
        return transaction is null ? NotFound() : Ok(transaction);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Transaction transaction)
    {
        db.Transactions.Add(transaction);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Transaction transaction)
    {
        if (id != transaction.Id) return BadRequest();
        db.Entry(transaction).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var transaction = await db.Transactions.FindAsync(id);
        if (transaction is null) return NotFound();
        db.Transactions.Remove(transaction);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAll(
        [FromQuery] int? categoryId,
        [FromQuery] string? type,
        [FromQuery] int? month,
        [FromQuery] int? year)
    {
        var query = db.Transactions.AsQueryable();

        if (categoryId.HasValue) query = query.Where(t => t.CategoryId == categoryId);
        if (!string.IsNullOrEmpty(type)) query = query.Where(t => t.Type == type);

        if (month.HasValue && year.HasValue)
        {
            var settings = await db.AppSettings.FirstOrDefaultAsync();
            var cutoffDay = settings?.CutoffDay ?? 1;
            var (startDate, endDate) = GetPeriod(cutoffDay, month.Value, year.Value);
            query = query.Where(t => t.Date >= startDate && t.Date <= endDate);
        }
        else if (month.HasValue) query = query.Where(t => t.Date.Month == month);
        else if (year.HasValue) query = query.Where(t => t.Date.Year == year);

        var rows = await query.ToListAsync();
        db.Transactions.RemoveRange(rows);
        await db.SaveChangesAsync();
        return Ok(new { deleted = rows.Count });
    }

    [HttpPost("import")]
    public async Task<IActionResult> Import(List<ImportTransactionRow> rows)
    {
        var namesToFind = rows
            .Where(r => !string.IsNullOrWhiteSpace(r.Category))
            .Select(r => r.Category!.Trim().ToLower())
            .Distinct()
            .ToList();

        var categories = await db.Categories
            .Where(c => namesToFind.Contains(c.Name.ToLower()))
            .ToListAsync();

        int imported = 0, errors = 0;

        foreach (var row in rows)
        {
            if (!DateOnly.TryParse(row.Date, out var date)) { errors++; continue; }
            if (row.Amount <= 0) { errors++; continue; }
            if (row.Type != "Income" && row.Type != "Expense") { errors++; continue; }

            var cat = string.IsNullOrWhiteSpace(row.Category)
                ? null
                : categories.FirstOrDefault(c =>
                    c.Name.Equals(row.Category.Trim(), StringComparison.OrdinalIgnoreCase));

            db.Transactions.Add(new Transaction
            {
                Date = date,
                Description = row.Description ?? "",
                Amount = row.Amount,
                Type = row.Type,
                CategoryId = cat?.Id ?? 0,
                Notes = row.Notes ?? "",
                IsExecuted = row.IsExecuted
            });
            imported++;
        }

        await db.SaveChangesAsync();
        return Ok(new { imported, errors });
    }

    private static (DateOnly start, DateOnly end) GetPeriod(int cutoffDay, int month, int year)
    {
        var day = Math.Min(cutoffDay, DateTime.DaysInMonth(year, month));
        var start = new DateOnly(year, month, day);
        var end = DateOnly.FromDateTime(new DateTime(year, month, day).AddMonths(1).AddDays(-1));
        return (start, end);
    }
}

public record ImportTransactionRow(
    string Date,
    string Description,
    decimal Amount,
    string Type,
    string? Category,
    string? Notes,
    bool IsExecuted
);
