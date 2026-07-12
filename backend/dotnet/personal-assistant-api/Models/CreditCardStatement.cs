namespace personal_assistant_api.Models;

public class CreditCardStatement
{
    public int Id { get; set; }
    public int CreditCardId { get; set; }
    public string UserId { get; set; } = "";
    public string FileName { get; set; } = "";
    public string BlobName { get; set; } = "";
    public string Status { get; set; } = "Pending";
    public string ErrorMessage { get; set; } = "";
    public DateTime UploadedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public int? StatementMonth { get; set; }
    public int? StatementYear { get; set; }
    public decimal? TotalAmount { get; set; }
}
