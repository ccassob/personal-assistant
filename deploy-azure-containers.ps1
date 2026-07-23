<#
.SYNOPSIS
  Builds and deploys the personal-assistant containers (API + frontend) to Azure Container Apps.

.DESCRIPTION
  Images are built in Azure Container Registry via `az acr build` — Docker Desktop does
  NOT need to be running locally. On first use, run with -CreateInfra to provision the
  ACR, the Container Apps environment, and both Container Apps (idempotent — safe to
  rerun if a previous attempt partially completed). Subsequent runs just build fresh
  images and update the two apps in place.

  Secrets (SQL connection string, JWT key, storage connection string, webhook secret,
  VAPID keys) are never hardcoded here. Either pass them explicitly as parameters, or
  pass -SourceAppServiceName to copy them from an existing App Service's settings —
  verify that site is actually the live production one before relying on this.

.EXAMPLE
  # First run — provisions everything, reusing secrets from the current App Service
  .\deploy-azure-containers.ps1 -CreateInfra -SourceAppServiceName budget-api-prod

.EXAMPLE
  # Later runs — just ship a new image + update both apps
  .\deploy-azure-containers.ps1
#>

param(
    [string]$Tag = (Get-Date -Format "yyyyMMddHHmmss"),
    [switch]$CreateInfra,
    [string]$SourceAppServiceName,
    [string]$SqlConnectionString,
    [string]$JwtKey,
    [string]$AzureStorageConnectionString,
    [string]$VapidPublicKey,
    [string]$VapidPrivateKey,
    [string]$VapidSubject = "mailto:ccassob@gmail.com",
    [string]$WebhookSecret
)

# NOT "Stop": PowerShell 5.1 converts any stderr line from a native exe (e.g. az's own
# extension WARNINGs) into a terminating error when ErrorActionPreference is Stop, even
# without explicit stderr redirection. Every az call below already checks $LASTEXITCODE
# explicitly (via Invoke-Az/Resource-Exists or inline), so Stop's behavior isn't needed.
$ErrorActionPreference = "Continue"

# az's Python process writes raw Unicode (e.g. Angular CLI's "❯") to stdout. When stdout
# isn't a real console (piped/redirected to a file, as in background runs), Python falls
# back to a non-UTF-8 default encoding and crashes with UnicodeEncodeError. Forcing this
# makes az's own stdout writes UTF-8 regardless of console codepage or redirection.
$env:PYTHONIOENCODING = "utf-8"

$Subscription   = "c235a421-0ebb-4547-99f8-987db527b0bd"   # Hosting Personal
$ResourceGroup  = "budget-app"       # live resource group — deliberately NOT renamed in the WP_037 rebrand
$Location       = "centralus"
$AcrName        = "budgetappacr01"   # live ACR — deliberately NOT renamed in the WP_037 rebrand
$AcaEnvName     = "budget-env"       # live Container Apps environment — deliberately NOT renamed
$ApiAppName     = "budget-api"       # live Container App — deliberately NOT renamed
$FrontendName   = "budget-frontend"  # live Container App — deliberately NOT renamed
$ApiImage       = "personal-assistant-api"
$FrontendImage  = "personal-assistant-frontend"

# az (a native exe, not a PowerShell cmdlet) does not honor $ErrorActionPreference —
# a non-zero exit code silently falls through instead of stopping the script. Wrap every
# call that must succeed so a real Azure failure actually halts the deployment.
function Invoke-Az {
    param([Parameter(Mandatory)][string[]]$ArgList)
    & az @ArgList
    if ($LASTEXITCODE -ne 0) {
        throw "az $($ArgList -join ' ') failed with exit code $LASTEXITCODE"
    }
}

function Resource-Exists {
    param([string[]]$ShowArgs)
    & az @ShowArgs 1> $null
    return $LASTEXITCODE -eq 0
}

Write-Host "==> Setting subscription to Hosting Personal ($Subscription)"
Invoke-Az @("account", "set", "--subscription", $Subscription)

