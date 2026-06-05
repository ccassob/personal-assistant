using System.Security.Claims;
using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BudgetsController(BudgetDbContext db) : ControllerBase
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
}
