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
public class GoalsController(BudgetDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Goals.Where(g => g.UserId == CurrentUserId).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var goal = await db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == CurrentUserId);
        return goal is null ? NotFound() : Ok(goal);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Goal goal)
    {
        goal.UserId = CurrentUserId;
        db.Goals.Add(goal);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = goal.Id }, goal);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Goal goal)
    {
        if (id != goal.Id) return BadRequest();
        var existing = await db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Name = goal.Name;
        existing.Description = goal.Description;
        existing.TargetAmount = goal.TargetAmount;
        existing.CurrentAmount = goal.CurrentAmount;
        existing.Deadline = goal.Deadline;
        existing.Status = goal.Status;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var goal = await db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == CurrentUserId);
        if (goal is null) return NotFound();
        db.Goals.Remove(goal);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
