@echo off
echo ========================================
echo Starting HealthFit AI Platform
echo ========================================
echo.

echo Starting Backend Server (Port 5000)...
start "HealthFit Backend" cmd /k "cd backend && call venv\Scripts\activate && python run.py"

timeout /t 3 /nobreak >nul

echo Starting AI Service (Port 5001)...
start "HealthFit AI Service" cmd /k "cd ai-service && call venv\Scripts\activate && python app.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend (Port 3000)...
start "HealthFit Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo AI Service: http://localhost:5001
echo.
echo Login with: patient@healthfit.com / password123
echo.
echo Press any key to stop all services...
pause >nul
taskkill /f /im cmd.exe /fi "windowtitle eq HealthFit Backend*" >nul 2>&1
taskkill /f /im cmd.exe /fi "windowtitle eq HealthFit Frontend*" >nul 2>&1
taskkill /f /im cmd.exe /fi "windowtitle eq HealthFit AI Service*" >nul 2>&1
echo All services stopped.
pause