@echo off
setlocal enabledelayedexpansion

:: Ensure 'src' directory exists
if not exist src mkdir src

:: Loop through all .js files in 'fsrc' directory
for %%f in (fsrc\*.js) do (
    set "filename=%%~nxf"

    :: Check if the file exists before obfuscating
    if exist "fsrc\!filename!" (
        echo Obfuscating: fsrc\!filename!
        javascript-obfuscator "fsrc\!filename!" --output "src\!filename!" ^
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

        echo Obfuscation complete: src\!filename!
    ) else (
        echo File !filename! does not exist or is not a valid .js file.
    )
)

echo All JavaScript files processed.
pause






