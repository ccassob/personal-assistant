namespace budget_api.Models;

public class VehicleFuel
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public DateOnly Date { get; set; }
    public decimal PricePerGallon { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal Gallons { get; set; }
}
