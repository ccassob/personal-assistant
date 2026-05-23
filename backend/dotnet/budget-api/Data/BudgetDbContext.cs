using budget_api.Models;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Data;

public class BudgetDbContext(DbContextOptions<BudgetDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<Goal> Goals => Set<Goal>();
    public DbSet<RecurringTransaction> RecurringTransactions => Set<RecurringTransaction>();
    public DbSet<AppSettings> AppSettings => Set<AppSettings>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<AccountHistory> AccountHistories => Set<AccountHistory>();
    public DbSet<Loan> Loans => Set<Loan>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Transaction>().Property(t => t.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<Budget>().Property(b => b.TargetAmount).HasPrecision(18, 2);
        modelBuilder.Entity<Goal>().Property(g => g.TargetAmount).HasPrecision(18, 2);
        modelBuilder.Entity<Goal>().Property(g => g.CurrentAmount).HasPrecision(18, 2);
        modelBuilder.Entity<RecurringTransaction>().Property(r => r.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<Account>().Property(a => a.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<AccountHistory>().Property(h => h.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<Loan>().Property(l => l.LoanAmount).HasPrecision(18, 2);
        modelBuilder.Entity<Loan>().Property(l => l.MonthlyPayment).HasPrecision(18, 2);
        modelBuilder.Entity<Loan>().Property(l => l.InterestRate).HasPrecision(18, 4);
        modelBuilder.Entity<Loan>().Property(l => l.InsuranceAmount).HasPrecision(18, 2);
        modelBuilder.Entity<Loan>().Property(l => l.CurrentBalance).HasPrecision(18, 2);
        modelBuilder.Entity<Loan>().Property(l => l.GoalAmount).HasPrecision(18, 2);
    }
}
