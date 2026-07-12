using personal_assistant_api.Data;
using personal_assistant_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace personal_assistant_api.Controllers;

[ApiController]
[Route("api/pantry")]
[Authorize]
public class PantryController(PersonalAssistantDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? filter)
    {
        var items = await db.PantryItems
            .Where(p => p.UserId == CurrentUserId)
            .ToListAsync();

        var today = DateOnly.FromDateTime(DateTime.Today);

        if (filter == "expiring")
            items = items.Where(p => p.ExpiresAt.HasValue && p.ExpiresAt >= today && p.ExpiresAt <= today.AddDays(7)).ToList();
        else if (filter == "expired")
            items = items.Where(p => p.ExpiresAt.HasValue && p.ExpiresAt < today).ToList();

        items = items.OrderBy(p => ExpiryOrder(p, today)).ThenBy(p => p.Name).ToList();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await db.PantryItems.FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(PantryItem item)
    {
        item.UserId = CurrentUserId;
        db.PantryItems.Add(item);
        await db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, PantryItem updated)
    {
        var item = await db.PantryItems.FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);
        if (item is null) return NotFound();

        item.GroceryItemId = updated.GroceryItemId;
        item.Name = updated.Name;
        item.Quantity = updated.Quantity;
        item.UnitType = updated.UnitType;
        item.PurchasedAt = updated.PurchasedAt;
        item.ExpiresAt = updated.ExpiresAt;
        item.Notes = updated.Notes;

        await db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await db.PantryItems.FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);
        if (item is null) return NotFound();

        db.PantryItems.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/consume")]
    public async Task<IActionResult> Consume(int id, ConsumeRequest req)
    {
        var item = await db.PantryItems.FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);
        if (item is null) return NotFound();

        item.Quantity -= req.Amount;
        if (item.Quantity <= 0)
        {
            db.PantryItems.Remove(item);
            await db.SaveChangesAsync();
            return Ok(new { deleted = true });
        }

        await db.SaveChangesAsync();
        return Ok(item);
    }

    private static int ExpiryOrder(PantryItem p, DateOnly today) =>
        p.ExpiresAt == null ? 2 :
        p.ExpiresAt < today ? 0 :
        p.ExpiresAt <= today.AddDays(7) ? 1 :
        2;
}

public record ConsumeRequest(decimal Amount);
