using System.Security.Claims;
using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class LoansController(BudgetDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Loans.Where(l => l.UserId == CurrentUserId).OrderBy(l => l.Name).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var loan = await db.Loans.FirstOrDefaultAsync(l => l.Id == id && l.UserId == CurrentUserId);
        return loan is null ? NotFound() : Ok(loan);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Loan loan)
    {
        loan.UserId = CurrentUserId;
        db.Loans.Add(loan);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = loan.Id }, loan);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Loan loan)
    {
        if (id != loan.Id) return BadRequest();
        var existing = await db.Loans.FirstOrDefaultAsync(l => l.Id == id && l.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        existing.Name = loan.Name;
        existing.LoanAmount = loan.LoanAmount;
        existing.StartDate = loan.StartDate;
        existing.InterestRate = loan.InterestRate;
        existing.MonthlyPayment = loan.MonthlyPayment;
        existing.TermMonths = loan.TermMonths;
        existing.InsuranceAmount = loan.InsuranceAmount;
        existing.CurrentBalance = loan.CurrentBalance;
        existing.GoalAmount = loan.GoalAmount;
        existing.GoalDate = loan.GoalDate;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var loan = await db.Loans.FirstOrDefaultAsync(l => l.Id == id && l.UserId == CurrentUserId);
        if (loan is null) return NotFound();
        db.Loans.Remove(loan);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
