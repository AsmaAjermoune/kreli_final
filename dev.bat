@echo off
title LocaMat Dev

echo Starting LocaMat (backend :5000 + frontend :3000)...

start "LocaMat Backend" cmd /k "cd /d %~dp0backend && npm run dev"
start "LocaMat Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Both servers launching in separate windows.
echo   Backend  -> http://localhost:5000
echo   Frontend -> http://localhost:3000
