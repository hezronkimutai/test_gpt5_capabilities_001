@echo off
setlocal enabledelayedexpansion

echo Starting Full Stack Application...

:: Get the directory where the script is located
set "SCRIPT_DIR=%~dp0"

:: Function to check and install dependencies
:install_dependencies
set "dir=%~1"
set "name=%~2"

if not exist "%dir%\node_modules" (
    echo Installing %name% dependencies...
    cd /d "%dir%"
    call npm install
    if errorlevel 1 (
        echo Failed to install %name% dependencies
        exit /b 1
    )
) else (
    echo %name% dependencies already installed
)
goto :eof

:: Install dependencies for server
echo Checking server dependencies...
call :install_dependencies "%SCRIPT_DIR%server" "server"

:: Install dependencies for client
echo Checking client dependencies...
call :install_dependencies "%SCRIPT_DIR%client" "client"

echo All dependencies are ready!
echo Starting server and client...

:: Start the server in background
echo Starting Server on port 3000...
cd /d "%SCRIPT_DIR%server"
start "Server" cmd /c "npm run dev"

:: Wait a bit for the server to start
timeout /t 3 /nobreak >nul

:: Start the client in background
echo Starting React client (Vite dev server)...
cd /d "%SCRIPT_DIR%client"
start "React Client" cmd /c "npm run dev"

:: Wait a bit for the client to start
timeout /t 2 /nobreak >nul

echo.
echo ✅ Application is starting up!
echo Server: http://localhost:3000
echo Client: http://localhost:5173
echo.
echo Both server and client are running in separate windows.
echo Close those windows to stop the applications.

pause
