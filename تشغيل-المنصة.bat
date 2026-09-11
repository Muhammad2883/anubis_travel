@echo off
title ANUBIS TRAVEL - تشغيل المنصة الحديثة
cd /d "%~dp0frontend"
set "PATH=%PATH%;C:\Users\Muhammad\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64"

echo ================================================================
echo           ANUBIS TRAVEL TOURS - MODERN WEB PLATFORM
echo ================================================================
echo.
echo [1/2] فتح المنصة في المتصفح...
start "" "http://localhost:3000"
start "" "http://localhost:3000/admin"
echo.
echo [2/2] جاري تشغيل خادم Next.js...
npm run dev -- -p 3000
pause
