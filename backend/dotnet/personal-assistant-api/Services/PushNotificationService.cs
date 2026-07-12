using System.Net;
using System.Text.Json;
using personal_assistant_api.Data;
using personal_assistant_api.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using WebPush;

namespace personal_assistant_api.Services;

public class PushNotificationService(PersonalAssistantDbContext db, IOptions<NotificationOptions> opts)
{
    public async Task SendToUserAsync(string userId, string title, string body, string url = "/")
    {
        var subs = await db.PushSubscriptions.Where(s => s.UserId == userId).ToListAsync();
        var toRemove = new List<Models.PushSubscription>();

        var payload = JsonSerializer.Serialize(new
        {
            notification = new
            {
                title,
                body,
                icon = "/icons/icon-192x192.png",
                data = new { url }
            }
        });

        var vapid = new VapidDetails(
            opts.Value.VapidSubject,
            opts.Value.VapidPublicKey,
            opts.Value.VapidPrivateKey);

        foreach (var sub in subs)
        {
            var pushSub = new WebPush.PushSubscription(sub.Endpoint, sub.P256dh, sub.Auth);
            try
            {
                var client = new WebPushClient();
                await client.SendNotificationAsync(pushSub, payload, vapid);
            }
            catch (WebPushException ex) when (ex.StatusCode == HttpStatusCode.Gone)
            {
                toRemove.Add(sub);
            }
            catch
            {
                // Ignore transient errors — don't remove valid subscription
            }
        }

        if (toRemove.Count > 0)
        {
            db.PushSubscriptions.RemoveRange(toRemove);
            await db.SaveChangesAsync();
        }
    }
}
