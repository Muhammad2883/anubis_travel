@echo off
title ANUBIS TRAVEL - GitHub Auto Sync
cd /d "%~dp0"
set "PATH=%PATH%;C:\Users\Muhammad\MinGit\cmd;C:\Users\Muhammad\MinGit\bin"

echo ================================================================
echo           ANUBIS TRAVEL - Sync with GitHub
echo ================================================================
echo.

git status --porcelain > "%temp%\git_status.tmp" 2>&1
for %%I in ("%temp%\git_status.tmp") do set SIZE=%%~zI
del "%temp%\git_status.tmp" >nul 2>&1

if "%SIZE%"=="0" (
    echo [i] No new local changes found.
    echo Checking remote sync...
    git push origin main
    echo.
    echo [OK] Everything is already up to date on GitHub!
    goto :END
)

echo Changed files:
git status -s
echo.

set "MSG=Update website"
set /p "USER_NOTE=Enter note (or press Enter for default): "
if defined USER_NOTE set "MSG=%USER_NOTE%"

echo.
echo [1/3] Adding files...
git add -A
echo [2/3] Committing...
git commit -m "%MSG%"
echo [3/3] Pushing to GitHub...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ================================================================
    echo  [SUCCESS] All changes successfully synced to GitHub!
    echo ================================================================
) else (
    echo.
    echo [ERROR] Push failed. Please check internet connection.
)

:END
echo.
pause
