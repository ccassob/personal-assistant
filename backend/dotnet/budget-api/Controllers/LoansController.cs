using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController(BudgetDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Loans.OrderBy(l => l.Name).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var loan = await db.Loans.FindAsync(id);
        return loan is null ? NotFound() : Ok(loan);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Loan loan)
    {
        db.Loans.Add(loan);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = loan.Id }, loan);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Loan loan)
    {
        if (id != loan.Id) return BadRequest();
        db.Entry(loan).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var loan = await db.Loans.FindAsync(id);
        if (loan is null) return NotFound();
        db.Loans.Remove(loan);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
