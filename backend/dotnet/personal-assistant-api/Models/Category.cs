namespace personal_assistant_api.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Type { get; set; } = ""; // "Income" | "Expense"
    public string Color { get; set; } = "#000000";
    public string Icon { get; set; } = "";
    public string UserId { get; set; } = "";
}
