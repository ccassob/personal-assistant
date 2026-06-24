namespace budget_api.Models;

public class CreditCardCategoryLimit
{
    public int Id { get; set; }
    public int CreditCardCategoryId { get; set; }
    public CreditCardCategory? CreditCardCategory { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal Amount { get; set; }
    public string UserId { get; set; } = "";
}
