@echo off
setlocal EnableDelayedExpansion

set "src=C:\HTML\XOL"
set "dest=C:\HTML\XOL\html4upload"

REM Create destination folder if it doesn't exist
if not exist "%dest%" (
    mkdir "%dest%"
)

REM Delete all files in the destination folder
del /q "%dest%\*.*"

REM Comma-separated list of files
set "files=index.html,main.html,help.html,DECREQFRM.html,DECREQHOD.html,TCUA101.html,MXXXADTRF.html,MXXINCOME.html,MXXXEE200A.html,MXXXEE123.html,MXXALLTRF.html,RPOA772.html,MXXALLFB.html,LXOXTP779.html,TCHATBOT.html,MXHRINCOME.html,MHODEE123.html,MXHDINCOME.html,EMOE701.html,MXXALLFA.html,MXEDITFA.html,MXXXEE124.html,MXXTRF200.html,MXXXEE200.html,MHRXEE123.html,MXXXEE300.html,MXXXHRTRF.html,HTMLedit.html,NITL901232.html,EAEM7311.html,MMXXEE124.html,UEM9001.html,SRAE120.html,SYSRWTABLE.html,MXPPMER.html,LACT771.html,MXXXEE12T.html,MXXXEETRF.html"

set success=0

for %%f in (%files%) do (
    if exist "%src%\%%f" (
        copy /Y "%src%\%%f" "%dest%" >nul
        set /a success+=1
    ) else (
        echo Not found: %%f
    )
)

echo.
echo Total copied successfully: !success!

endlocal
@REM pause


