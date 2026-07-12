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
public class CategoriesController(PersonalAssistantDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Categories.Where(c => c.UserId == CurrentUserId).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await db.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Category category)
    {
        category.UserId = CurrentUserId;
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Category category)
    {
        if (id != category.Id) return BadRequest();
        var existing = await db.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Name = category.Name;
        existing.Type = category.Type;
        existing.Color = category.Color;
        existing.Icon = category.Icon;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await db.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (category is null) return NotFound();
        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
