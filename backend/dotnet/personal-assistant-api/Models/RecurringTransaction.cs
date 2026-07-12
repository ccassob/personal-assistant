namespace personal_assistant_api.Models;

public class RecurringTransaction
{
    public int Id { get; set; }
    public string Description { get; set; } = "";
    public decimal Amount { get; set; }
    public string Type { get; set; } = ""; // "Income" | "Expense"
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public int DayOfMonth { get; set; } // 1–31, clamped to last day of target month on generate
    public string Notes { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public string UserId { get; set; } = "";
}
