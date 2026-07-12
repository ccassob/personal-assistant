using System.Security.Claims;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BudgetsController(PersonalAssistantDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? month, [FromQuery] int? year)
    {
        var query = db.Budgets.Include(b => b.Category)
            .Where(b => b.UserId == CurrentUserId);
        if (month.HasValue) query = query.Where(b => b.Month == month);
        if (year.HasValue) query = query.Where(b => b.Year == year);
        return Ok(await query.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var budget = await db.Budgets.Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);
        return budget is null ? NotFound() : Ok(budget);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Budget budget)
    {
        budget.UserId = CurrentUserId;
        db.Budgets.Add(budget);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = budget.Id }, budget);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Budget budget)
    {
        if (id != budget.Id) return BadRequest();
        var existing = await db.Budgets.FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.CategoryId = budget.CategoryId;
        existing.Month = budget.Month;
        existing.Year = budget.Year;
        existing.TargetAmount = budget.TargetAmount;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var budget = await db.Budgets.FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);
        if (budget is null) return NotFound();
        db.Budgets.Remove(budget);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("year-summary")]
    public async Task<IActionResult> GetYearSummary([FromQuery] int year)
    {
        var categories = await db.Categories
            .Where(c => c.UserId == CurrentUserId && c.Type == "Expense")
            .ToListAsync();

        var budgets = await db.Budgets
            .Where(b => b.UserId == CurrentUserId && b.Year == year)
            .ToListAsync();

        var transactions = await db.Transactions
            .Where(t => t.UserId == CurrentUserId && t.Date.Year == year && t.Type == "Expense")
            .ToListAsync();

        var budgetMap = budgets.ToDictionary(b => (b.CategoryId, b.Month), b => b.TargetAmount);
        var spendMap = transactions
            .GroupBy(t => (t.CategoryId, t.Date.Month))
            .ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));

        var result = categories.SelectMany(cat =>
            Enumerable.Range(1, 12).Select(month => new
            {
                CategoryId = cat.Id,
                CategoryName = cat.Name,
                Month = month,
                Year = year,
                TargetAmount = budgetMap.TryGetValue((cat.Id, month), out var ta) ? ta : 0m,
                ActualSpent = spendMap.TryGetValue((cat.Id, month), out var sp) ? sp : 0m
            })
        );

        return Ok(result);
    }

    [HttpPost("upsert")]
    public async Task<IActionResult> Upsert([FromBody] UpsertBudgetRequest req)
    {
        var existing = await db.Budgets.FirstOrDefaultAsync(b =>
            b.UserId == CurrentUserId &&
            b.CategoryId == req.CategoryId &&
            b.Month == req.Month &&
            b.Year == req.Year);

        if (existing is not null)
        {
            existing.TargetAmount = req.TargetAmount;
            await db.SaveChangesAsync();
            return Ok(existing);
        }

        var budget = new Budget
        {
            CategoryId = req.CategoryId,
            Month = req.Month,
            Year = req.Year,
            TargetAmount = req.TargetAmount,
            UserId = CurrentUserId
        };
        db.Budgets.Add(budget);
        await db.SaveChangesAsync();
        return Ok(budget);
    }
}

public record UpsertBudgetRequest(int CategoryId, int Month, int Year, decimal TargetAmount);
