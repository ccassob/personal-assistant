namespace personal_assistant_api.Models;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Author { get; set; } = "";
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
    public DateOnly StartDate { get; set; }
    public string Status { get; set; } = "Reading"; // "Reading" | "Paused" | "Wishlist" | "Completed"
    public DateOnly? TargetDate { get; set; }
    public string Notes { get; set; } = "";
    public string BookType { get; set; } = "Literature"; // "Technology" | "Literature"
    public DateOnly LastUpdated { get; set; }
    public string UserId { get; set; } = "";
}
