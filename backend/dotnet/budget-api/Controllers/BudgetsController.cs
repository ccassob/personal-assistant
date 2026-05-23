using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BudgetsController(BudgetDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? month, [FromQuery] int? year)
    {
        var query = db.Budgets.Include(b => b.Category).AsQueryable();
        if (month.HasValue) query = query.Where(b => b.Month == month);
        if (year.HasValue) query = query.Where(b => b.Year == year);
        return Ok(await query.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var budget = await db.Budgets.Include(b => b.Category).FirstOrDefaultAsync(b => b.Id == id);
        return budget is null ? NotFound() : Ok(budget);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Budget budget)
    {
        db.Budgets.Add(budget);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = budget.Id }, budget);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Budget budget)
    {
        if (id != budget.Id) return BadRequest();
        db.Entry(budget).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var budget = await db.Budgets.FindAsync(id);
        if (budget is null) return NotFound();
        db.Budgets.Remove(budget);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
