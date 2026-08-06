namespace PersonalAssistant.Api.Models;

public class VehicleTodo
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public string Title { get; set; } = "";
    public bool IsDone { get; set; } = false;
}
