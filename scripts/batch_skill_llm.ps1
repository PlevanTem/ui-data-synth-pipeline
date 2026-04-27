<#
.SYNOPSIS
  Batch POST /v1/chat/completions using a SKILL.md body + JSON query list.

SKILL -> API (same rules as batch_skill_llm.py)
  - YAML frontmatter (first line --- through next ---) is NOT sent; only the markdown body after it.
  - If body contains literal {query}: system = body with {query} replaced by this row's text; user = short nudge.
  - Else: system = full body; user = this row's text.
  - Cursor frontmatter (name, description, tags) is for the IDE only, not used in HTTP.

ENCODING
  Request/response JSON uses UTF-8. On PowerShell 7.3+, ConvertTo-Json uses -EscapeHandling NonAscii
  so Chinese is not escaped as \uXXXX. Older hosts: use the Python script for strict UTF-8 JSON literals.

MODEL
  Default -Model is gemini-3.1-pro-preview. Override -Model for other providers.

PARALLEL
  -Workers > 1: prefers real python.exe + batch_skill_llm.py; else uses node + batch_skill_llm_parallel.mjs; else falls back to sequential.
#>
param(
    [Parameter(Mandatory = $true)][string] $Skill,
    [Parameter(Mandatory = $true)][string] $Queries,
    [Parameter(Mandatory = $true)][string] $OutPath,
    [string] $Url = "http://7.242.104.218:4000/v1/chat/completions",
    [string] $ApiKey = "sk-1234567",
    [string] $Model = "gemini-3.1-pro-preview",
    [string] $QueryField = "",
    [string] $IdField = "",
    [string] $MergeJson = "",
    [int] $Limit = 0,
    [int] $TimeoutSec = 600,
    [double] $LitellmTimeout = 600,
    [int] $Workers = 1,
    [switch] $Resume,
    [switch] $ResumeSuccessOnly
)

function Find-PythonExeForParallel {
    foreach ($name in @('python', 'python3')) {
        $cmd = Get-Command $name -ErrorAction SilentlyContinue
        if ($null -eq $cmd) { continue }
        $src = $cmd.Source
        if ($src -like '*WindowsApps*') { continue }
        return $src
    }
    foreach ($ver in @(313, 312, 311, 310)) {
        $p = Join-Path $env:LOCALAPPDATA "Programs\Python\Python$ver\python.exe"
        if (Test-Path -LiteralPath $p) { return $p }
        $p2 = "${env:ProgramFiles}\Python$ver\python.exe"
        if (Test-Path -LiteralPath $p2) { return $p2 }
    }
    return $null
}

$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

function ConvertTo-JsonUtf8Text([object] $InputObject, [int] $Depth = 30) {
    $mj = $PSVersionTable.PSVersion.Major
    $mn = $PSVersionTable.PSVersion.Minor
    if ($mj -gt 7 -or ($mj -eq 7 -and $mn -ge 3)) {
        return ($InputObject | ConvertTo-Json -Depth $Depth -Compress -EscapeHandling NonAscii)
    }
    try {
        $opts = [System.Text.Json.JsonSerializerOptions]::new()
        $opts.Encoder = [System.Text.Encodings.Web.JavaScriptEncoder]::UnsafeRelaxedJsonEscaping
        return [System.Text.Json.JsonSerializer]::Serialize([object]$InputObject, $opts)
    }
    catch {
        return ($InputObject | ConvertTo-Json -Depth $Depth -Compress)
    }
}

function Get-SkillBody([string] $Path) {
    $raw = [System.IO.File]::ReadAllText((Resolve-Path $Path), $utf8NoBom)
    $lines = $raw -split "`r?`n", -1, "Regex"
    if ($lines.Count -lt 2 -or $lines[0].Trim() -ne "---") { return $raw }
    $end = -1
    for ($i = 1; $i -lt $lines.Count; $i++) {
        if ($lines[$i].Trim() -eq "---") { $end = $i; break }
    }
    if ($end -lt 0) { return $raw }
    ($lines[($end + 1)..($lines.Count - 1)] -join "`n").TrimStart("`n")
}

function Get-QueryText($item, [string] $field) {
    if ($item -is [string]) { return $item }
    if ($field) { return [string]$item.$field }
    foreach ($k in @("question", "query", "message", "text", "prompt", "user_query")) {
        $v = $item.$k
        if ($null -ne $v -and [string]$v -ne "") { return [string]$v }
    }
    throw "No query field found on item"
}

function Get-ItemId($item, [string] $field, [int] $lineNo) {
    if ($item -is [string]) { return $lineNo }
    if ($field) {
        $v = $item.$field
        if ($null -ne $v) { return $v }
        return $lineNo
    }
    foreach ($k in @("index", "id", "uuid", "key")) {
        if ($null -ne $item.$k) { return $item.$k }
    }
    return $lineNo
}

