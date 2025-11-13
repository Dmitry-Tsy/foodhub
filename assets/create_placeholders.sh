#!/bin/bash
# Создаем простые placeholder PNG файлы

# icon.png (1024x1024)
cat > icon.png << 'ICON'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==
ICON

# adaptive-icon.png (1024x1024)
cp icon.png adaptive-icon.png

# splash.png (1284x2778)
cp icon.png splash.png

# favicon.png (48x48)
cp icon.png favicon.png

echo "Placeholder files created!"
