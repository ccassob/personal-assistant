namespace PersonalAssistant.Api.Models;

public record CategoryRef(int Id, string Name);

public record ExtractedTransaction(
    DateOnly Date, string Description, decimal Amount, string Type,
    int? CreditCardCategoryId, string? Notes);

public class StatementProcessingBusinessException(string message) : Exception(message);
