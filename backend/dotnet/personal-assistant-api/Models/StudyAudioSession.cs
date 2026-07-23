namespace personal_assistant_api.Models;

public class StudyAudioSession
{
    public int Id { get; set; }
    public int TechnologyId { get; set; }
    public int TheorySectionId { get; set; }
    public int SessionNumber { get; set; }
    public string Title { get; set; } = "";
    public string Album { get; set; } = "";
    public string Status { get; set; } = "Ready";
    public string BlobName { get; set; } = "";
    public int? DurationSeconds { get; set; }
    public string Ssml { get; set; } = "";
    public DateTime GeneratedAt { get; set; }
    public string UserId { get; set; } = "";
}
