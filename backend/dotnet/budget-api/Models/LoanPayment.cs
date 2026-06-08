namespace budget_api.Models;

public class LoanPayment
{
    public int Id { get; set; }
    public int LoanId { get; set; }
    public Loan? Loan { get; set; }
    public DateOnly Date { get; set; }
    public decimal PrincipalAmount { get; set; }
    public decimal InterestAmount { get; set; }
    public decimal InsuranceAmount { get; set; }
    public decimal AdditionalPrincipal { get; set; }
    public string UserId { get; set; } = "";
}
