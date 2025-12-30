@echo off
setlocal enabledelayedexpansion

:: Remove quotes from the input filename
set "filename=%~1"

:: Check if the file exists in the 'fsrc' directory
if exist "fsrc\%filename%" (
    :: Obfuscate the JavaScript file with advanced options
    javascript-obfuscator "fsrc\%filename%" --output "src\%filename%" ^
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
    echo Obfuscation complete: src\%filename%
) else (
    :: Display an error message if the file doesn't exist
    echo File %filename% does not exist or is not a valid .js file.
)
