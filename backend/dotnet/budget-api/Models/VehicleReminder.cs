namespace budget_api.Models;

public class VehicleReminder
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public string Type { get; set; } = "";
    public string Title { get; set; } = "";
    public bool IsDone { get; set; } = false;
}
