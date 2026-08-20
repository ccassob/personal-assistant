using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using PersonalAssistant.Api.Models;
using PersonalAssistant.Api.Options;

namespace PersonalAssistant.Api.Services;

// Structures the raw OCR text into transactions + category classification via Claude's
// Messages API. No official Anthropic .NET SDK exists, so this talks to the REST API
// directly over HttpClient (same pattern as TextToSpeechService in this project).
public class AnthropicClassificationService(IHttpClientFactory httpClientFactory, IOptions<AnthropicOptions> options)
{
    private const string Endpoint = "https://api.anthropic.com/v1/messages";
    private const string AnthropicVersion = "2023-06-01";

    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    private readonly AnthropicOptions _opts = options.Value;

    public async Task<List<ExtractedTransaction>> ClassifyAsync(
        string extractedText, IReadOnlyList<CategoryRef> categories, CancellationToken ct = default)
    {
        var http = httpClientFactory.CreateClient();

        var requestBody = new
        {
            model = _opts.Model,
            max_tokens = 8192,
            tools = new object[]
            {
                new
                {
                    name = "record_transactions",
                    description = "Record the structured transactions extracted from the credit card statement.",
                    input_schema = BuildToolSchema()
                }
            },
            tool_choice = new { type = "tool", name = "record_transactions" },
            messages = new object[]
            {
                new { role = "user", content = BuildPrompt(extractedText, categories) }
            }
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, Endpoint)
        {
            Content = new StringContent(JsonSerializer.Serialize(requestBody, JsonOpts), Encoding.UTF8, "application/json")
        };
        request.Headers.Add("x-api-key", _opts.ApiKey);
        request.Headers.Add("anthropic-version", AnthropicVersion);

        using var response = await http.SendAsync(request, ct);
        var responseBody = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException(
                $"Anthropic API failed ({(int)response.StatusCode} {response.ReasonPhrase}): {responseBody}");

        return ParseTransactions(responseBody);
    }

    private static List<ExtractedTransaction> ParseTransactions(string responseBody)
    {
        using var doc = JsonDocument.Parse(responseBody);

        if (!doc.RootElement.TryGetProperty("content", out var contentArray))
            throw new StatementProcessingBusinessException("Respuesta de Claude sin contenido utilizable.");

        foreach (var block in contentArray.EnumerateArray())
        {
            if (block.TryGetProperty("type", out var typeProp) && typeProp.GetString() == "tool_use" &&
                block.TryGetProperty("name", out var nameProp) && nameProp.GetString() == "record_transactions")
            {
                var input = block.GetProperty("input");
                if (!input.TryGetProperty("transactions", out var txArray))
                    throw new StatementProcessingBusinessException("Claude no devolvió transacciones estructuradas para este statement.");

                var raw = txArray.Deserialize<List<RawTransaction>>(JsonOpts) ?? [];
                var mapped = new List<ExtractedTransaction>();
                foreach (var t in raw)
                {
                    if (!DateOnly.TryParse(t.Date, out var date))
                        throw new StatementProcessingBusinessException($"Claude devolvió una fecha inválida: '{t.Date}'.");

                    mapped.Add(new ExtractedTransaction(
                        date, t.Description ?? "", t.Amount,
                        t.Type is "Expense" or "Credit" ? t.Type : "Expense",
                        t.CreditCardCategoryId, t.Notes));
                }
                return mapped;
            }
        }

        throw new StatementProcessingBusinessException("Claude no encontró transacciones en este statement.");
    }

    private static object BuildToolSchema() => new
    {
        type = "object",
        properties = new
        {
            transactions = new
            {
                type = "array",
                items = new
                {
                    type = "object",
                    properties = new
                    {
                        date = new { type = "string", description = "ISO 8601 date (YYYY-MM-DD)" },
                        description = new { type = "string" },
                        amount = new { type = "number", description = "Always positive" },
                        type = new { type = "string", @enum = new[] { "Expense", "Credit" } },
                        creditCardCategoryId = new { type = new[] { "integer", "null" }, description = "Id from the provided category list, or null if not confident" },
                        notes = new { type = new[] { "string", "null" } }
                    },
                    required = new[] { "date", "description", "amount", "type" }
                }
            }
        },
        required = new[] { "transactions" }
    };

    private static string BuildPrompt(string extractedText, IReadOnlyList<CategoryRef> categories)
    {
        var categoriesJson = JsonSerializer.Serialize(categories, JsonOpts);
        return $"""
            You are extracting transactions from OCR text of a credit card statement PDF.

            Extract every individual transaction line item (purchases, payments, credits, fees).
            Ignore headers, footers, page numbers, marketing text, and summary/total lines that
            are not individual transactions.

            For each transaction:
            - date: the transaction date as YYYY-MM-DD (infer the year from statement context if not printed per-line)
            - description: the merchant/description text as printed
            - amount: always a positive number
            - type: "Expense" for purchases/charges/fees, "Credit" for payments/refunds/credits
            - creditCardCategoryId: pick the best matching id from this category list based on the
              description, or null if you are not confident: {categoriesJson}
            - notes: null unless something about the line needs a short clarifying note

            Call the record_transactions tool with the result. Do not include any transaction you
            are not reasonably confident is real.

            OCR text:
            ---
            {extractedText}
            ---
            """;
    }

    private record RawTransaction(
        string Date, string? Description, decimal Amount, string Type,
        int? CreditCardCategoryId, string? Notes);
}