# ---------------------------------------------------------------------------
# Optionally copy secrets from an existing App Service instead of typing them
# ---------------------------------------------------------------------------
if ($SourceAppServiceName) {
    Write-Host "==> Reading settings from App Service '$SourceAppServiceName'"
    $settingsJson = az webapp config appsettings list --name $SourceAppServiceName --resource-group $ResourceGroup
    if ($LASTEXITCODE -ne 0) { throw "Failed to read app settings from '$SourceAppServiceName'" }
    $settings = $settingsJson | ConvertFrom-Json
    function Get-AppSetting($name) { ($settings | Where-Object { $_.name -eq $name }).value }

    if (-not $SqlConnectionString) {
        $csJson = az webapp config connection-string list --name $SourceAppServiceName --resource-group $ResourceGroup
        if ($LASTEXITCODE -ne 0) { throw "Failed to read connection strings from '$SourceAppServiceName'" }
        $cs = $csJson | ConvertFrom-Json
        $match = $cs | Where-Object { $_.name -eq "DefaultConnection" }
        if ($match) { $SqlConnectionString = $match.value }
        if (-not $SqlConnectionString) { $SqlConnectionString = Get-AppSetting "ConnectionStrings__DefaultConnection" }
    }
    if (-not $JwtKey) { $JwtKey = Get-AppSetting "Jwt__Key" }
    if (-not $AzureStorageConnectionString) { $AzureStorageConnectionString = Get-AppSetting "AzureStorage__ConnectionString" }
    if (-not $VapidPublicKey) { $VapidPublicKey = Get-AppSetting "Notifications__VapidPublicKey" }
    if (-not $VapidPrivateKey) { $VapidPrivateKey = Get-AppSetting "Notifications__VapidPrivateKey" }
    if (-not $WebhookSecret) { $WebhookSecret = Get-AppSetting "CreditCards__WebhookSecret" }
}

# ---------------------------------------------------------------------------
# Step 1 (first run only): provision ACR + Container Apps environment (idempotent)
# ---------------------------------------------------------------------------
if ($CreateInfra) {
    foreach ($pair in @(
        @{ Name = "SqlConnectionString"; Value = $SqlConnectionString },
        @{ Name = "JwtKey"; Value = $JwtKey },
        @{ Name = "AzureStorageConnectionString"; Value = $AzureStorageConnectionString },
        @{ Name = "WebhookSecret"; Value = $WebhookSecret }
    )) {
        if (-not $pair.Value) {
            throw "Missing required secret '$($pair.Name)'. Pass -SourceAppServiceName <existing site> or supply it directly as a parameter."
        }
    }

    if (Resource-Exists @("acr", "show", "--name", $AcrName, "--resource-group", $ResourceGroup)) {
        Write-Host "==> ACR '$AcrName' already exists, skipping create"
    } else {
        Write-Host "==> Creating ACR '$AcrName' (Basic)"
        Invoke-Az @("acr", "create", "--name", $AcrName, "--resource-group", $ResourceGroup, "--sku", "Basic", "--admin-enabled", "true")
    }

    if (Resource-Exists @("containerapp", "env", "show", "--name", $AcaEnvName, "--resource-group", $ResourceGroup)) {
        Write-Host "==> Container Apps environment '$AcaEnvName' already exists, skipping create"
    } else {
        Write-Host "==> Creating Container Apps environment '$AcaEnvName'"
        Invoke-Az @("containerapp", "env", "create", "--name", $AcaEnvName, "--resource-group", $ResourceGroup, "--location", $Location)
    }
}

# ---------------------------------------------------------------------------
# Step 2: Build both images in ACR (cloud build — no local Docker required)
# ---------------------------------------------------------------------------
Write-Host "==> Building API image ($ApiImage`:$Tag)"
Invoke-Az @("acr", "build", "--no-logs", "--registry", $AcrName, "--resource-group", $ResourceGroup, "--image", "$ApiImage`:$Tag", "./backend/dotnet/personal-assistant-api")

Write-Host "==> Building frontend image ($FrontendImage`:$Tag)"
# --no-logs: Angular CLI prints Unicode (e.g. "❯") in its build summary, which crashes az's
# bundled colorama console wrapper with UnicodeEncodeError when it streams logs on Windows.
# Suppressing log streaming avoids that crash; the build still runs and blocks until done.
Invoke-Az @("acr", "build", "--no-logs", "--registry", $AcrName, "--resource-group", $ResourceGroup, "--image", "$FrontendImage`:$Tag", "--build-arg", "BUILD_CONFIG=azure", "./frontend/angular/personal-assistant-web")

$AcrLoginServer = az acr show --name $AcrName --resource-group $ResourceGroup --query loginServer -o tsv
if ($LASTEXITCODE -ne 0 -or -not $AcrLoginServer) { throw "Failed to resolve ACR login server for '$AcrName'" }
$ApiImageFull = "$AcrLoginServer/$ApiImage`:$Tag"
$FrontendImageFull = "$AcrLoginServer/$FrontendImage`:$Tag"

