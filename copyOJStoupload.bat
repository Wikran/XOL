@echo off
setlocal EnableDelayedExpansion

set "src=C:\HTML\XOL\src\"
set "dest=C:\HTML\XOL\src\js4upload"

REM Create destination folder if it doesn't exist
if not exist "%dest%" (
    mkdir "%dest%"
)

REM Delete all files in the destination folder
del /q "%dest%\*.*"

REM Comma-separated list of files
@REM set "files=index.html,main.html,help.html,TRVAGENT.html,TCUA101.html,MXXXADTRF.html,MXXINCOME.html,MXXXEE200A.html,MXXXEE123.html,MXXALLTRF.html,RPOA772.html,MXXALLFB.html,LXOXTP779.html,TCHATBOT.html,MXHRINCOME.html,MHODEE123.html,MXHDINCOME.html,EMOE701.html,MXXALLFA.html,MXEDITFA.html,MXXXEE124.html,MXXTRF200.html,MXXXEE200.html,MHRXEE123.html,MXXXEE300.html,MXXXHRTRF.html,HTMLedit.html,NITL901232.html,EAEM7311.html,MMXXEE124.html,UEM9001.html,SRAE120.html,SYSRWTABLE.html,MXPPMER.html,LACT771.html,MXXXEE12T.html,MXXXEETRF.html"
set "files=index.js,main.js,DECREQFRM.js,DECREQHOD.js,TCUA101.js,MXXXADTRF.js,MXXINCOME.js,MXXXEE200A.js,MXXXEE123.js,MXXALLTRF.js,RPOA772.js,MXXALLFB.js,LXOXTP779.js,TCHATBOT.js,MXHRINCOME.js,MHODEE123.js,MXHDINCOME.js,EMOE701.js,MXXALLFA.js,MXEDITFA.js,MXXXEE124.js,MXXTRF200.js,MXXXEE200.js,MHRXEE123.js,MXXXEE300.js,MXXXHRTRF.js,NITL901232.js,EAEM7311.js,MMXXEE124.js,UEM9001.js,SRAE120.js,MXPPMER.js,LACT771.js,MXXXEE12T.js,MXXXEETRF.js"

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
