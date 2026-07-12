using System.Security.Claims;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Route("api/credit-card-categories")]
[Authorize]
public class CreditCardCategoriesController(PersonalAssistantDbContext ctx) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await ctx.CreditCardCategories
            .Where(c => c.UserId == CurrentUserId)
            .OrderBy(c => c.Name)
            .ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreditCardCategory cat)
    {
        cat.Id = 0;
        cat.UserId = CurrentUserId;
        ctx.CreditCardCategories.Add(cat);
        await ctx.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = cat.Id }, cat);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreditCardCategory cat)
    {
        var existing = await ctx.CreditCardCategories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
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
        var cat = await ctx.CreditCardCategories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (cat is null) return NotFound();
        var inUse = await ctx.CreditCardTransactions.AnyAsync(t => t.CreditCardCategoryId == id);
        if (inUse) return Conflict("Category is in use by one or more transactions.");
        ctx.CreditCardCategories.Remove(cat);
        await ctx.SaveChangesAsync();
        return NoContent();
    }
}
