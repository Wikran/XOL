@echo off
for %%f in (fsrc\*.js) do (
  javascript-obfuscator "%%f" --output "src\%%~nxf"
)
