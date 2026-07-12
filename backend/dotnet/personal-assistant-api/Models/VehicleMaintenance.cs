namespace personal_assistant_api.Models;

public class VehicleMaintenance
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public DateOnly Date { get; set; }
    public int Mileage { get; set; }
    public string Type { get; set; } = "";
    public decimal Price { get; set; }
    public string Notes { get; set; } = "";
    public DateOnly? NextDate { get; set; }
    public int? NextMileage { get; set; }
}
