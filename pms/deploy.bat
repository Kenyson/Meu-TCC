@echo off
chcp 65001 >nul
echo ========================================
echo  Build e Deploy - PMS Frontend
echo ========================================

cd /d "C:\Users\Kenyson\Desktop\pharma-system\Meu-TCC\pms"

echo.
echo [1/3] Building Angular...
call ng build --configuration production --base-href /PMS/
if errorlevel 1 (
    echo ERRO no build!
    pause
    exit /b 1
)

echo.
echo [2/3] Preparando git...
cd /d "C:\Users\Kenyson\Desktop\pharma-system\Meu-TCC\pms\dist\pms"
git init
git checkout -b gh-pages 2>nul
git add .
git commit -m "Deploy %date% %time%"

echo.
echo [3/3] Enviando para gh-pages...
git remote remove origin 2>nul
git remote add origin https://github.com/Kenyson/PMS.git
git push -f origin gh-pages

echo.
echo ========================================
echo  Deploy concluido!
echo  URL: https://kenyson.github.io/PMS/
echo ========================================
pause
