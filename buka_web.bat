@echo off
title KOMPUTASI.ID - Media Pembelajaran Informatika Kelas X
echo ============================================================
echo   KOMPUTASI.ID - Wahana Belajar Berpikir Komputasional
echo   Karya Inovasi Pembelajaran Informatika Kelas X (Fase E)
echo   Seminar Pendidikan Profesi Guru (PPG)
echo ============================================================
echo.
cd /d "%~dp0"

echo [1/2] Menyiapkan Web Server Lokal agar video YouTube dapat diputar...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [2/2] Server aktif pada: http://localhost:8000
    echo Membuka browser otomatis...
    echo.
    echo ============================================================
    echo CATATAN PENTING:
    echo - Seluruh video YouTube dapat diputar lancar tanpa 'Configuration Error'.
    echo - Biarkan jendela hitam ini tetap terbuka selama menggunakan web.
    echo - Tutup jendela ini jika sesi belajar telah selesai.
    echo ============================================================
    start "" "http://localhost:8000/index.html"
    python -m http.server 8000
) else (
    echo [INFO] Python tidak terdeteksi, membuka file secara langsung...
    start "" "%~dp0index.html"
)
