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
    public DbSet<Book> Books => Set<Book>();
    public DbSet<BookProgress> BookProgresses => Set<BookProgress>();
    public DbSet<BookTask> BookTasks => Set<BookTask>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<VehicleMaintenance> VehicleMaintenances => Set<VehicleMaintenance>();
    public DbSet<VehicleTodo> VehicleTodos => Set<VehicleTodo>();
    public DbSet<VehicleReminder> VehicleReminders => Set<VehicleReminder>();

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
        modelBuilder.Entity<BookProgress>()
            .HasOne<Book>()
            .WithMany()
            .HasForeignKey(p => p.BookId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<BookTask>()
            .HasOne<Book>()
            .WithMany()
            .HasForeignKey(t => t.BookId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Book>()
            .Property(b => b.BookType)
            .HasMaxLength(20);
        modelBuilder.Entity<VehicleMaintenance>()
            .Property(m => m.Price).HasPrecision(18, 2);
        modelBuilder.Entity<VehicleMaintenance>()
            .HasOne<Vehicle>()
            .WithMany()
            .HasForeignKey(m => m.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<VehicleTodo>()
            .HasOne<Vehicle>()
            .WithMany()
            .HasForeignKey(t => t.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<VehicleReminder>()
            .HasOne<Vehicle>()
            .WithMany()
            .HasForeignKey(r => r.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
