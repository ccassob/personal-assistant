using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Route("api/app-settings")]
public class AppSettingsController(BudgetDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var settings = await db.AppSettings.FirstOrDefaultAsync();
        if (settings is null)
        {
            settings = new AppSettings { CutoffDay = 1 };
            db.AppSettings.Add(settings);
            await db.SaveChangesAsync();
        }
        else
        {
            if (string.IsNullOrEmpty(settings.PastColor)) settings.PastColor = "#6c757d";
            if (string.IsNullOrEmpty(settings.TodayColor)) settings.TodayColor = "#0d6efd";
            if (string.IsNullOrEmpty(settings.FutureColor)) settings.FutureColor = "#fd7e14";
        }
        return Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> Update(AppSettings incoming)
    {
        var settings = await db.AppSettings.FirstOrDefaultAsync();
        if (settings is null)
        {
            settings = new AppSettings { Id = 1, CutoffDay = incoming.CutoffDay };
            db.AppSettings.Add(settings);
        }
        else
        {
            settings.CutoffDay = Math.Clamp(incoming.CutoffDay, 1, 31);
            settings.PastColor = incoming.PastColor ?? "#6c757d";
            settings.TodayColor = incoming.TodayColor ?? "#0d6efd";
            settings.FutureColor = incoming.FutureColor ?? "#fd7e14";
            db.AppSettings.Update(settings);
        }
        await db.SaveChangesAsync();
        return Ok(settings);
    }
}
