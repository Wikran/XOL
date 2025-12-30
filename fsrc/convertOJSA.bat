@echo off
setlocal enabledelayedexpansion

:: ===============================
:: Obfuscate ALL .js files in fsrc\ folder
:: Outputs obfuscated files to src\ folder
:: ===============================

echo 🔄 Starting batch obfuscation...

:: Ensure output folder exists
if not exist "src" (
    mkdir src
)

:: Loop through each .js file in fsrc\
for %%F in (fsrc\*.js) do (
    set "filename=%%~nxF"
    echo 🔐 Obfuscating %%F → src\!filename!

    javascript-obfuscator "%%F" --output "src\!filename!" ^
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

    if !errorlevel! neq 0 (
        echo ❌ Failed to obfuscate %%F
    ) else (
        echo ✅ Done: src\!filename!
    )
)

echo 🔚 All files processed.
pause
