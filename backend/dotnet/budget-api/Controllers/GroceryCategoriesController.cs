using System.Security.Claims;
using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Authorize]
[Route("api/grocery-categories")]
public class GroceryCategoriesController(BudgetDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.GroceryCategories.Where(c => c.UserId == CurrentUserId).OrderBy(c => c.Name).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var c = await db.GroceryCategories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        return c is null ? NotFound() : Ok(c);
    }

    [HttpPost]
    public async Task<IActionResult> Create(GroceryCategory category)
    {
        category.UserId = CurrentUserId;
        db.GroceryCategories.Add(category);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, GroceryCategory category)
    {
        if (id != category.Id) return BadRequest();
        var existing = await db.GroceryCategories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Name = category.Name;
        existing.Color = category.Color;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await db.GroceryCategories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (category is null) return NotFound();
        db.GroceryCategories.Remove(category);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
