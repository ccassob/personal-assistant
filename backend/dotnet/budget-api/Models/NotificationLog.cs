namespace budget_api.Models;

public class NotificationLog
{
    public int Id { get; set; }
    public string UserId { get; set; } = "";
    public string Type { get; set; } = "";      // "expired-transaction" | "maintenance-due"
    public string EntityId { get; set; } = "";  // transactionId or reminderId as string
    public DateOnly SentDate { get; set; }
}
