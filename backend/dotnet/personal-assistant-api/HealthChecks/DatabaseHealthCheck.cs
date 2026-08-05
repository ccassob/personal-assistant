using Microsoft.Extensions.Diagnostics.HealthChecks;
using personal_assistant_api.Data;

namespace personal_assistant_api.HealthChecks;

public class DatabaseHealthCheck(PersonalAssistantDbContext db) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        return await db.Database.CanConnectAsync(cancellationToken)
            ? HealthCheckResult.Healthy()
            : HealthCheckResult.Unhealthy("Cannot connect to database.");
    }
}
