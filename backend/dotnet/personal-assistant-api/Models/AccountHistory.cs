namespace personal_assistant_api.Models;

public class AccountHistory
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public Account Account { get; set; } = null!;
    public DateOnly Date { get; set; }
    public decimal Amount { get; set; }
}
