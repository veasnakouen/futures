@echo off
echo ==========================================
echo   MTP MICROSERVICES STARTUP SYSTEM
echo ==========================================

echo [1/4] Starting Discovery Server (Port 8761)...
start "MTP Discovery Server" cmd /c "cd mtp-discovery-server && .\gradlew.bat bootRun"
echo Waiting for Discovery Server to wake up...
timeout /t 20 /nobreak

echo [2/4] Starting API Gateway (Port 8080)...
start "MTP API Gateway" cmd /c "cd mtp-api-gateway && .\gradlew.bat bootRun"
echo Waiting for Gateway to initialize...
timeout /t 10 /nobreak

echo [3/8] Starting Auth Service (Port 8082)...
start "MTP Auth Service" cmd /c "cd mtp-auth-service && .\gradlew.bat bootRun"
timeout /t 5 /nobreak

echo [4/8] Starting HR Service Backend (Port 8081)...
start "MTP HR Service" cmd /c "cd spring-backend && .\gradlew.bat bootRun"
timeout /t 5 /nobreak

echo [5/8] Starting Stock Service (Port 8084)...
start "MTP Stock Service" cmd /c "cd mtp-stock-service && .\gradlew.bat bootRun"

echo [6/8] Starting Report Service (Port 8086)...
start "MTP Report Service" cmd /c "cd mtp-report-service && .\gradlew.bat bootRun"

echo [7/8] Starting School, Clinic, Hotel Services (Ports 8087, 8088, 8089)...
start "MTP School Service" cmd /c "cd mtp-school-service && .\gradlew.bat bootRun"
start "MTP Clinic Service" cmd /c "cd mtp-clinic-service && .\gradlew.bat bootRun"
start "MTP Hotel Service" cmd /c "cd mtp-hotel-service && .\gradlew.bat bootRun"

echo [8/8] Starting React Frontend...
start "MTP React Frontend" cmd /c "cd react-frontend && npm run dev"

echo ==========================================
echo   ALL SYSTEMS ARE STARTING! 🚀
echo   Please wait a moment for the windows 
echo   to finish loading.
echo ==========================================
pause
