using System.Security.Claims;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Authorize]
[Route("api/supermarkets")]
public class SupermarketsController(PersonalAssistantDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Supermarkets.Where(s => s.UserId == CurrentUserId).OrderBy(s => s.Name).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var s = await db.Supermarkets.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        return s is null ? NotFound() : Ok(s);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Supermarket supermarket)
    {
        supermarket.UserId = CurrentUserId;
        db.Supermarkets.Add(supermarket);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = supermarket.Id }, supermarket);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Supermarket supermarket)
    {
        if (id != supermarket.Id) return BadRequest();
        var existing = await db.Supermarkets.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Name = supermarket.Name;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var supermarket = await db.Supermarkets.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        if (supermarket is null) return NotFound();
        var hasPurchases = await db.GroceryPurchases.AnyAsync(p => p.SupermarketId == id);
        if (hasPurchases) return Conflict("Cannot delete a supermarket that has purchase history.");
        db.Supermarkets.Remove(supermarket);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
