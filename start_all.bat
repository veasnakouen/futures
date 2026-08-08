@echo off
echo ==========================================
echo   MTP FLYWEIGHT MICROSERVICES SYSTEM
echo ==========================================

echo [1/4] Starting Eureka Discovery Server (Port 8761)...
set JAVA_TOOL_OPTIONS=-Xmx256m -Xms64m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC -Deureka.server.response-cache-update-interval-ms=3000
start "MTP Discovery Server" cmd /k "cd mtp-discovery-server && .\gradlew.bat bootRun"

echo Waiting 5 seconds for Discovery Server to initialize...
timeout /t 5 /nobreak

echo [2/4] Starting Backend Core Services...
set JAVA_TOOL_OPTIONS=-Xmx512m -Xms256m -XX:MaxMetaspaceSize=384m -XX:+UseG1GC -Dspring.main.lazy-initialization=true -Deureka.instance.lease-renewal-interval-in-seconds=5 -Deureka.client.registry-fetch-interval-seconds=5

start "MTP Auth Service" cmd /k "cd mtp-auth-service && .\gradlew.bat bootRun"
start "MTP Core Service" cmd /k "cd spring-backend && .\gradlew.bat bootRun"
start "MTP School Service" cmd /k "cd mtp-school-service && .\gradlew.bat bootRun"
start "MTP Stock Service" cmd /k "cd mtp-stock-service && .\gradlew.bat bootRun"

echo Waiting 10 seconds for Backend Services to boot and register...
timeout /t 10 /nobreak

echo [3/4] Starting API Gateway (Port 8080)...
set JAVA_TOOL_OPTIONS=-Xmx256m -Xms128m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC -Dspring.main.lazy-initialization=true -Deureka.instance.lease-renewal-interval-in-seconds=5 -Deureka.client.registry-fetch-interval-seconds=5
start "MTP API Gateway" cmd /k "cd mtp-api-gateway && .\gradlew.bat bootRun"

echo Waiting 5 seconds for API Gateway to fetch routes...
timeout /t 5 /nobreak

echo [4/4] Starting React Frontend...
set JAVA_TOOL_OPTIONS=
start "MTP React Frontend" cmd /k "cd react-frontend && npm run dev"

echo ==========================================
echo   ALL FLYWEIGHT SYSTEMS ARE STARTING!
echo   All terminal windows will remain open.
echo ==========================================
pause
