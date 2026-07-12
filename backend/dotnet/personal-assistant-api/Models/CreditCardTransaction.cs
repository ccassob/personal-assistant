namespace personal_assistant_api.Models;

public class CreditCardTransaction
{
    public int Id { get; set; }
    public int StatementId { get; set; }
    public int CreditCardId { get; set; }
    public string UserId { get; set; } = "";
    public DateOnly Date { get; set; }
    public string Description { get; set; } = "";
    public decimal Amount { get; set; }
    public string Type { get; set; } = "Expense";
    public int? CreditCardCategoryId { get; set; }
    public CreditCardCategory? CreditCardCategory { get; set; }
    public string Notes { get; set; } = "";
    public bool IsAiClassified { get; set; }
    public DateTime CreatedAt { get; set; }
}
