@echo off
chcp 65001 >nul
title مزامنة التعديلات مع GitHub - ANUBIS TRAVEL
cd /d "%~dp0"

:: Ensure Git is in PATH
set "PATH=%PATH%;C:\Users\Muhammad\MinGit\cmd;C:\Users\Muhammad\MinGit\bin"

echo ================================================================
echo        مزامنة موقع أنوبيس ترافيل مع GitHub (ANUBIS TRAVEL)
echo ================================================================
echo.

:: Check status
git status --short > "%temp%\git_status.txt" 2>&1
for %%I in ("%temp%\git_status.txt") do set SIZE=%%~zI
del "%temp%\git_status.txt" >nul 2>&1

if "%SIZE%"=="0" (
    echo [i] لا توجد تعديلات محلية جديدة تحتاج لحفظها.
    echo جاري التأكد من رفع أي تغييرات سابقة...
    git push origin main
    echo.
    echo [✓] كل شيء محدث ومتزامن بالكامل مع GitHub بنجاح!
    goto :END
)

echo تم العثور على تعديلات جديدة:
git status --short
echo.
set /p MSG="اكتب وصف التعديل (أو اضغط Enter مباشرة لاعتماد التاريخ التلقائي): "
if "%MSG%"=="" (
    set MSG=تحديث الموقع: %date% %time%
)

echo.
echo [1/3] جاري تجهيز الملفات المعدلة...
git add -A

echo [2/3] جاري حفظ التعديلات محلياً (Commit)...
git commit -m "%MSG%"

echo [3/3] جاري الرفع إلى GitHub (Push)...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ================================================================
    echo     [✓] تم رفع وتحديث جميع التعديلات على GitHub بنجاح تام!
    echo ================================================================
) else (
    echo.
    echo [!] حدث خطأ أثناء الرفع، يرجى التأكد من اتصال الإنترنت أو إعدادات الصلاحيات.
)

:END
echo.
echo اضغط أي زر للإغلاق...
pause >nul
