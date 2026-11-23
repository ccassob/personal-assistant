using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace PersonalAssistant.Tests.Controllers;

public class AuthControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string Email = "ana@example.com";
    private const string Password = "Password1";
    private const string DisplayName = "Ana Perez";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    private record TokenResponse(string Token);

    public AuthControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private Task<HttpResponseMessage> Register(string email = Email, string password = Password, string displayName = DisplayName)
    {
        return _client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName });
    }

    private Task<HttpResponseMessage> Login(string email = Email, string password = Password)
    {
        return _client.PostAsJsonAsync("/api/auth/login", new { email, password });
    }

    private static async Task<JwtSecurityToken> ReadToken(HttpResponseMessage response)
    {
        var body = await response.Content.ReadFromJsonAsync<TokenResponse>();
        body!.Token.Should().NotBeNullOrWhiteSpace();

        return new JwtSecurityTokenHandler().ReadJwtToken(body.Token);
    }

    private static string? ClaimValue(JwtSecurityToken token, params string[] types)
    {
        return token.Claims.FirstOrDefault(c => types.Contains(c.Type))?.Value;
    }

    private static string? IdClaim(JwtSecurityToken token) => ClaimValue(token, ClaimTypes.NameIdentifier, "nameid", "sub");

    private static string? EmailClaim(JwtSecurityToken token) => ClaimValue(token, ClaimTypes.Email, "email");

    private static string? NameClaim(JwtSecurityToken token) => ClaimValue(token, ClaimTypes.Name, "unique_name", "name");

    // ── POST /api/auth/register ─────────────────────────────────────────────

    [Fact]
    public async Task Register_ReturnsToken_WithIdEmailAndNameClaims()
    {
        var response = await Register();

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var token = await ReadToken(response);
        IdClaim(token).Should().NotBeNullOrWhiteSpace();
        EmailClaim(token).Should().Be(Email);
        NameClaim(token).Should().Be(DisplayName);
    }

    [Fact]
    public async Task Register_TokenHasConfiguredIssuerAudienceAndExpiry()
    {
        var config = _factory.Services.GetRequiredService<IConfiguration>();

        var token = await ReadToken(await Register());

        token.Issuer.Should().Be(config["Jwt:Issuer"]);
        token.Audiences.Should().Contain(config["Jwt:Audience"]);
        var expectedMinutes = double.Parse(config["Jwt:ExpiresInMinutes"]!);
        token.ValidTo.Should().BeCloseTo(DateTime.UtcNow.AddMinutes(expectedMinutes), TimeSpan.FromMinutes(1));
    }

    [Fact]
    public async Task Register_PersistsUser_WithConfirmedEmail_AndHashedPassword()
    {
        await Register();

        var user = _factory.GetAll<IdentityUser>().Single();
        user.Email.Should().Be(Email);
        user.UserName.Should().Be(Email);
        user.EmailConfirmed.Should().BeTrue();
        user.PasswordHash.Should().NotBeNullOrEmpty().And.NotContain(Password);
    }

    [Fact]
    public async Task Register_TokenUserId_MatchesPersistedUser()
    {
        var token = await ReadToken(await Register());

        IdClaim(token).Should().Be(_factory.GetAll<IdentityUser>().Single().Id);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenEmailAlreadyRegistered()
    {
        await Register();

        var response = await Register();

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        _factory.CountAll<IdentityUser>().Should().Be(1);
    }

    [Theory]
    [InlineData("short1")]
    [InlineData("nodigitshere")]
    public async Task Register_ReturnsBadRequest_WithErrors_WhenPasswordViolatesPolicy(string password)
    {
        var response = await Register(password: password);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errors = await response.Content.ReadFromJsonAsync<string[]>();
        errors.Should().NotBeEmpty();
        _factory.CountAll<IdentityUser>().Should().Be(0);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenEmailIsInvalid()
    {
        var response = await Register(email: "not-an-email");

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        _factory.CountAll<IdentityUser>().Should().Be(0);
    }

    [Fact]
    public async Task Register_DoesNotRequireUppercaseOrSymbol()
    {
        var response = await Register(password: "alllower1");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    // ── POST /api/auth/login ────────────────────────────────────────────────

    [Fact]
    public async Task Login_ReturnsToken_WithSameUserIdAndDisplayNameAsRegistration()
    {
        var registered = await ReadToken(await Register());

        var response = await Login();

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var token = await ReadToken(response);
        IdClaim(token).Should().Be(IdClaim(registered));
        EmailClaim(token).Should().Be(Email);
        NameClaim(token).Should().Be(DisplayName);
    }

    [Fact]
    public async Task Login_IsCaseInsensitiveOnEmail()
    {
        await Register();

        var response = await Login(email: "ANA@EXAMPLE.COM");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenPasswordIsWrong()
    {
        await Register();

        var response = await Login(password: "WrongPassword1");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        (await response.Content.ReadAsStringAsync()).Should().Be("Invalid email or password.");
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WithSameMessage_WhenUserDoesNotExist()
    {
        var response = await Login(email: "ghost@example.com");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        (await response.Content.ReadAsStringAsync()).Should().Be("Invalid email or password.");
    }

    [Fact]
    public async Task Login_FallsBackToEmail_WhenUserHasNoNameClaim()
    {
        using (var scope = _factory.Services.CreateScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var user = new IdentityUser { UserName = "noname@example.com", Email = "noname@example.com", EmailConfirmed = true };
            (await users.CreateAsync(user, Password)).Succeeded.Should().BeTrue();
        }

        var token = await ReadToken(await Login(email: "noname@example.com"));

        NameClaim(token).Should().Be("noname@example.com");
    }

    [Fact]
    public async Task Login_IssuesDistinctUserIds_ForDifferentUsers()
    {
        var first = await ReadToken(await Register("one@example.com"));
        var second = await ReadToken(await Register("two@example.com"));

        IdClaim(first).Should().NotBe(IdClaim(second));
    }

    // ── GET /api/auth/me ────────────────────────────────────────────────────

    [Fact]
    public async Task Me_ReturnsCurrentUserClaims()
    {
        var response = await _client.GetAsync("/api/auth/me");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("id").GetString().Should().Be(TestAuthHandler.UserId);
        json.GetProperty("email").GetString().Should().Be("test@example.com");
        json.GetProperty("name").GetString().Should().Be("Test User");
    }
}
