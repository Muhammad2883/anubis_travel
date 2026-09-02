@echo off
title ANUBIS TRAVEL - Live Mobile Link & QR
cd /d "%~dp0"
echo ================================================================
echo    Starting Anubis Travel Mobile Server & Live Link...
echo ================================================================

:: Stop any old instances first
taskkill /F /IM ssh.exe >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq ANUBIS TRAVEL - Web Server*" >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8088 :8081 :8082 :5500 :3000 :5000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

if exist "%~dp0.active_port" del /F /Q "%~dp0.active_port"

:: Start local server in background window
start "ANUBIS TRAVEL - Web Server" /min powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
timeout /t 3 >nul

:: Read active port
set PORT=8088
if exist "%~dp0.active_port" (
    set /p PORT=<"%~dp0.active_port"
)

echo.
echo [OK] Local Server running on port: %PORT%
echo Connecting to live ultra-fast tunnel for Mobile...
echo (You can scan the QR code that appears on your phone!)
echo ================================================================
echo.

:: Launch SSH tunnel via Pinggy with active port and backend header rewrite
ssh -p 443 -R0:localhost:%PORT% -o StrictHostKeyChecking=no -o ServerAliveInterval=30 a.pinggy.io b:localhost:%PORT%

pause
