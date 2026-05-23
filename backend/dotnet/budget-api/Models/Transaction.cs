namespace budget_api.Models;

public class Transaction
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = "";
    public string Type { get; set; } = ""; // "Income" | "Expense"
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public string Notes { get; set; } = "";
    public bool IsExecuted { get; set; }
}
