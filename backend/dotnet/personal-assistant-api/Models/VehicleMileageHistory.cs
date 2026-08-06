namespace PersonalAssistant.Api.Models;

public class VehicleMileageHistory
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public DateOnly Date { get; set; }
    public int Mileage { get; set; }
}
