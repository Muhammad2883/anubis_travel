@echo off
title Stop Anubis Server
echo Stopping Anubis Travel Web Server...
taskkill /F /FI "WINDOWTITLE eq ANUBIS TRAVEL*" >nul 2>&1
taskkill /F /IM ssh.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8088 :8081 :8082 :5500 :3000 :5000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
if exist "%~dp0.active_port" del /F /Q "%~dp0.active_port"
echo Server has been STOPPED successfully!
pause
