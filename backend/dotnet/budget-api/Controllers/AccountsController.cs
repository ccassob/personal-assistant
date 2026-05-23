using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController(BudgetDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Accounts.OrderBy(a => a.Name).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var account = await db.Accounts.FindAsync(id);
        return account is null ? NotFound() : Ok(account);
    }

    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(int id)
    {
        var since = DateOnly.FromDateTime(DateTime.Today.AddMonths(-6));
        var history = await db.AccountHistories
            .Where(h => h.AccountId == id && h.Date >= since)
            .OrderBy(h => h.Date)
            .Select(h => new { h.Date, h.Amount })
            .ToListAsync();
        return Ok(history);
    }

    [HttpGet("history/total")]
    public async Task<IActionResult> GetTotalHistory()
    {
        var since = DateOnly.FromDateTime(DateTime.Today.AddMonths(-6));
        var result = await db.AccountHistories
            .Where(h => h.Date >= since)
            .GroupBy(h => h.Date)
            .Select(g => new { Date = g.Key, TotalAmount = g.Sum(h => h.Amount) })
            .OrderBy(x => x.Date)
            .ToListAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Account account)
    {
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
        account.LastModified = DateOnly.FromDateTime(DateTime.Today);
        db.Entry(account).State = EntityState.Modified;
        await db.SaveChangesAsync();
        await UpsertHistory(account.Id, account.Amount, account.LastModified);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var account = await db.Accounts.FindAsync(id);
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
