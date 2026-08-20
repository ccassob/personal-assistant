using System.Security.Claims;
using PersonalAssistant.Api.Data;
using PersonalAssistant.Api.Models;
using PersonalAssistant.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PersonalAssistant.Api.Controllers;

[ApiController]
[Route("api/credit-cards")]
[Authorize]
public class CreditCardsController(
    PersonalAssistantDbContext ctx,
    IBlobStorageService blobService,
    IStatementExtractionPipeline pipeline) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

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

    // ── Spending summary ──────────────────────────────────────────────────

    [HttpGet("spending")]
    public async Task<IActionResult> GetSpending([FromQuery] int month, [FromQuery] int year)
    {
        var spending = await ctx.CreditCardTransactions
            .Where(t => t.UserId == CurrentUserId &&
                        t.Type == "Expense" &&
                        t.Date.Month == month &&
                        t.Date.Year == year)
            .GroupBy(t => t.CreditCardCategoryId)
            .Select(g => new { creditCardCategoryId = g.Key, amount = g.Sum(t => t.Amount) })
            .ToListAsync();
        return Ok(spending);
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
    public async Task<IActionResult> UploadStatement(int cardId, IFormFile file, CancellationToken ct)
    {
        var card = await ctx.CreditCards.FirstOrDefaultAsync(c => c.Id == cardId && c.UserId == CurrentUserId, ct);
        if (card is null) return NotFound();

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext != ".pdf") return BadRequest("Only PDF files are accepted.");

        var categories = await ctx.CreditCardCategories
            .Where(c => c.UserId == CurrentUserId)
            .Select(c => new CategoryRef(c.Id, c.Name))
            .ToListAsync(ct);

        if (categories.Count == 0)
            return UnprocessableEntity(new { error = "No credit card categories found. Create at least one category before uploading a statement." });

        await using var ms = new MemoryStream();
        await file.CopyToAsync(ms, ct);
        var pdfBytes = ms.ToArray();

        var blobName = $"statements/{CurrentUserId}/{Guid.NewGuid()}.pdf";
        await blobService.UploadAsync(new MemoryStream(pdfBytes), blobName, "application/pdf");

        var stmt = new CreditCardStatement
        {
            CreditCardId = cardId,
            UserId = CurrentUserId,
            FileName = file.FileName,
            BlobName = blobName,
            UploadedAt = DateTime.UtcNow
        };

        var transactions = await RunPipelineAsync(stmt, pdfBytes, categories, ct);

        ctx.CreditCardStatements.Add(stmt);
        await ctx.SaveChangesAsync(ct);

        ReplaceTransactions(stmt, transactions);
        await ctx.SaveChangesAsync(ct);

        return Ok(await BuildStatementResponseAsync(stmt.Id, ct));
    }

    [HttpPost("statements/{id}/reprocess")]
    public async Task<IActionResult> ReprocessStatement(int id, CancellationToken ct)
    {
        var stmt = await ctx.CreditCardStatements.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId, ct);
        if (stmt is null) return NotFound();

        var categories = await ctx.CreditCardCategories
            .Where(c => c.UserId == CurrentUserId)
            .Select(c => new CategoryRef(c.Id, c.Name))
            .ToListAsync(ct);

        if (categories.Count == 0)
            return UnprocessableEntity(new { error = "No credit card categories found. Create at least one category before uploading a statement." });

        var pdfBytes = await blobService.DownloadBytesAsync(stmt.BlobName);

        var transactions = await RunPipelineAsync(stmt, pdfBytes, categories, ct);
        ReplaceTransactions(stmt, transactions);
        await ctx.SaveChangesAsync(ct);

        return Ok(await BuildStatementResponseAsync(stmt.Id, ct));
    }

    [HttpDelete("statements/{id}")]
    public async Task<IActionResult> DeleteStatement(int id)
    {
        var stmt = await ctx.CreditCardStatements.FirstOrDefaultAsync(s => s.Id == id && s.UserId == CurrentUserId);
        if (stmt is null) return NotFound();
        await blobService.DeleteAsync(stmt.BlobName);
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
            .Include(t => t.CreditCardCategory)
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
        tx.CreditCardCategoryId = req.CreditCardCategoryId;
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

    // ── Helpers ───────────────────────────────────────────────────────────

    // Runs Document Intelligence + Claude synchronously and sets the statement's terminal fields
    // in-memory (no DB write here — callers persist afterward). Catches every exception, not just
    // StatementProcessingBusinessException: there is no queue retry anymore, so a transient
    // failure (network blip, a 5xx from either AI provider) must still land as a Failed row the
    // user can inspect and retry via "Reintentar" instead of a bare 500 with no trace and an
    // orphaned blob.
    private async Task<List<ExtractedTransaction>?> RunPipelineAsync(
        CreditCardStatement stmt, byte[] pdfBytes, List<CategoryRef> categories, CancellationToken ct)
    {
        try
        {
            var transactions = await pipeline.ProcessAsync(pdfBytes, categories, ct);
            var (month, year) = ComputeStatementPeriod(transactions);

            stmt.Status = "Processed";
            stmt.ErrorMessage = "";
            stmt.StatementMonth = month;
            stmt.StatementYear = year;
            stmt.TotalAmount = transactions.Where(t => t.Type == "Expense").Sum(t => t.Amount);
            stmt.ProcessedAt = DateTime.UtcNow;
            return transactions;
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            stmt.Status = "Failed";
            stmt.ErrorMessage = ex is StatementProcessingBusinessException
                ? ex.Message
                : "No se pudo procesar el statement por un error técnico. Probá de nuevo en unos minutos.";
            stmt.ProcessedAt = DateTime.UtcNow;
            return null;
        }
    }

    private static (int Month, int Year) ComputeStatementPeriod(List<ExtractedTransaction> transactions) =>
        transactions
            .GroupBy(t => (t.Date.Month, t.Date.Year))
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .First();

    private void ReplaceTransactions(CreditCardStatement stmt, List<ExtractedTransaction>? transactions)
    {
        var existing = ctx.CreditCardTransactions.Where(t => t.StatementId == stmt.Id);
        ctx.CreditCardTransactions.RemoveRange(existing);

        if (transactions is not null)
        {
            ctx.CreditCardTransactions.AddRange(transactions.Select(t => new CreditCardTransaction
            {
                StatementId = stmt.Id,
                CreditCardId = stmt.CreditCardId,
                UserId = stmt.UserId,
                Date = t.Date,
                Description = t.Description,
                Amount = t.Amount,
                Type = t.Type,
                CreditCardCategoryId = t.CreditCardCategoryId,
                Notes = t.Notes ?? "",
                IsAiClassified = true,
                CreatedAt = DateTime.UtcNow
            }));
        }
    }

    private async Task<object?> BuildStatementResponseAsync(int id, CancellationToken ct) =>
        await ctx.CreditCardStatements
            .Where(s => s.Id == id)
            .Select(s => new
            {
                s.Id, s.CreditCardId, s.FileName, s.Status, s.ErrorMessage,
                s.UploadedAt, s.ProcessedAt, s.StatementMonth, s.StatementYear, s.TotalAmount,
                TransactionCount = ctx.CreditCardTransactions.Count(t => t.StatementId == s.Id)
            })
            .FirstOrDefaultAsync(ct);
}

public record UpdateTransactionRequest(int? CreditCardCategoryId, string? Notes, string? Type);
