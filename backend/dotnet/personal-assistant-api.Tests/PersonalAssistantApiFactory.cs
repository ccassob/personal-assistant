using personal_assistant_api.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace personal_assistant_api.Tests;

public class PersonalAssistantApiFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var toRemove = services
                .Where(d => d.ServiceType.FullName?.Contains("PersonalAssistantDbContext") == true)
                .ToList();
            foreach (var d in toRemove) services.Remove(d);

            services.AddDbContext<PersonalAssistantDbContext>(options =>
                options.UseInMemoryDatabase(_dbName));
        });

        builder.ConfigureTestServices(services =>
        {
            services.AddAuthentication()
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.Scheme, _ => { });

            services.PostConfigure<AuthenticationOptions>(options =>
            {
                options.DefaultAuthenticateScheme = TestAuthHandler.Scheme;
                options.DefaultChallengeScheme = TestAuthHandler.Scheme;
                options.DefaultScheme = TestAuthHandler.Scheme;
            });
        });
    }

    public void ResetDatabase()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PersonalAssistantDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();
    }

    public int Seed<T>(T entity) where T : class
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PersonalAssistantDbContext>();
        db.Set<T>().Add(entity);
        db.SaveChanges();
        return (int)typeof(T).GetProperty("Id")!.GetValue(entity)!;
    }

    public void SeedMany<T>(IEnumerable<T> entities) where T : class
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PersonalAssistantDbContext>();
        db.Set<T>().AddRange(entities);
        db.SaveChanges();
    }

    public int CountAll<T>() where T : class
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PersonalAssistantDbContext>();
        return db.Set<T>().Count();
    }
}
