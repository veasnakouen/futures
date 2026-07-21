@echo off
echo ==========================================
echo   MTP FLYWEIGHT MICROSERVICES SYSTEM
echo ==========================================

:: Enable Lazy Initialization globally to drastically speed up startup time
set SPRING_MAIN_LAZY_INITIALIZATION=true

echo [1/5] Starting Eureka Discovery Server (Port 8761)...
set JAVA_TOOL_OPTIONS=-Xmx128m -Xms64m -XX:MaxMetaspaceSize=128m -XX:ReservedCodeCacheSize=64m -Xss512k -XX:TieredStopAtLevel=1
start "MTP Discovery Server" cmd /c "cd mtp-discovery-server && .\gradlew.bat bootRun"

echo [2/5] Starting API Gateway (Port 8080)...
:: Gateway is lightweight - minimal memory
set JAVA_TOOL_OPTIONS=-Xmx192m -Xms96m -XX:MaxMetaspaceSize=128m -XX:ReservedCodeCacheSize=64m -Xss512k -XX:TieredStopAtLevel=1
start "MTP API Gateway" cmd /c "cd mtp-api-gateway && .\gradlew.bat bootRun"

echo [3/5] Starting Auth Service (Port 8082)...
:: Auth service is lightweight - minimal memory
set JAVA_TOOL_OPTIONS=-Xmx192m -Xms96m -XX:MaxMetaspaceSize=128m -XX:ReservedCodeCacheSize=64m -Xss512k -XX:TieredStopAtLevel=1
start "MTP Auth Service" cmd /c "cd mtp-auth-service && .\gradlew.bat bootRun"

echo [4/6] Starting Core Service (Port 8081)...
:: Core (spring-backend monolith) needs more memory for all sub-modules
set JAVA_TOOL_OPTIONS=-Xmx512m -Xms256m -XX:MaxMetaspaceSize=384m -XX:ReservedCodeCacheSize=128m -Xss512k -XX:TieredStopAtLevel=1
start "MTP Core Service" cmd /c "cd spring-backend && .\gradlew.bat bootRun"

echo [5/6] Starting School Service (Port 8087)...
:: School service is lightweight - minimal memory
set JAVA_TOOL_OPTIONS=-Xmx192m -Xms96m -XX:MaxMetaspaceSize=128m -XX:ReservedCodeCacheSize=64m -Xss512k -XX:TieredStopAtLevel=1
start "MTP School Service" cmd /c "cd mtp-school-service && .\gradlew.bat bootRun"

echo [6/6] Starting React Frontend...
:: Clear JAVA_TOOL_OPTIONS so Node/npm is not affected
set JAVA_TOOL_OPTIONS=
start "MTP React Frontend" cmd /c "cd react-frontend && npm run dev"

echo ==========================================
echo   ALL FLYWEIGHT SYSTEMS ARE STARTING!
echo   Please wait ~60 seconds for all windows
echo   to finish loading before using the app.
echo ==========================================
pause
