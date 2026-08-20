using System.Text;
using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.Extensions.Options;
using PersonalAssistant.Api.Options;

namespace PersonalAssistant.Api.Services;

// Thin wrapper over Azure Document Intelligence: extracts raw text/tables from a PDF and nothing
// else. Statement layouts vary too much across banks to structure them here — that's Claude's
// job in AnthropicClassificationService.
public class DocumentIntelligenceService(IOptions<DocumentIntelligenceOptions> options)
{
    private readonly DocumentIntelligenceOptions _opts = options.Value;

    public async Task<string> ExtractTextAsync(byte[] pdfBytes, CancellationToken ct = default)
    {
        var client = new DocumentIntelligenceClient(new Uri(_opts.Endpoint), new AzureKeyCredential(_opts.ApiKey));

        Operation<AnalyzeResult> operation = await client.AnalyzeDocumentAsync(
            WaitUntil.Completed, "prebuilt-layout", BinaryData.FromBytes(pdfBytes), cancellationToken: ct);

        var result = operation.Value;
        var sb = new StringBuilder();

        foreach (var page in result.Pages)
        {
            foreach (var line in page.Lines)
                sb.AppendLine(line.Content);
        }

        foreach (var table in result.Tables)
        {
            sb.AppendLine();
            sb.AppendLine($"[Table {table.RowCount}x{table.ColumnCount}]");
            foreach (var cell in table.Cells)
                sb.AppendLine($"({cell.RowIndex},{cell.ColumnIndex}): {cell.Content}");
        }

        return sb.ToString();
    }
}
