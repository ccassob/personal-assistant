using System.Security.Claims;
using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Authorize]
[Route("api/app-settings")]
public class AppSettingsController(BudgetDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var settings = await db.AppSettings.FirstOrDefaultAsync(s => s.UserId == CurrentUserId);
        if (settings is null)
        {
            settings = new AppSettings { CutoffDay = 1, UserId = CurrentUserId };
            db.AppSettings.Add(settings);
            await db.SaveChangesAsync();
        }
        else
        {
            if (string.IsNullOrEmpty(settings.PastColor)) settings.PastColor = "#6c757d";
            if (string.IsNullOrEmpty(settings.TodayColor)) settings.TodayColor = "#0d6efd";
            if (string.IsNullOrEmpty(settings.FutureColor)) settings.FutureColor = "#fd7e14";
            if (string.IsNullOrEmpty(settings.DistanceUnit)) settings.DistanceUnit = "km";
        }
        return Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> Update(AppSettings incoming)
    {
        var settings = await db.AppSettings.FirstOrDefaultAsync(s => s.UserId == CurrentUserId);
        if (settings is null)
        {
            settings = new AppSettings { UserId = CurrentUserId };
            db.AppSettings.Add(settings);
        }
        settings.CutoffDay = Math.Clamp(incoming.CutoffDay, 1, 31);
        settings.PastColor = incoming.PastColor ?? "#6c757d";
        settings.TodayColor = incoming.TodayColor ?? "#0d6efd";
        settings.FutureColor = incoming.FutureColor ?? "#fd7e14";
        settings.DistanceUnit = incoming.DistanceUnit is "km" or "mi" ? incoming.DistanceUnit : "km";
        await db.SaveChangesAsync();
        return Ok(settings);
    }
}
