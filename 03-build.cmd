@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 24 LTS from https://nodejs.org/ then try again.
  pause
  exit /b 1
)
node "%~dp0scripts\student-start.cjs" build
set "RWA_EXIT=%ERRORLEVEL%"
if not "%RWA_EXIT%"=="0" echo Failed. Please keep the error message above for your instructor.
pause
exit /b %RWA_EXIT%
