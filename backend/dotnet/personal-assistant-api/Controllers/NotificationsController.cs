using System.Security.Claims;
using System.Text.Json;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using personal_assistant_api.Options;
using personal_assistant_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace personal_assistant_api.Controllers;

[ApiController]
[Route("api/notifications")]
public class NotificationsController(
    PersonalAssistantDbContext db,
    PushNotificationService push,
    IOptions<NotificationOptions> opts) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("public-key")]
    public IActionResult GetPublicKey() =>
        Ok(new { publicKey = opts.Value.VapidPublicKey });

    [HttpPost("subscribe")]
    [Authorize]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest req)
    {
        var existing = await db.PushSubscriptions
            .FirstOrDefaultAsync(s => s.Endpoint == req.Endpoint && s.UserId == CurrentUserId);

        if (existing is null)
        {
            db.PushSubscriptions.Add(new PushSubscription
            {
                UserId = CurrentUserId,
                Endpoint = req.Endpoint,
                P256dh = req.P256dh,
                Auth = req.Auth,
                CreatedAt = DateTime.UtcNow
            });
        }
        else
        {
            existing.P256dh = req.P256dh;
            existing.Auth = req.Auth;
            existing.CreatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("subscribe")]
    [Authorize]
    public async Task<IActionResult> Unsubscribe([FromBody] UnsubscribeRequest req)
    {
        var sub = await db.PushSubscriptions
            .FirstOrDefaultAsync(s => s.Endpoint == req.Endpoint && s.UserId == CurrentUserId);

        if (sub is not null)
        {
            db.PushSubscriptions.Remove(sub);
            await db.SaveChangesAsync();
        }

        return NoContent();
    }

    [HttpPost("dispatch")]
    [Authorize]
    public async Task<IActionResult> Dispatch()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var count = 0;

        // 1. Expired transactions — one notification per transaction, sent once ever
        var expiredTxs = await db.Transactions
            .Where(t => t.UserId == CurrentUserId && !t.IsExecuted && t.Date < today)
            .ToListAsync();

        foreach (var tx in expiredTxs)
        {
            var entityId = tx.Id.ToString();
            var alreadySent = await db.NotificationLogs.AnyAsync(l =>
                l.UserId == CurrentUserId &&
                l.Type == "expired-transaction" &&
                l.EntityId == entityId);

            if (alreadySent) continue;

            await push.SendToUserAsync(
                CurrentUserId,
                "Expired Transaction",
                $"{tx.Description} — ${tx.Amount:F2}",
                "/transactions");

            db.NotificationLogs.Add(new NotificationLog
            {
                UserId = CurrentUserId,
                Type = "expired-transaction",
                EntityId = entityId,
                SentDate = today
            });
            count++;
        }

        await db.SaveChangesAsync();

        // 2. Vehicle maintenance due today — sent once per day per reminder
        var vehicleIds = await db.Vehicles
            .Where(v => v.UserId == CurrentUserId)
            .Select(v => v.Id)
            .ToListAsync();

        var dueMaintenances = await db.VehicleMaintenances
            .Where(m => vehicleIds.Contains(m.VehicleId) && m.NextDate == today)
            .ToListAsync();

        foreach (var m in dueMaintenances)
        {
            var reminder = await db.VehicleReminders
                .FirstOrDefaultAsync(r => r.VehicleId == m.VehicleId && r.Type == m.Type && !r.IsDone);

            if (reminder is null) continue;

            var entityId = reminder.Id.ToString();
            var alreadySent = await db.NotificationLogs.AnyAsync(l =>
                l.UserId == CurrentUserId &&
                l.Type == "maintenance-due" &&
                l.EntityId == entityId &&
                l.SentDate == today);

            if (alreadySent) continue;

            await push.SendToUserAsync(
                CurrentUserId,
                "Maintenance Due",
                reminder.Title,
                "/vehicles");

            db.NotificationLogs.Add(new NotificationLog
            {
                UserId = CurrentUserId,
                Type = "maintenance-due",
                EntityId = entityId,
                SentDate = today
            });
            count++;
        }

        await db.SaveChangesAsync();

        return Ok(new { sent = count });
    }
}

public record SubscribeRequest(string Endpoint, string P256dh, string Auth);
public record UnsubscribeRequest(string Endpoint);
