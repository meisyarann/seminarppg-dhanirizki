@echo off
title KOMPUTASI.ID - Local Web Server
echo ============================================================
echo   KOMPUTASI.ID - Menjalankan Local Web Server (Python)
echo ============================================================
echo.
echo Server aktif pada: http://localhost:8000
echo Membuka browser otomatis...
echo Tekan Ctrl+C di jendela ini jika ingin menghentikan server.
echo.
start "" "http://localhost:8000/index.html"
python -m http.server 8000
pause
