<#
  Script: backup_restore.ps1
  Propósito: crear backups de Postgres y de carpetas de datos (n8n_data, postgres_data, letsencrypt)
  Uso: ejecutar desde la carpeta `n8n-docker`:
    ./scripts/backup_restore.ps1 -Action backup
    ./scripts/backup_restore.ps1 -Action restore -BackupPath .\backups\2026-01-01_120000
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('backup','restore')]
    [string]$Action,
    [string]$BackupPath
)

Set-StrictMode -Version Latest

$root = Join-Path -Path $PSScriptRoot -ChildPath ".."
$root = (Resolve-Path $root).ProviderPath

$secretsDir = Join-Path $root 'secrets'
$pgPassFile = Join-Path $secretsDir 'postgres_password'

if (-not (Test-Path (Join-Path $root 'docker-compose.prod.yml'))) {
    Write-Error "No se encontró docker-compose.prod.yml en $root"
    exit 1
}

Function Get-Timestamp { return (Get-Date).ToString('yyyy-MM-dd_HHmmss') }

if ($Action -eq 'backup') {
    $ts = Get-Timestamp
    $outDir = Join-Path $root "backups\$ts"
    New-Item -Path $outDir -ItemType Directory -Force | Out-Null

    if (-not (Test-Path $pgPassFile)) { Write-Warning "No existe $pgPassFile. Copia el secreto antes de proceder." }

    $pgPass = Get-Content $pgPassFile -Raw
    $env:PGPASSWORD = $pgPass

    Write-Host "Dumping Postgres..."
    $dumpPath = Join-Path $outDir 'postgres_dump.sql'
    docker compose -f $root\docker-compose.prod.yml exec -T db pg_dump -U $env:POSTGRES_USER -d $env:POSTGRES_DB > $dumpPath

    Write-Host "Comprimiendo carpetas de datos..."
    $items = @('n8n_data','postgres_data','letsencrypt') | ForEach-Object { Join-Path $root $_ }
    foreach ($item in $items) {
        if (Test-Path $item) {
            $name = Split-Path $item -Leaf
            $zip = Join-Path $outDir "$name.zip"
            Compress-Archive -Path $item -DestinationPath $zip -Force
        }
    }

    Write-Host "Backup creado en: $outDir"
    Remove-Variable PGPASSWORD -ErrorAction SilentlyContinue
    exit 0
}

if ($Action -eq 'restore') {
    if (-not $BackupPath) { Write-Error "Para restore necesitas indicar -BackupPath <ruta_del_backup>"; exit 1 }
    $backupFull = Resolve-Path $BackupPath

    Write-Host "Restaurando desde: $backupFull"

    Write-Host "Deteniendo servicios..."
    docker compose -f $root\docker-compose.prod.yml down

    Write-Host "Restaurando carpetas de datos (sobrescribiendo)..."
    $zipFiles = Get-ChildItem -Path $backupFull -Filter *.zip -File -ErrorAction SilentlyContinue
    foreach ($zf in $zipFiles) {
        $targetName = [System.IO.Path]::GetFileNameWithoutExtension($zf.Name)
        $targetPath = Join-Path $root $targetName
        if (Test-Path $targetPath) { Remove-Item -Recurse -Force $targetPath }
        Expand-Archive -Path $zf.FullName -DestinationPath $targetPath -Force
    }

    $dump = Join-Path $backupFull 'postgres_dump.sql'
    if (Test-Path $dump) {
        $pgPass = Get-Content $pgPassFile -Raw
        $env:PGPASSWORD = $pgPass
        Write-Host "Levantar servicios para restaurar DB..."
        docker compose -f $root\docker-compose.prod.yml up -d db
        Start-Sleep -Seconds 5
        Write-Host "Restaurando dump en Postgres..."
        Get-Content $dump -Raw | docker compose -f $root\docker-compose.prod.yml exec -T db psql -U $env:POSTGRES_USER -d $env:POSTGRES_DB
        Remove-Variable PGPASSWORD -ErrorAction SilentlyContinue
    } else {
        Write-Warning "No se encontró postgres_dump.sql en el backup."
    }

    Write-Host "Arrancando todos los servicios..."
    docker compose -f $root\docker-compose.prod.yml up -d
    Write-Host "Restore completado."
    exit 0
}
