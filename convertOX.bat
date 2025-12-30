@echo off
if not exist src mkdir src
for %%f in (fsrc\*.js) do (
    @echo off
    rem echo Processing: fsrc\%%~nxf
    @echo off
    @echo off
    javascript-obfuscator "fsrc\%%~nxf" --output "src\%%~nxf" ^
        --compact true ^
        --control-flow-flattening true ^
        --control-flow-flattening-threshold 1 ^
        --dead-code-injection true ^
        --dead-code-injection-threshold 1 ^
        --debug-protection true ^
        --debug-protection-interval 0 ^
        --disable-console-output true ^
        --identifier-names-generator hexadecimal ^
        --split-strings true ^
        --string-array true ^
        --string-array-encoding base64 ^
        --unicode-escape-sequence true

    REM ✅ Correct error handling:
    if %errorlevel% NEQ 0 (
        echo Failed to obfuscate: fsrc\%%~nxf
        echo ---------------------------------
    ) else (
        echo Obfuscation complete: src\%%~nxf
        echo ---------------------------------
    )
    @echo off
)
echo on



