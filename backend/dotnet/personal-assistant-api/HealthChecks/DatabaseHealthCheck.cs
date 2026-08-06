using Microsoft.Extensions.Diagnostics.HealthChecks;
using PersonalAssistant.Api.Data;

namespace PersonalAssistant.Api.HealthChecks;

public class DatabaseHealthCheck(PersonalAssistantDbContext db) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        return await db.Database.CanConnectAsync(cancellationToken)
            ? HealthCheckResult.Healthy()
            : HealthCheckResult.Unhealthy("Cannot connect to database.");
    }
}
