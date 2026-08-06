namespace PersonalAssistant.Api.Models;

public class CreateCategoryRequest
{
    public string Name { get; set; } = "";
    public string Type { get; set; } = "";
    public string Color { get; set; } = "#000000";
    public string Icon { get; set; } = "";
}
