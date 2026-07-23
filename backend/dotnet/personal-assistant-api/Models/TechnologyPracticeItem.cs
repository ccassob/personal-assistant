namespace personal_assistant_api.Models;

public class TechnologyPracticeItem
{
    public int Id { get; set; }
    public int SectionId { get; set; }
    public string Title { get; set; } = "";
    public string Subcategory { get; set; } = "";
    public int Points { get; set; }
    public int Order { get; set; }
    public bool IsDone { get; set; } = false;
    public DateOnly? CompletedAt { get; set; }
    public string Notes { get; set; } = "";
}
