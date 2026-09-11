@echo off
title ANUBIS TRAVEL - Modern Web Platform (Next.js)
cd /d "%~dp0\frontend"
set "PATH=%PATH%;C:\Users\Muhammad\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64"

echo ================================================================
echo           ANUBIS TRAVEL TOURS - MODERN WEB PLATFORM
echo                 (Next.js 14+ / React 19)
echo ================================================================
echo.
echo [1/2] Starting Next.js High-Performance Server...
start "" "http://localhost:3000"
npm run dev -- -p 3000

pause
