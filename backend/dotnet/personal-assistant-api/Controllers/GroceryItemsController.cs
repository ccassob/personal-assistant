using System.Security.Claims;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Authorize]
[Route("api/grocery-items")]
public class GroceryItemsController(PersonalAssistantDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    private async Task PopulateSupermarketIds(List<GroceryItem> items)
    {
        var ids = items.Select(i => i.Id).ToList();
        var joins = await db.GroceryItemSupermarkets.Where(x => ids.Contains(x.GroceryItemId)).ToListAsync();
        foreach (var item in items)
            item.SupermarketIds = joins.Where(x => x.GroceryItemId == item.Id).Select(x => x.SupermarketId).ToList();
    }

    private async Task SyncSupermarkets(int itemId, List<int> supermarketIds)
    {
        var existing = db.GroceryItemSupermarkets.Where(x => x.GroceryItemId == itemId);
        db.GroceryItemSupermarkets.RemoveRange(existing);
        db.GroceryItemSupermarkets.AddRange(supermarketIds.Select(sid =>
            new GroceryItemSupermarket { GroceryItemId = itemId, SupermarketId = sid }));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool? onList, [FromQuery] int? supermarketId)
    {
        var query = db.GroceryItems.Where(i => i.UserId == CurrentUserId);
        if (onList == true) query = query.Where(i => i.IsOnList);
        if (supermarketId.HasValue)
            query = query.Where(i => db.GroceryItemSupermarkets
                .Any(x => x.GroceryItemId == i.Id && x.SupermarketId == supermarketId.Value));
        var items = await query.OrderBy(i => i.Name).ToListAsync();
        await PopulateSupermarketIds(items);
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await db.GroceryItems.FirstOrDefaultAsync(i => i.Id == id && i.UserId == CurrentUserId);
        if (item is null) return NotFound();
        await PopulateSupermarketIds([item]);
        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(GroceryItem item)
    {
        item.UserId = CurrentUserId;
        var supermarketIds = item.SupermarketIds;
        db.GroceryItems.Add(item);
        await db.SaveChangesAsync();
        await SyncSupermarkets(item.Id, supermarketIds);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, GroceryItem item)
    {
        if (id != item.Id) return BadRequest();
        var existing = await db.GroceryItems.FirstOrDefaultAsync(i => i.Id == id && i.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Name = item.Name;
        existing.Barcode = item.Barcode;
        existing.Manufacturer = item.Manufacturer;
        existing.GroceryCategoryId = item.GroceryCategoryId;
        existing.UnitType = item.UnitType;
        existing.IsOnList = item.IsOnList;
        await SyncSupermarkets(id, item.SupermarketIds);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await db.GroceryItems.FirstOrDefaultAsync(i => i.Id == id && i.UserId == CurrentUserId);
        if (item is null) return NotFound();
        db.GroceryItems.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/toggle-list")]
    public async Task<IActionResult> ToggleList(int id)
    {
        var item = await db.GroceryItems.FirstOrDefaultAsync(i => i.Id == id && i.UserId == CurrentUserId);
        if (item is null) return NotFound();
        item.IsOnList = !item.IsOnList;
        await db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpPost("{id}/purchase")]
    public async Task<IActionResult> Purchase(int id, [FromBody] PurchaseRequest req)
    {
        var item = await db.GroceryItems.FirstOrDefaultAsync(i => i.Id == id && i.UserId == CurrentUserId);
        if (item is null) return NotFound();
        var supermarket = await db.Supermarkets.FirstOrDefaultAsync(s => s.Id == req.SupermarketId && s.UserId == CurrentUserId);
        if (supermarket is null) return BadRequest("Invalid supermarket.");

        var purchase = new GroceryPurchase
        {
            GroceryItemId = id,
            SupermarketId = req.SupermarketId,
            PurchasedAt = DateTime.UtcNow,
            Price = req.Price,
            Quantity = req.Quantity,
            UserId = CurrentUserId,
        };
        db.GroceryPurchases.Add(purchase);

        item.LastPrice = req.Price;
        item.LastQuantity = req.Quantity;
        item.LastSupermarketId = req.SupermarketId;
        item.IsOnList = false;

        await db.SaveChangesAsync();
        return Ok(purchase);
    }

    [HttpGet("{id}/purchases")]
    public async Task<IActionResult> GetItemPurchases(int id)
    {
        if (!await db.GroceryItems.AnyAsync(i => i.Id == id && i.UserId == CurrentUserId)) return NotFound();
        return Ok(await db.GroceryPurchases
            .Where(p => p.GroceryItemId == id)
            .OrderByDescending(p => p.PurchasedAt)
            .ToListAsync());
    }

    [HttpGet("purchases")]
    public async Task<IActionResult> GetAllPurchases() =>
        Ok(await db.GroceryPurchases
            .Where(p => p.UserId == CurrentUserId)
            .OrderByDescending(p => p.PurchasedAt)
            .ToListAsync());
}

public record PurchaseRequest(int SupermarketId, decimal Price, decimal Quantity);
