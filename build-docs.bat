@echo off
title Zensical Docs - Build Produccion
echo ============================================================
echo   Compilando Sitio Estatico con Zensical
echo ============================================================
echo.
python -m zensical build --clean
echo.
echo Compilacion terminada. El sitio se encuentra en la carpeta 'site'.
pause
