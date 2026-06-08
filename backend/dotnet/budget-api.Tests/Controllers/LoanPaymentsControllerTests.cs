using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using budget_api.Models;

namespace budget_api.Tests.Controllers;

public class LoanPaymentsControllerTests : IClassFixture<BudgetApiFactory>
{
    private readonly HttpClient _client;
    private readonly BudgetApiFactory _factory;

    public LoanPaymentsControllerTests(BudgetApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private static Loan SeedLoan(BudgetApiFactory factory, string name = "Test Loan") =>
        new()
        {
            Id = factory.Seed(new Loan
            {
                Name = name,
                LoanAmount = 10000,
                StartDate = new DateOnly(2025, 1, 1),
                InterestRate = 5,
                MonthlyPayment = 200,
                TermMonths = 60,
                InsuranceAmount = 30,
                CurrentBalance = 10000,
                UserId = TestAuthHandler.UserId
            })
        };

    private int SeedLoanId(string name = "Test Loan")
    {
        return _factory.Seed(new Loan
        {
            Name = name,
            LoanAmount = 10000,
            StartDate = new DateOnly(2025, 1, 1),
            InterestRate = 5,
            MonthlyPayment = 200,
            TermMonths = 60,
            InsuranceAmount = 30,
            CurrentBalance = 10000,
            UserId = TestAuthHandler.UserId
        });
    }

    // ── GET /api/loans/{id}/payments ──────────────────────────────────────────

    [Fact]
    public async Task GetPayments_ReturnsEmptyArray_WhenNoPaymentsExist()
    {
        var loanId = SeedLoanId();

        var response = await _client.GetAsync($"/api/loans/{loanId}/payments");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadAsStringAsync();
        body.Should().Be("[]");
    }

    [Fact]
    public async Task GetPayments_ReturnsOnlyPaymentsForThatLoan()
    {
        var loanId1 = SeedLoanId("Loan A");
        var loanId2 = SeedLoanId("Loan B");

        _factory.SeedMany([
            new LoanPayment { LoanId = loanId1, Date = new DateOnly(2026, 1, 1), PrincipalAmount = 150, InterestAmount = 50, InsuranceAmount = 30, AdditionalPrincipal = 0, UserId = TestAuthHandler.UserId },
            new LoanPayment { LoanId = loanId2, Date = new DateOnly(2026, 2, 1), PrincipalAmount = 160, InterestAmount = 40, InsuranceAmount = 30, AdditionalPrincipal = 0, UserId = TestAuthHandler.UserId },
        ]);

        var payments = await _client.GetFromJsonAsync<LoanPayment[]>($"/api/loans/{loanId1}/payments");

        payments.Should().HaveCount(1);
        payments![0].PrincipalAmount.Should().Be(150);
    }

    // ── POST /api/loans/{id}/payments ─────────────────────────────────────────

    [Fact]
    public async Task CreatePayment_ReturnsCreated()
    {
        var loanId = SeedLoanId();
        var payload = new { date = "2026-06-01", principalAmount = 150.00, interestAmount = 50.00, insuranceAmount = 30.00, additionalPrincipal = 100.00 };

        var response = await _client.PostAsJsonAsync($"/api/loans/{loanId}/payments", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var created = await response.Content.ReadFromJsonAsync<LoanPayment>();
        created!.PrincipalAmount.Should().Be(150);
        created.AdditionalPrincipal.Should().Be(100);
    }

    [Fact]
    public async Task CreatePayment_Returns404_WhenLoanNotOwned()
    {
        var otherLoanId = _factory.Seed(new Loan
        {
            Name = "Other",
            LoanAmount = 5000,
            StartDate = new DateOnly(2025, 1, 1),
            InterestRate = 0,
            MonthlyPayment = 100,
            TermMonths = 12,
            InsuranceAmount = 0,
            CurrentBalance = 5000,
            UserId = "other-user"
        });

        var payload = new { date = "2026-06-01", principalAmount = 100.00, interestAmount = 0.00, insuranceAmount = 0.00, additionalPrincipal = 0.00 };
        var response = await _client.PostAsJsonAsync($"/api/loans/{otherLoanId}/payments", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── DELETE /api/loans/{id}/payments/{paymentId} ───────────────────────────

    [Fact]
    public async Task DeletePayment_RemovesPayment()
    {
        var loanId = SeedLoanId();
        var paymentId = _factory.Seed(new LoanPayment
        {
            LoanId = loanId,
            Date = new DateOnly(2026, 1, 1),
            PrincipalAmount = 150,
            InterestAmount = 50,
            InsuranceAmount = 30,
            AdditionalPrincipal = 0,
            UserId = TestAuthHandler.UserId
        });

        var deleteResponse = await _client.DeleteAsync($"/api/loans/{loanId}/payments/{paymentId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var payments = await _client.GetFromJsonAsync<LoanPayment[]>($"/api/loans/{loanId}/payments");
        payments.Should().BeEmpty();
    }
}
