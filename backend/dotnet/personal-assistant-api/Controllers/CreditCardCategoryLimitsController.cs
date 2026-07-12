using System.Security.Claims;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Route("api/credit-card-category-limits")]
[Authorize]
public class CreditCardCategoryLimitsController(PersonalAssistantDbContext ctx) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("year-summary")]
    public async Task<IActionResult> GetYearSummary([FromQuery] int year)
    {
        var categories = await ctx.CreditCardCategories
            .Where(c => c.UserId == CurrentUserId)
            .ToListAsync();

        var limits = await ctx.CreditCardCategoryLimits
            .Where(l => l.UserId == CurrentUserId && l.Year == year)
            .ToListAsync();

        var txs = await ctx.CreditCardTransactions
            .Where(t => t.UserId == CurrentUserId &&
                        t.Date.Year == year &&
                        t.Type == "Expense" &&
                        t.CreditCardCategoryId != null)
            .ToListAsync();

        var limitMap = limits.ToDictionary(l => (l.CreditCardCategoryId, l.Month), l => l.Amount);
        var spendMap = txs
            .GroupBy(t => (t.CreditCardCategoryId!.Value, t.Date.Month))
            .ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));

        var result = categories.SelectMany(cat =>
            Enumerable.Range(1, 12).Select(month => new
            {
                CreditCardCategoryId = cat.Id,
                CreditCardCategoryName = cat.Name,
                Month = month,
                Year = year,
                Amount = limitMap.TryGetValue((cat.Id, month), out var amt) ? amt : 0m,
                ActualSpent = spendMap.TryGetValue((cat.Id, month), out var sp) ? sp : 0m
            })
        );

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? month, [FromQuery] int? year)
    {
        var query = ctx.CreditCardCategoryLimits
            .Include(l => l.CreditCardCategory)
            .Where(l => l.UserId == CurrentUserId);
        if (month.HasValue) query = query.Where(l => l.Month == month);
        if (year.HasValue) query = query.Where(l => l.Year == year);
        return Ok(await query.ToListAsync());
    }

    [HttpPost("upsert")]
    public async Task<IActionResult> Upsert([FromBody] UpsertCcLimitRequest req)
    {
        var existing = await ctx.CreditCardCategoryLimits.FirstOrDefaultAsync(l =>
            l.UserId == CurrentUserId &&
            l.CreditCardCategoryId == req.CreditCardCategoryId &&
            l.Month == req.Month &&
            l.Year == req.Year);

        if (existing is not null)
        {
            existing.Amount = req.Amount;
            await ctx.SaveChangesAsync();
            return Ok(existing);
        }

        var limit = new CreditCardCategoryLimit
        {
            CreditCardCategoryId = req.CreditCardCategoryId,
            Month = req.Month,
            Year = req.Year,
            Amount = req.Amount,
            UserId = CurrentUserId
        };
        ctx.CreditCardCategoryLimits.Add(limit);
        await ctx.SaveChangesAsync();
        return Ok(limit);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var limit = await ctx.CreditCardCategoryLimits.FirstOrDefaultAsync(l => l.Id == id && l.UserId == CurrentUserId);
        if (limit is null) return NotFound();
        ctx.CreditCardCategoryLimits.Remove(limit);
        await ctx.SaveChangesAsync();
        return NoContent();
    }
}

public record UpsertCcLimitRequest(int CreditCardCategoryId, int Month, int Year, decimal Amount);
