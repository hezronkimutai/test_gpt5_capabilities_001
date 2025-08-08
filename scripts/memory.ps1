#!/usr/bin/env pwsh
param(
  [Parameter(Position=0)][string]$cmd,
  [Parameter(Position=1)][string]$arg1
)

$Root = Resolve-Path "$PSScriptRoot/.."
$MemoFile = Join-Path $Root "docs/memory-bank.md"

function Timestamp {
  (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
}

switch ($cmd) {
  'add' {
    if (-not $arg1) { Write-Error 'Usage: ./memory.ps1 add "your note"'; exit 1 }
    $author = $env:GIT_AUTHOR_NAME
    if (-not $author) { $author = $env:USERNAME }
    if (-not $author) { $author = 'unknown' }
    Add-Content -Path $MemoFile -Value "`n### $(Timestamp) — $author`n`n- $arg1"
    Write-Host 'Added memory entry.'
  }
  'list' {
    $count = if ($arg1) { [int]$arg1 } else { 20 }
    Write-Host "Showing last $count memory lines from $MemoFile:"
    if (Test-Path $MemoFile) { Get-Content $MemoFile -Tail $count | ForEach-Object { $_ } }
  }
  Default {
    Write-Host @'
Usage:
  ./memory.ps1 add "your note here"
  ./memory.ps1 list [lines]
'@
    exit 1
  }
}
