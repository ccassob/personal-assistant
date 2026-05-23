# Budget App — IIS Setup Script
# MUST be run AS ADMINISTRATOR
# Prerequisites: ASP.NET Core Hosting Bundle (.NET 10) + IIS URL Rewrite Module installed

$outputDir   = "C:\projects\budget-app\publish-output"
$frontSrc    = "$outputDir\budget-front"
$apiSrc      = "$outputDir\budget-api"
$frontDest   = "C:\inetpub\budget-front"
$apiDest     = "C:\inetpub\budget-api"
$frontPort   = 8000
$apiPort     = 8002

Import-Module WebAdministration -ErrorAction Stop

# --- Copy files to inetpub ---
Write-Host "Copying files to inetpub..." -ForegroundColor Cyan
if (Test-Path $frontDest) { Remove-Item $frontDest -Recurse -Force }
Copy-Item $frontSrc $frontDest -Recurse

if (Test-Path $apiDest) { Remove-Item $apiDest -Recurse -Force }
Copy-Item $apiSrc $apiDest -Recurse

# --- Frontend site (port 8000) ---
Write-Host "Setting up frontend site on port $frontPort..." -ForegroundColor Cyan
if (Get-WebAppPoolState -Name 'budget-front' -ErrorAction SilentlyContinue) {
    Remove-WebAppPool -Name 'budget-front'
}
if (Get-Website -Name 'budget-front' -ErrorAction SilentlyContinue) {
    Remove-Website -Name 'budget-front'
}
New-WebAppPool -Name 'budget-front'
Set-ItemProperty IIS:\AppPools\budget-front -Name managedRuntimeVersion -Value ''
New-Website -Name 'budget-front' -Port $frontPort -PhysicalPath $frontDest -ApplicationPool 'budget-front'

# --- API site (port 8002) ---
Write-Host "Setting up API site on port $apiPort..." -ForegroundColor Cyan
if (Get-WebAppPoolState -Name 'budget-api' -ErrorAction SilentlyContinue) {
    Remove-WebAppPool -Name 'budget-api'
}
if (Get-Website -Name 'budget-api' -ErrorAction SilentlyContinue) {
    Remove-Website -Name 'budget-api'
}
New-WebAppPool -Name 'budget-api'
Set-ItemProperty IIS:\AppPools\budget-api -Name managedRuntimeVersion -Value ''
New-Website -Name 'budget-api' -Port $apiPort -PhysicalPath $apiDest -ApplicationPool 'budget-api'

# --- Start both sites ---
Start-WebSite -Name 'budget-front'
Start-WebSite -Name 'budget-api'

Write-Host ""
Write-Host "=== IIS setup complete ===" -ForegroundColor Green
Write-Host "Frontend : http://localhost:$frontPort"
Write-Host "API      : http://localhost:$apiPort"
