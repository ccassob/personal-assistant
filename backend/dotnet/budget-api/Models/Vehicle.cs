namespace budget_api.Models;

public class Vehicle
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Make { get; set; } = "";
    public string Model { get; set; } = "";
    public int Year { get; set; }
    public int CurrentMileage { get; set; }
    public string LicensePlate { get; set; } = "";
    public string Color { get; set; } = "";
    public string Notes { get; set; } = "";
}
