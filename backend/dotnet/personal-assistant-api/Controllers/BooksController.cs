using System.Security.Claims;
using personal_assistant_api.Data;
using personal_assistant_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace personal_assistant_api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BooksController(PersonalAssistantDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var books = await db.Books.Where(b => b.UserId == CurrentUserId).ToListAsync();
        return Ok(books.OrderByDescending(b => b.LastUpdated).ThenBy(b => b.Title));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var book = await db.Books.FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);
        return book is null ? NotFound() : Ok(book);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Book book)
    {
        book.UserId = CurrentUserId;
        book.LastUpdated = DateOnly.FromDateTime(DateTime.Today);
        db.Books.Add(book);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Book book)
    {
        if (id != book.Id) return BadRequest();
        var existing = await db.Books.FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Title = book.Title;
        existing.Author = book.Author;
        existing.TotalPages = book.TotalPages;
        existing.CurrentPage = book.CurrentPage;
        existing.StartDate = book.StartDate;
        existing.Status = book.Status;
        existing.TargetDate = book.TargetDate;
        existing.Notes = book.Notes;
        existing.BookType = book.BookType;
        existing.LastUpdated = DateOnly.FromDateTime(DateTime.Today);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var book = await db.Books.FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);
        if (book is null) return NotFound();
        db.Books.Remove(book);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}/progress")]
    public async Task<IActionResult> GetProgress(int id)
    {
        if (!await db.Books.AnyAsync(b => b.Id == id && b.UserId == CurrentUserId)) return NotFound();
        return Ok(await db.BookProgresses
            .Where(p => p.BookId == id)
            .OrderBy(p => p.Date)
            .ToListAsync());
    }

    [HttpPost("{id}/progress")]
    public async Task<IActionResult> UpdateProgress(int id, [FromBody] UpdateProgressRequest req)
    {
        var book = await db.Books.FirstOrDefaultAsync(b => b.Id == id && b.UserId == CurrentUserId);
        if (book is null) return NotFound();

        var today = DateOnly.FromDateTime(DateTime.Today);
        var existing = await db.BookProgresses.FirstOrDefaultAsync(p => p.BookId == id && p.Date == today);

        if (existing is null)
            db.BookProgresses.Add(new BookProgress { BookId = id, Date = today, CurrentPage = req.CurrentPage });
        else
            existing.CurrentPage = req.CurrentPage;

        book.CurrentPage = req.CurrentPage;
        book.LastUpdated = DateOnly.FromDateTime(DateTime.Today);
        await db.SaveChangesAsync();
        return Ok(book);
    }

    [HttpGet("{id}/tasks")]
    public async Task<IActionResult> GetTasks(int id)
    {
        if (!await db.Books.AnyAsync(b => b.Id == id && b.UserId == CurrentUserId)) return NotFound();
        return Ok(await db.BookTasks.Where(t => t.BookId == id).OrderBy(t => t.Id).ToListAsync());
    }

    [HttpPost("{id}/tasks")]
    public async Task<IActionResult> CreateTask(int id, [FromBody] CreateTaskRequest req)
    {
        if (!await db.Books.AnyAsync(b => b.Id == id && b.UserId == CurrentUserId)) return NotFound();
        var task = new BookTask { BookId = id, Title = req.Title };
        db.BookTasks.Add(task);
        await db.SaveChangesAsync();
        return Ok(task);
    }

    [HttpPut("{id}/tasks/{taskId}")]
    public async Task<IActionResult> UpdateTask(int id, int taskId, [FromBody] UpdateTaskRequest req)
    {
        if (!await db.Books.AnyAsync(b => b.Id == id && b.UserId == CurrentUserId)) return NotFound();
        var task = await db.BookTasks.FirstOrDefaultAsync(t => t.Id == taskId && t.BookId == id);
        if (task is null) return NotFound();
        task.IsDone = req.IsDone;
        await db.SaveChangesAsync();
        return Ok(task);
    }

    [HttpDelete("{id}/tasks/{taskId}")]
    public async Task<IActionResult> DeleteTask(int id, int taskId)
    {
        if (!await db.Books.AnyAsync(b => b.Id == id && b.UserId == CurrentUserId)) return NotFound();
        var task = await db.BookTasks.FirstOrDefaultAsync(t => t.Id == taskId && t.BookId == id);
        if (task is null) return NotFound();
        db.BookTasks.Remove(task);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

public record UpdateProgressRequest(int CurrentPage);
public record CreateTaskRequest(string Title);
public record UpdateTaskRequest(bool IsDone);
