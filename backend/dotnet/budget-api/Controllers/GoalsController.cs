using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoalsController(BudgetDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Goals.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var goal = await db.Goals.FindAsync(id);
        return goal is null ? NotFound() : Ok(goal);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Goal goal)
    {
        db.Goals.Add(goal);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = goal.Id }, goal);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Goal goal)
    {
        if (id != goal.Id) return BadRequest();
        db.Entry(goal).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var goal = await db.Goals.FindAsync(id);
        if (goal is null) return NotFound();
        db.Goals.Remove(goal);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
