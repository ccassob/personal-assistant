namespace budget_api.Models;

public class GroceryPurchase
{
    public int Id { get; set; }
    public int GroceryItemId { get; set; }
    public int SupermarketId { get; set; }
    public DateTime PurchasedAt { get; set; }
    public decimal Price { get; set; }
    public decimal Quantity { get; set; }
    public string UserId { get; set; } = "";
}
