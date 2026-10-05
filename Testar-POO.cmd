@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\apresentar-testes-poo.ps1"
set "test_result=%errorlevel%"
if /I not "%~1"=="--sem-pausa" pause
exit /b %test_result%
