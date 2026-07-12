namespace personal_assistant_api.Models;

public class Goal
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public DateOnly Deadline { get; set; }
    public string Status { get; set; } = "Active"; // "Active" | "Completed" | "Paused"
    public string UserId { get; set; } = "";
}
