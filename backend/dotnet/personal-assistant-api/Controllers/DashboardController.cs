using System.Security.Claims;
using personal_assistant_api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DashboardController(PersonalAssistantDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("trend")]
    public async Task<IActionResult> GetTrend([FromQuery] int months = 6, [FromQuery] int? month = null, [FromQuery] int? year = null)
    {
        var now = DateTime.Now;
        var settings = await db.AppSettings.FirstOrDefaultAsync(s => s.UserId == CurrentUserId);
        var cutoffDay = settings?.CutoffDay ?? 1;

        var m = month ?? now.Month;
        var y = year ?? now.Year;
        if (month == null && now.Day < cutoffDay) { m--; if (m == 0) { m = 12; y--; } }

        var periods = new List<(int month, int year, DateOnly start, DateOnly end)>();
        for (int i = 0; i < months; i++)
        {
            var (s, e) = GetPeriod(cutoffDay, m, y);
            periods.Add((m, y, s, e));
            m--; if (m == 0) { m = 12; y--; }
        }
        periods.Reverse();

        var allStart = periods.First().start;
        var allEnd = periods.Last().end;
        var transactions = await db.Transactions
            .Where(t => t.UserId == CurrentUserId && t.Date >= allStart && t.Date <= allEnd)
            .ToListAsync();

        var result = periods.Select(p => new
        {
            month = p.month,
            year = p.year,
            label = new DateTime(p.year, p.month, 1).ToString("MMM yyyy"),
            income = transactions.Where(t => t.Date >= p.start && t.Date <= p.end && t.Type == "Income").Sum(t => t.Amount),
            expense = transactions.Where(t => t.Date >= p.start && t.Date <= p.end && t.Type == "Expense").Sum(t => t.Amount),
            invested = transactions.Where(t => t.Date >= p.start && t.Date <= p.end && t.Type == "Investment").Sum(t => t.Amount)
        });

        return Ok(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary([FromQuery] int? month, [FromQuery] int? year)
    {
        var now = DateTime.Now;
        var m = month ?? now.Month;
        var y = year ?? now.Year;

        var settings = await db.AppSettings.FirstOrDefaultAsync(s => s.UserId == CurrentUserId);
        var cutoffDay = settings?.CutoffDay ?? 1;
        var (startDate, endDate) = GetPeriod(cutoffDay, m, y);

        var transactions = await db.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == CurrentUserId && t.Date >= startDate && t.Date <= endDate)
            .ToListAsync();

        var totalIncome = transactions.Where(t => t.Type == "Income").Sum(t => t.Amount);
        var totalExpense = transactions.Where(t => t.Type == "Expense").Sum(t => t.Amount);
        var totalInvested = transactions.Where(t => t.Type == "Investment").Sum(t => t.Amount);

        var spendingByCategory = transactions
            .Where(t => t.Type == "Expense")
            .GroupBy(t => t.Category)
            .Select(g => new
            {
                categoryId = g.Key?.Id,
                categoryName = g.Key?.Name,
                color = g.Key?.Color,
                amount = g.Sum(t => t.Amount)
            });

        var budgets = await db.Budgets
            .Include(b => b.Category)
            .Where(b => b.UserId == CurrentUserId && b.Month == m && b.Year == y)
            .ToListAsync();

        var budgetVsActual = budgets.Select(b => new
        {
            categoryId = b.CategoryId,
            categoryName = b.Category?.Name,
            target = b.TargetAmount,
            actual = transactions
                .Where(t => t.CategoryId == b.CategoryId && t.Type == "Expense")
                .Sum(t => t.Amount)
        });

        var goals = await db.Goals.Where(g => g.UserId == CurrentUserId).ToListAsync();

        return Ok(new
        {
            totalIncome,
            totalExpense,
            totalInvested,
            netBalance = totalIncome - totalExpense,
            spendingByCategory,
            budgetVsActual,
            goals = goals.Select(g => new
            {
                g.Id,
                g.Name,
                g.TargetAmount,
                g.CurrentAmount,
                g.Status
            })
        });
    }

    private static (DateOnly start, DateOnly end) GetPeriod(int cutoffDay, int month, int year)
    {
        var day = Math.Min(cutoffDay, DateTime.DaysInMonth(year, month));
        var start = new DateOnly(year, month, day);
        var end = DateOnly.FromDateTime(new DateTime(year, month, day).AddMonths(1).AddDays(-1));
        return (start, end);
    }
}
