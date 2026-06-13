using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using budget_api.Data;
using budget_api.Models;
using budget_api.Options;
using budget_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace budget_api.Controllers;

[ApiController]
[Route("api/credit-cards")]
[Authorize]
public class CreditCardsController(
    BudgetDbContext ctx,
    BlobStorageService blobService,
    IHttpClientFactory httpClientFactory,
    IOptions<CreditCardOptions> creditCardOptions) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    private readonly CreditCardOptions _opts = creditCardOptions.Value;

    // ── Cards ─────────────────────────────────────────────────────────────

    [HttpGet]
    public async Task<IActionResult> GetCards() =>
        Ok(await ctx.CreditCards
            .Where(c => c.UserId == CurrentUserId)
            .OrderBy(c => c.Name)
            .ToListAsync());

    [HttpPost]
    public async Task<IActionResult> CreateCard([FromBody] CreditCard card)
    {
        card.Id = 0;
        card.UserId = CurrentUserId;
        card.CreatedAt = DateTime.UtcNow;
        ctx.CreditCards.Add(card);
        await ctx.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCards), new { id = card.Id }, card);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCard(int id, [FromBody] CreditCard card)
    {
        var existing = await ctx.CreditCards.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Name = card.Name;
        existing.LastFourDigits = card.LastFourDigits;
        existing.Color = card.Color;
        existing.Notes = card.Notes;
        await ctx.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCard(int id)
    {
        var card = await ctx.CreditCards.FirstOrDefaultAsync(c => c.Id == id && c.UserId == CurrentUserId);
        if (card is null) return NotFound();
        ctx.CreditCards.Remove(card);
        await ctx.SaveChangesAsync();
        return NoContent();
    }

    // ── Statements ────────────────────────────────────────────────────────

    [HttpGet("{cardId}/statements")]
    public async Task<IActionResult> GetStatements(int cardId)
    {
        var card = await ctx.CreditCards.FirstOrDefaultAsync(c => c.Id == cardId && c.UserId == CurrentUserId);
        if (card is null) return NotFound();

        var statements = await ctx.CreditCardStatements
            .Where(s => s.CreditCardId == cardId && s.UserId == CurrentUserId)
            .OrderByDescending(s => s.UploadedAt)
            .Select(s => new
            {
                s.Id, s.CreditCardId, s.FileName, s.Status, s.ErrorMessage,
                s.UploadedAt, s.ProcessedAt, s.StatementMonth, s.StatementYear, s.TotalAmount,
                TransactionCount = ctx.CreditCardTransactions.Count(t => t.StatementId == s.Id)
            })
            .ToListAsync();

        return Ok(statements);
    }

    [HttpGet("statements/{id}")]
    public async Task<IActionResult> GetStatement(int id)
    {
        var stmt = await ctx.CreditCardStatements
            .Where(s => s.Id == id && s.UserId == CurrentUserId)
            .Select(s => new
            {
                s.Id, s.CreditCardId, s.FileName, s.Status, s.ErrorMessage,
                s.UploadedAt, s.ProcessedAt, s.StatementMonth, s.StatementYear, s.TotalAmount,
                TransactionCount = ctx.CreditCardTransactions.Count(t => t.StatementId == s.Id)
            })
            .FirstOrDefaultAsync();

        if (stmt is null) return NotFound();
        return Ok(stmt);
    }

    [HttpPost("{cardId}/statements")]
    public async Task<IActionResult> UploadStatement(int cardId, IFormFile file)
    {
        var card = await ctx.CreditCards.FirstOrDefaultAsync(c => c.Id == cardId && c.UserId == CurrentUserId);
        if (card is null) return NotFound();

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext != ".pdf") return BadRequest("Only PDF files are accepted.");

        var blobName = $"statements/{CurrentUserId}/{Guid.NewGuid()}.pdf";
        await blobService.UploadAsync(file.OpenReadStream(), blobName, "application/pdf");

        var stmt = new CreditCardStatement
        {
            CreditCardId = cardId,
            UserId = CurrentUserId,
            FileName = file.FileName,
            BlobName = blobName,
            Status = "Pending",
            UploadedAt = DateTime.UtcNow
        };
        ctx.CreditCardStatements.Add(stmt);
        await ctx.SaveChangesAsync();

        if (!string.IsNullOrEmpty(_opts.LogicAppsUrl))
        {
            var sasUrl = blobService.GenerateSasUrl(blobName, TimeSpan.FromHours(1));
            var categories = await ctx.Categories
                .Where(c => c.UserId == CurrentUserId)
                .Select(c => new { c.Id, c.Name, c.Type })
                .ToListAsync();

            var webhookUrl = $"{Request.Scheme}://{Request.Host}/api/credit-cards/webhook";
            var payload = new
            {
                statementId = stmt.Id,
                sasUrl,
                webhookUrl,
                userId = CurrentUserId,
                categories
            };

            _ = Task.Run(async () =>
            {
                try
                {
                    var client = httpClientFactory.CreateClient();
                    await client.PostAsJsonAsync(_opts.LogicAppsUrl, payload);
                }
                catch { /* fire-and-forget; Logic Apps will post back via webhook */ }
            });
        }

        return Accepted(new { statementId = stmt.Id, status = stmt.Status });
    }

    [HttpDelete("statements/{id}")]
    public async Task<IActionResult> DeleteStatement(int id)
    {
        var stmt = await ctx.CreditCardStatements.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        if (stmt is null) return NotFound();
        ctx.CreditCardStatements.Remove(stmt);
        await ctx.SaveChangesAsync();
        return NoContent();
    }

    // ── Transactions ──────────────────────────────────────────────────────

    [HttpGet("statements/{statementId}/transactions")]
    public async Task<IActionResult> GetTransactions(int statementId)
    {
        var stmt = await ctx.CreditCardStatements.FirstOrDefaultAsync(s => s.Id == statementId && s.UserId == CurrentUserId);
        if (stmt is null) return NotFound();

        var txs = await ctx.CreditCardTransactions
            .Include(t => t.Category)
            .Where(t => t.StatementId == statementId)
            .OrderBy(t => t.Date)
            .ToListAsync();

        return Ok(txs);
    }

    [HttpPut("transactions/{id}")]
    public async Task<IActionResult> UpdateTransaction(int id, [FromBody] UpdateTransactionRequest req)
    {
        var tx = await ctx.CreditCardTransactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        if (tx is null) return NotFound();
        tx.CategoryId = req.CategoryId;
        tx.Notes = req.Notes ?? tx.Notes;
        tx.Type = req.Type ?? tx.Type;
        tx.IsAiClassified = false;
        await ctx.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("transactions/{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var tx = await ctx.CreditCardTransactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        if (tx is null) return NotFound();
        ctx.CreditCardTransactions.Remove(tx);
        await ctx.SaveChangesAsync();
        return NoContent();
    }

    // ── Webhook (called by Logic Apps) ────────────────────────────────────

    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook([FromBody] WebhookPayload payload)
    {
        var secret = Request.Headers["X-Webhook-Secret"].FirstOrDefault() ?? "";
        var expected = _opts.WebhookSecret;

        if (string.IsNullOrEmpty(expected) || !CryptographicEquals(secret, expected))
            return Unauthorized();

        var stmt = await ctx.CreditCardStatements.FirstOrDefaultAsync(s => s.Id == payload.StatementId);
        if (stmt is null) return NotFound();
        if (stmt.UserId != payload.UserId) return Unauthorized();

        // Idempotent: remove any previously inserted transactions
        var existing = ctx.CreditCardTransactions.Where(t => t.StatementId == stmt.Id);
        ctx.CreditCardTransactions.RemoveRange(existing);

        if (payload.Transactions is not null)
        {
            var newTxs = payload.Transactions.Select(t => new CreditCardTransaction
            {
                StatementId = stmt.Id,
                CreditCardId = stmt.CreditCardId,
                UserId = stmt.UserId,
                Date = t.Date,
                Description = t.Description,
                Amount = t.Amount,
                Type = t.Type,
                CategoryId = t.CategoryId,
                Notes = t.Notes ?? "",
                IsAiClassified = true,
                CreatedAt = DateTime.UtcNow
            });
            ctx.CreditCardTransactions.AddRange(newTxs);
        }

        stmt.Status = payload.Status;
        stmt.ErrorMessage = payload.ErrorMessage ?? "";
        stmt.ProcessedAt = DateTime.UtcNow;
        stmt.StatementMonth = payload.StatementMonth;
        stmt.StatementYear = payload.StatementYear;
        stmt.TotalAmount = payload.TotalAmount;

        await ctx.SaveChangesAsync();
        return Ok();
    }

    // ── Dev-only: simulate webhook locally ────────────────────────────────

    [HttpPost("statements/{id}/simulate-webhook")]
    public async Task<IActionResult> SimulateWebhook(int id, [FromBody] WebhookPayload payload)
    {
        var stmt = await ctx.CreditCardStatements.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        if (stmt is null) return NotFound();

        payload.StatementId = id;
        payload.UserId = CurrentUserId;

        // Reuse webhook logic via direct call — override header check with internal userId match
        var existing = ctx.CreditCardTransactions.Where(t => t.StatementId == stmt.Id);
        ctx.CreditCardTransactions.RemoveRange(existing);

        if (payload.Transactions is not null)
        {
            ctx.CreditCardTransactions.AddRange(payload.Transactions.Select(t => new CreditCardTransaction
            {
                StatementId = stmt.Id,
                CreditCardId = stmt.CreditCardId,
                UserId = stmt.UserId,
                Date = t.Date,
                Description = t.Description,
                Amount = t.Amount,
                Type = t.Type,
                CategoryId = t.CategoryId,
                Notes = t.Notes ?? "",
                IsAiClassified = true,
                CreatedAt = DateTime.UtcNow
            }));
        }

        stmt.Status = payload.Status;
        stmt.ErrorMessage = payload.ErrorMessage ?? "";
        stmt.ProcessedAt = DateTime.UtcNow;
        stmt.StatementMonth = payload.StatementMonth;
        stmt.StatementYear = payload.StatementYear;
        stmt.TotalAmount = payload.TotalAmount;

        await ctx.SaveChangesAsync();
        return Ok();
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private static bool CryptographicEquals(string a, string b)
    {
        var aBytes = Encoding.UTF8.GetBytes(a.PadRight(b.Length));
        var bBytes = Encoding.UTF8.GetBytes(b.PadRight(a.Length));
        return CryptographicOperations.FixedTimeEquals(aBytes, bBytes);
    }
}

public record UpdateTransactionRequest(int? CategoryId, string? Notes, string? Type);

public class WebhookPayload
{
    public int StatementId { get; set; }
    public string UserId { get; set; } = "";
    public string Status { get; set; } = "Processed";
    public string? ErrorMessage { get; set; }
    public int? StatementMonth { get; set; }
    public int? StatementYear { get; set; }
    public decimal? TotalAmount { get; set; }
    public List<WebhookTransaction>? Transactions { get; set; }
}

public class WebhookTransaction
{
    public DateOnly Date { get; set; }
    public string Description { get; set; } = "";
    public decimal Amount { get; set; }
    public string Type { get; set; } = "Expense";
    public int? CategoryId { get; set; }
    public string? Notes { get; set; }
}
