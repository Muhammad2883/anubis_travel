@echo off
title ANUBIS TRAVEL - Web Server
cd /d "%~dp0"
echo Starting Anubis Travel Local Server...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
