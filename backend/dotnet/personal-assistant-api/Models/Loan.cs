namespace personal_assistant_api.Models;

public class Loan
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal LoanAmount { get; set; }
    public DateOnly StartDate { get; set; }
    public decimal InterestRate { get; set; }
    public decimal MonthlyPayment { get; set; }
    public int TermMonths { get; set; }
    public decimal InsuranceAmount { get; set; }
    public decimal CurrentBalance { get; set; }
    public decimal? GoalAmount { get; set; }
    public DateOnly? GoalDate { get; set; }
    public string UserId { get; set; } = "";
}
