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
public class AccountsController(PersonalAssistantDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Accounts.Where(a => a.UserId == CurrentUserId).OrderBy(a => a.Name).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var account = await db.Accounts.FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);

        return account is null ? NotFound() : Ok(account);
    }

    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(int id)
    {
        if (!await db.Accounts.AnyAsync(a => a.Id == id && a.UserId == CurrentUserId)) return NotFound();

        var since = DateOnly.FromDateTime(DateTime.Today.AddMonths(-6));

        var history = await db.AccountHistories.AsNoTracking()
            .Where(h => h.AccountId == id && h.Date >= since)
            .OrderBy(h => h.Date)
            .Select(h => new { h.Date, h.Amount })
            .ToListAsync();

        return Ok(history);
    }

    [HttpGet("history/total")]
    public async Task<IActionResult> GetTotalHistory()
    {
        var userAccountIds = await db.Accounts.AsNoTracking()
            .Where(a => a.UserId == CurrentUserId)
            .Select(a => a.Id)
            .ToListAsync();

        var since = DateOnly.FromDateTime(DateTime.Today.AddMonths(-6));
        var result = await db.AccountHistories
            .Where(h => userAccountIds.Contains(h.AccountId) && h.Date >= since)
            .GroupBy(h => h.Date)
            .Select(g => new { Date = g.Key, TotalAmount = g.Sum(h => h.Amount) })
            .OrderBy(x => x.Date)
            .ToListAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Account account)
    {
        account.UserId = CurrentUserId;
        account.LastModified = DateOnly.FromDateTime(DateTime.Today);
        db.Accounts.Add(account);
        await db.SaveChangesAsync();
        await UpsertHistory(account.Id, account.Amount, account.LastModified);
        return CreatedAtAction(nameof(GetById), new { id = account.Id }, account);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Account account)
    {
        if (id != account.Id) return BadRequest();
        var existing = await db.Accounts.FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Name = account.Name;
        existing.Amount = account.Amount;
        existing.AccountType = account.AccountType;
        existing.LastModified = DateOnly.FromDateTime(DateTime.Today);
        await db.SaveChangesAsync();
        await UpsertHistory(existing.Id, existing.Amount, existing.LastModified);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var account = await db.Accounts.FirstOrDefaultAsync(a => a.Id == id && a.UserId == CurrentUserId);
        if (account is null) return NotFound();
        db.Accounts.Remove(account);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task UpsertHistory(int accountId, decimal amount, DateOnly date)
    {
        var existing = await db.AccountHistories
            .FirstOrDefaultAsync(h => h.AccountId == accountId && h.Date == date);
        if (existing is null)
            db.AccountHistories.Add(new AccountHistory { AccountId = accountId, Date = date, Amount = amount });
        else
            existing.Amount = amount;
        await db.SaveChangesAsync();
    }
}
