namespace personal_assistant_api.Models;

public class TechnologyTheoryQuestion
{
    public int Id { get; set; }
    public int SectionId { get; set; }
    public string Question { get; set; } = "";
    public string Subcategory { get; set; } = "";
    public int Points { get; set; }
    public int Order { get; set; }
    public bool IsMastered { get; set; } = false;
    public DateOnly? AnsweredAt { get; set; }
    public string Notes { get; set; } = "";
}
