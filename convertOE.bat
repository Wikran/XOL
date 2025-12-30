@echo off
if not exist src mkdir src
for %%f in (fsrc\*.js) do (
    @echo off
    rem echo Processing: fsrc\%%~nxf
    @echo off
    @echo off
    javascript-obfuscator "fsrc\%%~nxf" --output "src\%%~nxf" ^
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
@echo on
@echo on
@echo on



