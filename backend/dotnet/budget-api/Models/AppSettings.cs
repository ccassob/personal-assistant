namespace budget_api.Models;

public class AppSettings
{
    public int Id { get; set; }
    public int CutoffDay { get; set; } = 1;
    public string PastColor { get; set; } = "#6c757d";
    public string TodayColor { get; set; } = "#0d6efd";
    public string FutureColor { get; set; } = "#fd7e14";
    public string DistanceUnit { get; set; } = "km"; // "km" | "mi"
}
