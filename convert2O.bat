@echo off
setlocal enabledelayedexpansion

:: Remove quotes from the input filename
set "filename=%~1"

:: Check if the file exists in the 'fsrc' directory
if exist "fsrc\%filename%" (
    :: Obfuscate the JavaScript file
    javascript-obfuscator "fsrc\%filename%" --output "src\%filename%"
    echo Obfuscation complete: src\%filename%
) else (
    :: Display an error message if the file doesn't exist
    echo File %filename% does not exist or is not a valid .js file.
)
