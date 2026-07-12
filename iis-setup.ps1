# Personal Assistant — IIS Setup Script
# MUST be run AS ADMINISTRATOR
# Prerequisites: ASP.NET Core Hosting Bundle (.NET 10) + IIS URL Rewrite Module installed

$outputDir   = "C:\projects\personal-assistant\publish-output"
$frontSrc    = "$outputDir\personal-assistant-web"
$apiSrc      = "$outputDir\personal-assistant-api"
$frontDest   = "C:\inetpub\personal-assistant-web"
$apiDest     = "C:\inetpub\personal-assistant-api"
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
if (Get-WebAppPoolState -Name 'personal-assistant-web' -ErrorAction SilentlyContinue) {
    Remove-WebAppPool -Name 'personal-assistant-web'
}
if (Get-Website -Name 'personal-assistant-web' -ErrorAction SilentlyContinue) {
    Remove-Website -Name 'personal-assistant-web'
}
New-WebAppPool -Name 'personal-assistant-web'
Set-ItemProperty IIS:\AppPools\personal-assistant-web -Name managedRuntimeVersion -Value ''
New-Website -Name 'personal-assistant-web' -Port $frontPort -PhysicalPath $frontDest -ApplicationPool 'personal-assistant-web'

# --- API site (port 8002) ---
Write-Host "Setting up API site on port $apiPort..." -ForegroundColor Cyan
if (Get-WebAppPoolState -Name 'personal-assistant-api' -ErrorAction SilentlyContinue) {
    Remove-WebAppPool -Name 'personal-assistant-api'
}
if (Get-Website -Name 'personal-assistant-api' -ErrorAction SilentlyContinue) {
    Remove-Website -Name 'personal-assistant-api'
}
New-WebAppPool -Name 'personal-assistant-api'
Set-ItemProperty IIS:\AppPools\personal-assistant-api -Name managedRuntimeVersion -Value ''
New-Website -Name 'personal-assistant-api' -Port $apiPort -PhysicalPath $apiDest -ApplicationPool 'personal-assistant-api'

# --- Start both sites ---
Start-WebSite -Name 'personal-assistant-web'
Start-WebSite -Name 'personal-assistant-api'

Write-Host ""
Write-Host "=== IIS setup complete ===" -ForegroundColor Green
Write-Host "Frontend : http://localhost:$frontPort"
Write-Host "API      : http://localhost:$apiPort"
