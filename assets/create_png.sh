#!/bin/bash

# Базовый 1x1 PNG в base64
base64_png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

# Создаем базовые файлы
echo $base64_png | base64 -d > temp.png

# Используем sips для изменения размера
sips -z 1024 1024 temp.png --out icon.png 2>/dev/null
cp icon.png adaptive-icon.png
sips -z 2778 1284 temp.png --out splash.png 2>/dev/null
sips -z 48 48 temp.png --out favicon.png 2>/dev/null

rm temp.png
echo "✅ PNG файлы созданы"
ls -lh *.png
