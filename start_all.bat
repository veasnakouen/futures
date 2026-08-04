@echo off
echo ==========================================
echo   MTP FLYWEIGHT MICROSERVICES SYSTEM
echo ==========================================

echo [1/6] Starting Eureka Discovery Server (Port 8761)...
set JAVA_TOOL_OPTIONS=-Xmx256m -Xms64m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC
start "MTP Discovery Server" cmd /k "cd mtp-discovery-server && .\gradlew.bat bootRun"

echo [2/6] Starting API Gateway (Port 8080)...
set JAVA_TOOL_OPTIONS=-Xmx256m -Xms128m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC
start "MTP API Gateway" cmd /k "cd mtp-api-gateway && .\gradlew.bat bootRun"

echo [3/6] Starting Auth Service (Port 8082)...
set JAVA_TOOL_OPTIONS=-Xmx256m -Xms128m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC
start "MTP Auth Service" cmd /k "cd mtp-auth-service && .\gradlew.bat bootRun"

echo [4/6] Starting Core Service (Port 8081)...
set JAVA_TOOL_OPTIONS=-Xmx768m -Xms256m -XX:MaxMetaspaceSize=384m -XX:+UseG1GC
start "MTP Core Service" cmd /k "cd spring-backend && .\gradlew.bat bootRun"

echo [5/6] Starting School Service (Port 8087)...
set JAVA_TOOL_OPTIONS=-Xmx256m -Xms128m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC
start "MTP School Service" cmd /k "cd mtp-school-service && .\gradlew.bat bootRun"

echo [6/6] Starting React Frontend...
set JAVA_TOOL_OPTIONS=
start "MTP React Frontend" cmd /k "cd react-frontend && npm run dev"

echo ==========================================
echo   ALL FLYWEIGHT SYSTEMS ARE STARTING!
echo   All 6 terminal windows will remain open.
echo ==========================================
pause
