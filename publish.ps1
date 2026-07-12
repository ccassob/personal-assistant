# Personal Assistant — Build & Publish Script
# Run from any directory. Does NOT need admin rights.
# After this completes, run iis-setup.ps1 AS ADMINISTRATOR.

$root       = "C:\projects\budget-app"
$frontendSrc = "$root\frontend\angular\personal-assistant-web"
$backendSrc  = "$root\backend\dotnet\personal-assistant-api"
$outputDir   = "$root\publish-output"

Write-Host "=== Building Angular frontend ===" -ForegroundColor Cyan
Set-Location $frontendSrc
& npx ng build --configuration production
if (-not $?) { Write-Error "ng build failed"; exit 1 }

Write-Host "=== Publishing .NET API ===" -ForegroundColor Cyan
Set-Location $backendSrc
Get-Process -Name "dotnet","personal-assistant-api" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
& dotnet publish personal-assistant-api.csproj -c Release -o "$outputDir\personal-assistant-api"
if (-not $?) { Write-Error "dotnet publish failed"; exit 1 }

Write-Host "=== Copying Angular dist ===" -ForegroundColor Cyan
$frontDest = "$outputDir\personal-assistant-web"
if (Test-Path $frontDest) { Remove-Item $frontDest -Recurse -Force }
Copy-Item "$frontendSrc\dist\personal-assistant-web\browser" $frontDest -Recurse

Write-Host ""
Write-Host "=== Build complete ===" -ForegroundColor Green
Write-Host "Artifacts are in: $outputDir"
Write-Host "Now run iis-setup.ps1 AS ADMINISTRATOR to deploy to IIS."
