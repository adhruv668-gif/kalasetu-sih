@echo off
set JAVA_HOME=C:\Users\anand\.jdk\jdk-21.0.12.1+1
set ANDROID_HOME=C:\Users\anand\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%PATH%
cd /d "%~dp0..\android"
call gradlew.bat assembleDebug
