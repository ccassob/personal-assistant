namespace PersonalAssistant.Api.Models;

public class CreditCard
{
    public int Id { get; set; }
    public string UserId { get; set; } = "";
    public string Name { get; set; } = "";
    public string LastFourDigits { get; set; } = "";
    public string Color { get; set; } = "#343a40";
    public string Notes { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}
