using System.Security.Claims;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Route("api/technology-categories")]
[Authorize]
public class TechnologyCategoriesController(PersonalAssistantDbContext ctx) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await ctx.TechnologyCategories
            .Where(c => c.UserId == CurrentUserId)
            .OrderBy(c => c.Name)
            .ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TechnologyCategory cat)
    {
        cat.Id = 0;
        cat.UserId = CurrentUserId;
        ctx.TechnologyCategories.Add(cat);
        await ctx.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = cat.Id }, cat);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TechnologyCategory cat)
    {
        var existing = await ctx.TechnologyCategories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Name = cat.Name;
        existing.Color = cat.Color;
        existing.Icon = cat.Icon;
        await ctx.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var cat = await ctx.TechnologyCategories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (cat is null) return NotFound();
        ctx.TechnologyCategories.Remove(cat);
        await ctx.SaveChangesAsync();
        return NoContent();
    }
}
