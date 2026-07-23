# Builds the two app images, loads them into minikube, and applies the k8s manifests.
# Run from anywhere; paths below are relative to the repo root.
$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path "$PSScriptRoot\.."
$EnvFile = Join-Path $RepoRoot ".env"

if (-not (Test-Path $EnvFile)) {
    throw "$EnvFile not found. Copy .env.example to .env and fill in SA_PASSWORD / JWT_KEY first."
}

$envValues = @{}
Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^\s*([A-Z_]+)\s*=\s*(.+?)\s*$') {
        $envValues[$matches[1]] = $matches[2]
    }
}
$saPassword = $envValues["SA_PASSWORD"]
$jwtKey = $envValues["JWT_KEY"]
if (-not $saPassword -or -not $jwtKey) {
    throw "SA_PASSWORD and/or JWT_KEY missing from $EnvFile"
}
$connectionString = "Server=sql,1433;Database=BudgetApp;User Id=sa;Password=$saPassword;Encrypt=False;TrustServerCertificate=True;"

Write-Host "Building images..." -ForegroundColor Cyan
docker build -t personal-assistant-api:local "$RepoRoot\backend\dotnet\personal-assistant-api"
docker build -t personal-assistant-frontend:local --build-arg BUILD_CONFIG=azure "$RepoRoot\frontend\angular\personal-assistant-web"

Write-Host "Loading images into minikube..." -ForegroundColor Cyan
minikube image load personal-assistant-api:local
minikube image load personal-assistant-frontend:local

$ingressStatus = minikube addons list -o json | ConvertFrom-Json
if (-not $ingressStatus.ingress.Status -or $ingressStatus.ingress.Status -ne "enabled") {
    Write-Host "Enabling ingress addon..." -ForegroundColor Cyan
    minikube addons enable ingress
}

Write-Host "Applying manifests..." -ForegroundColor Cyan
kubectl apply -k "$RepoRoot\k8s"

Write-Host "Creating/updating secret..." -ForegroundColor Cyan
kubectl create secret generic personal-assistant-secrets `
    --namespace personal-assistant `
    --from-literal=SA_PASSWORD=$saPassword `
    --from-literal=JWT_KEY=$jwtKey `
    --from-literal=CONNECTION_STRING=$connectionString `
    --dry-run=client -o yaml | kubectl apply -f -

Write-Host "Restarting deployments to pick up fresh images/secrets..." -ForegroundColor Cyan
kubectl rollout restart deployment/sql deployment/api deployment/frontend -n personal-assistant

Write-Host ""
Write-Host "Done. Next steps:" -ForegroundColor Green
Write-Host "  1. In a separate elevated terminal, run: minikube tunnel"
Write-Host "  2. Add this line to C:\Windows\System32\drivers\etc\hosts (as admin):"
Write-Host "       127.0.0.1 personal-assistant.local"
Write-Host "  3. Browse to http://personal-assistant.local"
Write-Host ""
Write-Host "Check rollout status with: kubectl get pods -n personal-assistant -w"
