namespace budget_api.Models;

public class BookProgress
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public DateOnly Date { get; set; }
    public int CurrentPage { get; set; }
}
