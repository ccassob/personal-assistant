# Budget App — Build & Publish Script
# Run from any directory. Does NOT need admin rights.
# After this completes, run iis-setup.ps1 AS ADMINISTRATOR.

$root       = "C:\projects\budget-app"
$frontendSrc = "$root\frontend\angular\budget-front"
$backendSrc  = "$root\backend\dotnet\budget-api"
$outputDir   = "$root\publish-output"

Write-Host "=== Building Angular frontend ===" -ForegroundColor Cyan
Set-Location $frontendSrc
& npx ng build --configuration production
if (-not $?) { Write-Error "ng build failed"; exit 1 }

Write-Host "=== Publishing .NET API ===" -ForegroundColor Cyan
Set-Location $backendSrc
Get-Process -Name "dotnet","budget-api" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
& dotnet publish budget-api.csproj -c Release -o "$outputDir\budget-api"
if (-not $?) { Write-Error "dotnet publish failed"; exit 1 }

Write-Host "=== Copying Angular dist ===" -ForegroundColor Cyan
$frontDest = "$outputDir\budget-front"
if (Test-Path $frontDest) { Remove-Item $frontDest -Recurse -Force }
Copy-Item "$frontendSrc\dist\budget-front\browser" $frontDest -Recurse

Write-Host ""
Write-Host "=== Build complete ===" -ForegroundColor Green
Write-Host "Artifacts are in: $outputDir"
Write-Host "Now run iis-setup.ps1 AS ADMINISTRATOR to deploy to IIS."