function Get-AssistantFromMessage($m) {
    if (-not $m) { return "" }
    $c = $m.content
    if ($null -ne $c -and $c -ne "") {
        if ($c -is [string]) { return $c.Trim() }
        if ($c -is [System.Array]) {
            $parts = [System.Collections.Generic.List[string]]::new()
            foreach ($b in $c) {
                if (-not $b) { continue }
                if ($b.text) { [void]$parts.Add([string]$b.text) }
                elseif ($b.content) { [void]$parts.Add([string]$b.content) }
            }
            return ($parts -join "").Trim()
        }
        return ([string]$c).Trim()
    }
    $rc = $m.reasoning_content
    if ($null -ne $rc -and [string]$rc -ne "") { return ([string]$rc).Trim() }
    return ""
}

function Build-Messages([string] $body, [string] $userQuery) {
    if ($body.Contains('{query}')) {
        $sys = $body.Replace('{query}', $userQuery)
        return @(
            @{ role = "system"; content = $sys },
            @{ role = "user"; content = 'Follow the system instructions; output the complete result.' }
        )
    }
    return @(
        @{ role = "system"; content = $body },
        @{ role = "user"; content = $userQuery }
    )
}

function Get-DoneIds([string] $path) {
    $set = New-Object "System.Collections.Generic.HashSet[string]"
    if (-not (Test-Path $path)) { return $set }
    Get-Content -Path $path -Encoding utf8 | ForEach-Object {
        if (-not $_) { return }
        try {
            $o = $_ | ConvertFrom-Json
            if ($null -ne $o.id) { [void]$set.Add([string]$o.id) }
        }
        catch { }
    }
    return $set
}

$skillBody = Get-SkillBody $Skill
if ([string]::IsNullOrWhiteSpace($skillBody)) { throw "Skill body empty" }

$items = Get-Content -Path (Resolve-Path $Queries) -Encoding utf8 -Raw | ConvertFrom-Json
if ($items -isnot [System.Array]) { throw "Queries JSON must be an array" }

$done = if ($Resume) { Get-DoneIds $OutPath } else { New-Object "System.Collections.Generic.HashSet[string]" }
$dir = Split-Path -Parent $OutPath
if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

