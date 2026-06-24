using budget_api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Data;

public class BudgetDbContext(DbContextOptions<BudgetDbContext> options)
    : IdentityDbContext<IdentityUser>(options)
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
    public DbSet<LoanPayment> LoanPayments => Set<LoanPayment>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<VehicleMaintenance> VehicleMaintenances => Set<VehicleMaintenance>();
    public DbSet<VehicleTodo> VehicleTodos => Set<VehicleTodo>();
    public DbSet<VehicleReminder> VehicleReminders => Set<VehicleReminder>();
    public DbSet<VehicleMileageHistory> VehicleMileageHistories => Set<VehicleMileageHistory>();
    public DbSet<VehicleFuel> VehicleFuels => Set<VehicleFuel>();
    public DbSet<GroceryCategory> GroceryCategories => Set<GroceryCategory>();
    public DbSet<Supermarket> Supermarkets => Set<Supermarket>();
    public DbSet<GroceryItem> GroceryItems => Set<GroceryItem>();
    public DbSet<GroceryItemSupermarket> GroceryItemSupermarkets => Set<GroceryItemSupermarket>();
    public DbSet<GroceryPurchase> GroceryPurchases => Set<GroceryPurchase>();
    public DbSet<PantryItem> PantryItems => Set<PantryItem>();
    public DbSet<PushSubscription> PushSubscriptions => Set<PushSubscription>();
    public DbSet<NotificationLog> NotificationLogs => Set<NotificationLog>();
    public DbSet<CreditCard> CreditCards => Set<CreditCard>();
    public DbSet<CreditCardStatement> CreditCardStatements => Set<CreditCardStatement>();
    public DbSet<CreditCardTransaction> CreditCardTransactions => Set<CreditCardTransaction>();
    public DbSet<CreditCardCategory> CreditCardCategories => Set<CreditCardCategory>();
    public DbSet<CreditCardCategoryLimit> CreditCardCategoryLimits => Set<CreditCardCategoryLimit>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
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
        modelBuilder.Entity<LoanPayment>().Property(p => p.PrincipalAmount).HasPrecision(18, 2);
        modelBuilder.Entity<LoanPayment>().Property(p => p.InterestAmount).HasPrecision(18, 2);
        modelBuilder.Entity<LoanPayment>().Property(p => p.InsuranceAmount).HasPrecision(18, 2);
        modelBuilder.Entity<LoanPayment>().Property(p => p.AdditionalPrincipal).HasPrecision(18, 2);
        modelBuilder.Entity<LoanPayment>()
            .HasOne(p => p.Loan)
            .WithMany()
            .HasForeignKey(p => p.LoanId)
            .OnDelete(DeleteBehavior.Cascade);
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
        modelBuilder.Entity<VehicleMileageHistory>()
            .HasOne<Vehicle>()
            .WithMany()
            .HasForeignKey(h => h.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<VehicleFuel>()
            .Property(f => f.PricePerGallon).HasPrecision(18, 4);
        modelBuilder.Entity<VehicleFuel>()
            .Property(f => f.TotalAmount).HasPrecision(18, 2);
        modelBuilder.Entity<VehicleFuel>()
            .Property(f => f.Gallons).HasPrecision(18, 3);
        modelBuilder.Entity<VehicleFuel>()
            .HasOne<Vehicle>()
            .WithMany()
            .HasForeignKey(f => f.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        // Grocery
        modelBuilder.Entity<GroceryItem>().Property(i => i.LastPrice).HasPrecision(18, 2);
        modelBuilder.Entity<GroceryItem>().Property(i => i.LastQuantity).HasPrecision(18, 2);
        modelBuilder.Entity<GroceryPurchase>().Property(p => p.Price).HasPrecision(18, 2);
        modelBuilder.Entity<GroceryPurchase>().Property(p => p.Quantity).HasPrecision(18, 2);

        modelBuilder.Entity<GroceryItemSupermarket>()
            .HasKey(x => new { x.GroceryItemId, x.SupermarketId });
        modelBuilder.Entity<GroceryItemSupermarket>()
            .HasOne<GroceryItem>().WithMany()
            .HasForeignKey(x => x.GroceryItemId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<GroceryItemSupermarket>()
            .HasOne<Supermarket>().WithMany()
            .HasForeignKey(x => x.SupermarketId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<GroceryItem>()
            .HasOne<GroceryCategory>().WithMany()
            .HasForeignKey(i => i.GroceryCategoryId).OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<GroceryItem>()
            .HasOne<Supermarket>().WithMany()
            .HasForeignKey(i => i.LastSupermarketId).OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<GroceryPurchase>()
            .HasOne<GroceryItem>().WithMany()
            .HasForeignKey(p => p.GroceryItemId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<GroceryPurchase>()
            .HasOne<Supermarket>().WithMany()
            .HasForeignKey(p => p.SupermarketId).OnDelete(DeleteBehavior.Restrict);

        // Pantry
        modelBuilder.Entity<PantryItem>().Property(p => p.Quantity).HasPrecision(18, 2);
        modelBuilder.Entity<PantryItem>()
            .HasOne<GroceryItem>().WithMany()
            .HasForeignKey(p => p.GroceryItemId).OnDelete(DeleteBehavior.SetNull);

        // Credit Cards
        modelBuilder.Entity<CreditCardStatement>()
            .Property(s => s.TotalAmount).HasPrecision(18, 2);
        modelBuilder.Entity<CreditCardTransaction>()
            .Property(t => t.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<CreditCardStatement>()
            .HasOne<CreditCard>().WithMany()
            .HasForeignKey(s => s.CreditCardId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<CreditCardTransaction>()
            .HasOne<CreditCardStatement>().WithMany()
            .HasForeignKey(t => t.StatementId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<CreditCardTransaction>()
            .HasOne(t => t.CreditCardCategory).WithMany()
            .HasForeignKey(t => t.CreditCardCategoryId).OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<CreditCardCategoryLimit>()
            .Property(l => l.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<CreditCardCategoryLimit>()
            .HasOne(l => l.CreditCardCategory).WithMany()
            .HasForeignKey(l => l.CreditCardCategoryId).OnDelete(DeleteBehavior.Cascade);
    }
}
