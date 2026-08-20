using Azure;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Api.Services;

// The only interface in the Document AI pipeline — exists solely so CreditCardsController tests
// can substitute a fake instead of calling real Document Intelligence/Claude (see
// CreditCardsControllerTests). DocumentIntelligenceService/AnthropicClassificationService
// themselves stay interface-free per the repo's "utility service" convention.
public interface IStatementExtractionPipeline
{
    Task<List<ExtractedTransaction>> ProcessAsync(
        byte[] pdfBytes, IReadOnlyList<CategoryRef> categories, CancellationToken ct = default);
}

public class StatementExtractionPipeline(
    DocumentIntelligenceService documentIntelligenceService,
    AnthropicClassificationService classificationService) : IStatementExtractionPipeline
{
    public async Task<List<ExtractedTransaction>> ProcessAsync(
        byte[] pdfBytes, IReadOnlyList<CategoryRef> categories, CancellationToken ct = default)
    {
        string extractedText;
        try
        {
            extractedText = await documentIntelligenceService.ExtractTextAsync(pdfBytes, ct);
        }
        catch (RequestFailedException ex) when (ex.Status is 400 or 415 or 422)
        {
            throw new StatementProcessingBusinessException(
                "No se pudo leer el PDF como un statement válido (formato no reconocido por Document Intelligence).");
        }

        if (string.IsNullOrWhiteSpace(extractedText))
            throw new StatementProcessingBusinessException("No se pudo extraer texto del PDF. ¿Es un statement válido?");

        var transactions = await classificationService.ClassifyAsync(extractedText, categories, ct);
        if (transactions.Count == 0)
            throw new StatementProcessingBusinessException("No se encontraron transacciones en el statement.");

        return transactions;
    }
}
