using PersonalAssistant.Api.Controllers;

namespace PersonalAssistant.Api.Models;

public class TechnologyCompletionHistory
{
    public int Id { get; set; }
    public int TechnologyId { get; set; }
    public TopicType ItemType { get; set; }
    public int ItemId { get; set; }
    public string SectionTitle { get; set; } = "";
    public string ItemTitle { get; set; } = "";
    public int Points { get; set; }
    public DateOnly CompletedDate { get; set; }
}
