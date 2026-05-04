<#
  Script: create_secrets.ps1
  Propósito: crear ./secrets/postgres_password y ./secrets/n8n_basic_auth_password
  Uso: ejecutar en PowerShell desde la carpeta `n8n-docker`:
    ./scripts/create_secrets.ps1
#>

Param()

Set-StrictMode -Version Latest

$secretsDir = Join-Path -Path $PSScriptRoot -ChildPath "..\secrets"
$secretsDir = (Resolve-Path $secretsDir).ProviderPath

If (-not (Test-Path $secretsDir)) {
    New-Item -Path $secretsDir -ItemType Directory -Force | Out-Null
}

Function Read-SecurePlainText([string]$prompt) {
    $secure = Read-Host -AsSecureString -Prompt $prompt
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    }
    finally {
        if ($bstr) { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
    }
}

Write-Host "Creando secrets en: $secretsDir"

$pgpass = Read-SecurePlainText "Contraseña Postgres (secreto)"
$n8npass = Read-SecurePlainText "Contraseña básica n8n (secreto)"

$pgFile = Join-Path $secretsDir 'postgres_password'
$n8nFile = Join-Path $secretsDir 'n8n_basic_auth_password'

[System.IO.File]::WriteAllText($pgFile, $pgpass)
[System.IO.File]::WriteAllText($n8nFile, $n8npass)

Write-Host "Estableciendo permisos restringidos (icacls)..."
try {
    icacls $pgFile /inheritance:r /grant:r "$env:USERNAME:(R)" | Out-Null
    icacls $n8nFile /inheritance:r /grant:r "$env:USERNAME:(R)" | Out-Null
} catch {
    Write-Warning "No se pudo aplicar icacls. Ajusta permisos manualmente si es necesario."
}

Write-Host "Secrets creados: $pgFile, $n8nFile"
Write-Host "Asegúrate de no commitear la carpeta ./secrets (está en .gitignore)."
