@echo off
setlocal enabledelayedexpansion

:: ===============================
:: Batch script to obfuscate a JS file
:: Usage: covertOJS.bat yourfile.js
:: ===============================

:: Get the input filename (strip quotes if any)
set "filename=%~1"

:: Check if the file has .js extension
if /I not "%~x1"==".js" (
    echo ❌ Error: Input file must be a .js file
    goto end
)

:: Input and output directories
set "inputPath=fsrc\%filename%"
set "outputPath=src\%filename%"

:: Check if input file exists
if not exist "%inputPath%" (
    echo ❌ File not found: %inputPath%
    goto end
)

:: Run obfuscation
echo 🔐 Obfuscating "%inputPath%" ...
javascript-obfuscator "%inputPath%" --output "%outputPath%" ^
    --compact true ^
    --control-flow-flattening false ^
    --dead-code-injection false ^
    --debug-protection true ^
    --disable-console-output true ^
    --identifier-names-generator hexadecimal ^
    --split-strings false ^
    --string-array true ^
    --string-array-encoding base64 ^
    --unicode-escape-sequence false

if %errorlevel%==0 (
    echo ✅ Obfuscation complete: "%outputPath%"
) else (
    echo ❌ Obfuscation failed.
)

:end
pause
