@echo off
echo ==========================================
echo   BUILDING PRODUCTION NATIVE IMAGES
echo ==========================================
echo This requires GraalVM and Microsoft Visual Studio C++ Build Tools.
echo Compilation will take several minutes per service.

cd spring-backend
call .\gradlew.bat nativeCompile
cd ..

echo Native executable generated in spring-backend\build\native\nativeCompile
pause