# ---------------------------------------------------------------------------
# Step 3a (first run only): create both Container Apps (idempotent)
# ---------------------------------------------------------------------------
if ($CreateInfra) {
    $AcrUsername = az acr credential show --name $AcrName --query username -o tsv
    if ($LASTEXITCODE -ne 0 -or -not $AcrUsername) { throw "Failed to read ACR credentials for '$AcrName'" }
    $AcrPassword = az acr credential show --name $AcrName --query "passwords[0].value" -o tsv
    if ($LASTEXITCODE -ne 0 -or -not $AcrPassword) { throw "Failed to read ACR credentials for '$AcrName'" }

    if (Resource-Exists @("containerapp", "show", "--name", $ApiAppName, "--resource-group", $ResourceGroup)) {
        Write-Host "==> Container App '$ApiAppName' already exists, updating image instead"
        Invoke-Az @("containerapp", "update", "--name", $ApiAppName, "--resource-group", $ResourceGroup, "--image", $ApiImageFull)
    } else {
        Write-Host "==> Creating Container App '$ApiAppName'"
        Invoke-Az @(
            "containerapp", "create",
            "--name", $ApiAppName,
            "--resource-group", $ResourceGroup,
            "--environment", $AcaEnvName,
            "--image", $ApiImageFull,
            "--registry-server", $AcrLoginServer,
            "--registry-username", $AcrUsername,
            "--registry-password", $AcrPassword,
            "--target-port", "8080",
            "--ingress", "external",
            "--min-replicas", "1",
            "--max-replicas", "3",
            "--secrets",
                "sql-connection=$SqlConnectionString",
                "jwt-key=$JwtKey",
                "storage-connection=$AzureStorageConnectionString",
                "webhook-secret=$WebhookSecret",
                "vapid-private-key=$VapidPrivateKey",
            "--env-vars",
                "ASPNETCORE_ENVIRONMENT=Production",
                "ConnectionStrings__DefaultConnection=secretref:sql-connection",
                "Jwt__Key=secretref:jwt-key",
                "AzureStorage__ConnectionString=secretref:storage-connection",
                "AzureStorage__ContainerName=credit-card-statements",
                "CreditCards__WebhookSecret=secretref:webhook-secret",
                "Notifications__VapidSubject=$VapidSubject",
                "Notifications__VapidPublicKey=$VapidPublicKey",
                "Notifications__VapidPrivateKey=secretref:vapid-private-key"
        )
    }

    $ApiFqdn = az containerapp show --name $ApiAppName --resource-group $ResourceGroup --query "properties.configuration.ingress.fqdn" -o tsv
    if ($LASTEXITCODE -ne 0 -or -not $ApiFqdn) { throw "Failed to resolve FQDN for '$ApiAppName'" }

    if (Resource-Exists @("containerapp", "show", "--name", $FrontendName, "--resource-group", $ResourceGroup)) {
        Write-Host "==> Container App '$FrontendName' already exists, updating image instead"
        Invoke-Az @("containerapp", "update", "--name", $FrontendName, "--resource-group", $ResourceGroup, "--image", $FrontendImageFull, "--set-env-vars", "API_UPSTREAM=https://$ApiFqdn")
    } else {
        Write-Host "==> Creating Container App '$FrontendName' (API upstream: https://$ApiFqdn)"
        Invoke-Az @(
            "containerapp", "create",
            "--name", $FrontendName,
            "--resource-group", $ResourceGroup,
            "--environment", $AcaEnvName,
            "--image", $FrontendImageFull,
            "--registry-server", $AcrLoginServer,
            "--registry-username", $AcrUsername,
            "--registry-password", $AcrPassword,
            "--target-port", "80",
            "--ingress", "external",
            "--env-vars", "API_UPSTREAM=https://$ApiFqdn"
        )
    }

    $FrontendFqdn = az containerapp show --name $FrontendName --resource-group $ResourceGroup --query "properties.configuration.ingress.fqdn" -o tsv
    Write-Host ""
    Write-Host "==> Done. API: https://$ApiFqdn   Frontend: https://$FrontendFqdn"
    exit 0
}

# ---------------------------------------------------------------------------
# Step 3b (subsequent runs): just roll out the new images
# ---------------------------------------------------------------------------
Write-Host "==> Updating '$ApiAppName' to image $ApiImageFull"
Invoke-Az @("containerapp", "update", "--name", $ApiAppName, "--resource-group", $ResourceGroup, "--image", $ApiImageFull)

$ApiFqdn = az containerapp show --name $ApiAppName --resource-group $ResourceGroup --query "properties.configuration.ingress.fqdn" -o tsv
if ($LASTEXITCODE -ne 0 -or -not $ApiFqdn) { throw "Failed to resolve FQDN for '$ApiAppName'" }

Write-Host "==> Updating '$FrontendName' to image $FrontendImageFull (API upstream: https://$ApiFqdn)"
Invoke-Az @("containerapp", "update", "--name", $FrontendName, "--resource-group", $ResourceGroup, "--image", $FrontendImageFull, "--set-env-vars", "API_UPSTREAM=https://$ApiFqdn")

$FrontendFqdn = az containerapp show --name $FrontendName --resource-group $ResourceGroup --query "properties.configuration.ingress.fqdn" -o tsv
Write-Host ""
Write-Host "==> Done. API: https://$ApiFqdn   Frontend: https://$FrontendFqdn"
