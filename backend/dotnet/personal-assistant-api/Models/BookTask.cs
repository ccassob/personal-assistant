namespace personal_assistant_api.Models;

public class BookTask
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public string Title { get; set; } = "";
    public bool IsDone { get; set; } = false;
}
