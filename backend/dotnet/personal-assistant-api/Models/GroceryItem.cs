using System.ComponentModel.DataAnnotations.Schema;

namespace personal_assistant_api.Models;

public class GroceryItem
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Barcode { get; set; }
    public string? Manufacturer { get; set; }
    public int? GroceryCategoryId { get; set; }
    public string UnitType { get; set; } = "Units"; // "Units" | "Lbs"
    public bool IsOnList { get; set; }
    public decimal? LastPrice { get; set; }
    public decimal? LastQuantity { get; set; }
    public int? LastSupermarketId { get; set; }
    public string UserId { get; set; } = "";

    [NotMapped]
    public List<int> SupermarketIds { get; set; } = [];
}
