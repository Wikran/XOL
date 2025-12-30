@echo off
setlocal enabledelayedexpansion

:: Require filename argument
if "%~1"=="" (
    echo Usage: %~nx0 filename.js
    exit /b 1
)

set "filename=%~1"

:: Ensure output folder exists
if not exist src mkdir src

:: Check if the file exists in 'fsrc'
if exist "fsrc\%filename%" (
    echo Obfuscating %filename%...
    "C:\Users\Wikran\AppData\Roaming\npm\javascript-obfuscator.cmd" "fsrc\%filename%" --output "src\%filename%" ^
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
    echo Obfuscation complete: src\%filename%
) else (
    echo File fsrc\%filename% does not exist.
)
