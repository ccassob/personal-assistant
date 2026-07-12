namespace personal_assistant_api.Models;

public class GroceryCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Color { get; set; } = "primary";
    public string UserId { get; set; } = "";
}