function Invoke-OneBatchRow {
    param(
        $Item,
        [int] $LineNo,
        [string] $SkillBody,
        [string] $Url,
        [string] $ApiKey,
        [string] $Model,
        [string] $QueryField,
        [string] $IdField,
        [double] $LitellmTimeout,
        [string] $MergeJson,
        [int] $TimeoutSec
    )
    $qid = Get-ItemId $Item $IdField $LineNo
    $q = Get-QueryText $Item $QueryField
    $messages = @(Build-Messages $SkillBody $q)

    $payload = [ordered]@{
        model        = $Model
        messages     = $messages
        stream       = $false
        tool_choice  = "none"
        tools        = @()
    }
    if ($LitellmTimeout -gt 0) {
        $payload.timeout = $LitellmTimeout
    }
    if ($MergeJson) {
        $extra = $MergeJson | ConvertFrom-Json
        foreach ($p in $extra.PSObject.Properties) {
            $payload[$p.Name] = $p.Value
        }
    }

    $json = ConvertTo-JsonUtf8Text $payload 40

    $t0 = [datetime]::UtcNow
    try {
        $resp = Invoke-RestMethod -Uri $Url -Method Post -Body $json -ContentType "application/json; charset=utf-8" `
            -Headers @{ Authorization = "Bearer $ApiKey"; Accept = "application/json; charset=utf-8" } -TimeoutSec $TimeoutSec
        $elapsed = [math]::Round(([datetime]::UtcNow - $t0).TotalSeconds, 3)
        $text = ""
        $ch = $resp.choices
        if ($ch) {
            $choice = if ($ch -is [System.Array]) { $ch[0] } else { $ch }
            $text = Get-AssistantFromMessage $choice.message
        }
        $row = [ordered]@{
            id          = $qid
            ok          = $true
            elapsed_sec = $elapsed
            model       = $resp.model
            usage       = $resp.usage
            assistant   = $text
        }
    }
    catch {
        $detail = ""
        if ($_.ErrorDetails -and $_.ErrorDetails.Message) { $detail = $_.ErrorDetails.Message }
        elseif ($_.Exception.Message) { $detail = $_.Exception.Message }
        $maxD = [math]::Min(8000, $detail.Length)
        $detailTrim = if ($maxD -le 0) { "" } else { $detail.Substring(0, $maxD) }
        $row = [ordered]@{
            id     = $qid
            ok     = $false
            error  = $_.Exception.GetType().Name
            detail = $detailTrim
        }
    }

    return [pscustomobject]@{
        SortId = $qid
        Line   = (ConvertTo-JsonUtf8Text $row 25)
    }
}

if ($ResumeSuccessOnly) {
    if ($Resume) { Write-Warning "-Resume is ignored when -ResumeSuccessOnly is set." }
    $py = Find-PythonExeForParallel
    if ($null -eq $py) {
        throw "-ResumeSuccessOnly requires a real python.exe (not the Microsoft Store stub). Install Python or run: python scripts/batch_skill_llm.py ... --resume-success-only"
    }
    $pyScript = Join-Path $PSScriptRoot "batch_skill_llm.py"
    if (-not (Test-Path -LiteralPath $pyScript)) { throw "Missing script: $pyScript" }
    $outFull = [System.IO.Path]::GetFullPath($OutPath)
    $pyArgs = @(
        $pyScript,
        "--skill", (Resolve-Path -LiteralPath $Skill).Path,
        "--queries", (Resolve-Path -LiteralPath $Queries).Path,
        "--out", $outFull,
        "--url", $Url,
        "--api-key", $ApiKey,
        "--model", $Model,
        "--workers", "$([math]::Max(1, $Workers))",
        "--litellm-timeout", "$LitellmTimeout",
        "--timeout", "$TimeoutSec",
        "--resume-success-only"
    )
    if ($QueryField) { $pyArgs += @("--query-field", $QueryField) }
    if ($IdField) { $pyArgs += @("--id-field", $IdField) }
    if ($MergeJson) { $pyArgs += @("--merge-json", $MergeJson) }
    if ($Limit -gt 0) { $pyArgs += @("--limit", "$Limit") }
    & $py @pyArgs
    exit $LASTEXITCODE
}

$lineNo = 0
$outFull = [System.IO.Path]::GetFullPath($OutPath)
$taskRows = [System.Collections.Generic.List[object]]::new()
foreach ($item in $items) {
    $lineNo++
    if ($Limit -gt 0 -and $lineNo -gt $Limit) { break }
    $qid = Get-ItemId $item $IdField $lineNo
    if ($Resume -and $done.Contains([string]$qid)) { continue }
    $taskRows.Add([pscustomobject]@{ Item = $item; LineNo = $lineNo })
}

$w = [math]::Max(1, $Workers)
if ($w -gt 1) {
    $py = Find-PythonExeForParallel
    if ($py) {
        $pyScript = Join-Path $PSScriptRoot "batch_skill_llm.py"
        $pyArgs = @(
            $pyScript,
            "--skill", (Resolve-Path -LiteralPath $Skill).Path,
            "--queries", (Resolve-Path -LiteralPath $Queries).Path,
            "--out", $outFull,
            "--url", $Url,
            "--api-key", $ApiKey,
            "--model", $Model,
            "--workers", "$w",
            "--litellm-timeout", "$LitellmTimeout",
            "--timeout", "$TimeoutSec"
        )
        if ($QueryField) { $pyArgs += @("--query-field", $QueryField) }
        if ($IdField) { $pyArgs += @("--id-field", $IdField) }
        if ($MergeJson) { $pyArgs += @("--merge-json", $MergeJson) }
        if ($Limit -gt 0) { $pyArgs += @("--limit", "$Limit") }
        if ($Resume) { $pyArgs += @("--resume") }
        & $py @pyArgs
        exit $LASTEXITCODE
    }
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeCmd) {
        $njs = Join-Path $PSScriptRoot "batch_skill_llm_parallel.mjs"
        $nodeArgs = @(
            $njs,
            "--skill", (Resolve-Path -LiteralPath $Skill).Path,
            "--queries", (Resolve-Path -LiteralPath $Queries).Path,
            "--out", $outFull,
            "--url", $Url,
            "--api-key", $ApiKey,
            "--model", $Model,
            "--workers", "$w",
            "--litellm-timeout", "$LitellmTimeout",
            "--timeout", "$TimeoutSec"
        )
        if ($QueryField) { $nodeArgs += @("--query-field", $QueryField) }
        if ($IdField) { $nodeArgs += @("--id-field", $IdField) }
        if ($Limit -gt 0) { $nodeArgs += @("--limit", "$Limit") }
        & $nodeCmd.Source @nodeArgs
        exit $LASTEXITCODE
    }
    Write-Warning "No python.exe or node for parallel; falling back to -Workers 1."
}

foreach ($tr in $taskRows) {
    $r = Invoke-OneBatchRow -Item $tr.Item -LineNo $tr.LineNo -SkillBody $skillBody -Url $Url -ApiKey $ApiKey -Model $Model `
        -QueryField $QueryField -IdField $IdField -LitellmTimeout $LitellmTimeout -MergeJson $MergeJson -TimeoutSec $TimeoutSec
    [System.IO.File]::AppendAllText($outFull, $r.Line + "`n", $utf8NoBom)
    Write-Host "done id=$($r.SortId)"
}

Write-Host "Wrote JSONL: $outFull"
