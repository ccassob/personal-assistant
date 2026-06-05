namespace budget_api.Models;

public class Account
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Amount { get; set; }
    public DateOnly LastModified { get; set; }
    public string AccountType { get; set; } = "Regular"; // "Regular" | "Investment"
    public string UserId { get; set; } = "";
}
