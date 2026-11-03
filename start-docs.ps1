# ============================================================
# Script para iniciar el servidor de desarrollo local Zensical
# ============================================================
Write-Host "Iniciando servidor local de documentacion Zensical..." -ForegroundColor Cyan
Write-Host "Abre tu navegador en: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Presiona Ctrl + C para detener el servidor.`n" -ForegroundColor Yellow

python -m zensical serve
