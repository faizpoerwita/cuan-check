@echo off
echo Starting Cuan Check Development Server with Netlify Functions...

REM Kill any existing processes on ports 3000, 8888, and 9999
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8888" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":9999" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

REM Check if node_modules exists in client directory
if not exist "client\node_modules\" (
    echo Installing client dependencies...
    cd client
    call npm install
    cd ..
)

REM Check if node_modules exists in netlify/functions directory
if not exist "netlify\functions\node_modules\" (
    echo Installing Netlify function dependencies...
    cd netlify\functions
    call npm install
    cd ..\..
)

REM Create a package.json in root if it doesn't exist
if not exist "package.json" (
    echo Creating root package.json...
    echo {
    echo   "name": "cuan-check",
    echo   "version": "1.0.0",
    echo   "scripts": {
    echo     "dev": "cd client && npm run dev"
    echo   }
    echo } > package.json
)

REM Delete .netlify cache if it exists
if exist ".netlify" (
    echo Cleaning .netlify cache...
    rmdir /s /q .netlify
)

REM Start the Netlify dev server
echo Starting Netlify development server...
call netlify dev
