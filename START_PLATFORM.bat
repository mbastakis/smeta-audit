@echo off
cls
echo ========================================
echo   SMETA Compliance Platform
echo   Starting application...
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detected: 
node --version
echo.

REM Navigate to backend directory
cd /d "%~dp0backend"

REM Check if backend is built
if not exist "dist\server.js" (
    echo ERROR: Backend not built!
    echo.
    echo Please run the following commands first:
    echo   cd backend
    echo   npm run build
    echo.
    cd ..
    pause
    exit /b 1
)

REM Set environment to production
set NODE_ENV=production

REM Start the server
echo Starting server on http://localhost:5001...
echo.
start "SMETA Platform Server" /MIN cmd /k "node dist/server.js"

REM Wait for server to start
timeout /t 3 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:5001

echo.
echo ========================================
echo   Platform is running!
echo ========================================
echo.
echo The application is now running at:
echo http://localhost:5001
echo.
echo To stop the server, close the "SMETA Platform Server" window.
echo.
pause
