namespace budget_api.Models;

public class PantryItem
{
    public int Id { get; set; }
    public int? GroceryItemId { get; set; }
    public string Name { get; set; } = "";
    public decimal Quantity { get; set; }
    public string UnitType { get; set; } = "Units";
    public DateOnly PurchasedAt { get; set; }
    public DateOnly? ExpiresAt { get; set; }
    public string? Notes { get; set; }
    public string UserId { get; set; } = "";
}
