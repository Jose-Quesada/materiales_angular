# ============================================================
# Script para compilar el sitio estatico para produccion
# ============================================================
Write-Host "Compilando documentacion con Zensical..." -ForegroundColor Cyan

python -m zensical build --clean

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nCompilacion completada con exito." -ForegroundColor Green
    Write-Host "Los archivos estaticos generados se encuentran en: documentacion-angular\site" -ForegroundColor Cyan
} else {
    Write-Host "`nError durante la compilacion." -ForegroundColor Red
}
