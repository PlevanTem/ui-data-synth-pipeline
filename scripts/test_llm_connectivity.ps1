<#.SYNOPSIS
    Test OpenAI-compatible chat completion API connectivity.
.DESCRIPTION
    POSTs JSON to the chat completions endpoint (default .../v1/chat/completions).
    Override -Url if your gateway mounts elsewhere.
#>
param(
    [string] $Url = "http://7.242.104.218:4000/v1/chat/completions",
    [string] $ApiKey = "sk-1234567",
    [string] $Model = "gemini-3.1-pro-preview",
    [int] $TimeoutSec = 60
)

$ErrorActionPreference = "Stop"

$body = @{
    model    = $Model
    messages = @(
        @{ role = "user"; content = "Hello, are you connected?" }
    )
    stream   = $false
} | ConvertTo-Json -Depth 6

Write-Host "POST $Url"
Write-Host "model=$Model stream=false"

try {
    $response = Invoke-RestMethod -Uri $Url -Method Post -Body $body -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $ApiKey" } -TimeoutSec $TimeoutSec
    $response | ConvertTo-Json -Depth 20
    Write-Host "OK: endpoint responded successfully."
    exit 0
}
catch {
    Write-Host "Request failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    exit 1
}
