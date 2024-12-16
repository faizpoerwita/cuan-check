@echo off
echo Starting development servers...

:: Start Netlify Dev in a new window
start cmd /k "cd %~dp0 && netlify dev"

:: Wait for a moment to let Netlify Dev start
timeout /t 5 /nobreak

echo Servers are running!
echo.
echo Access your app at http://localhost:8888
echo Press Ctrl+C in the respective windows to stop the servers
echo.
