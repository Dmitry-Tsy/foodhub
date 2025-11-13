#!/bin/bash

echo "🏗️  FoodHub - Локальная сборка APK"
echo "===================================="
echo ""

# Установка переменных окружения для Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

echo "📍 Android SDK: $ANDROID_HOME"
echo "☕ Java версия:"
java -version 2>&1 | head -n 1
echo ""

# Проверка необходимых компонентов
echo "🔍 Проверка компонентов..."

if [ ! -d "$ANDROID_HOME/build-tools" ]; then
    echo "❌ Build tools не найдены"
    exit 1
fi

if [ ! -d "$ANDROID_HOME/platforms" ]; then
    echo "❌ Android platforms не найдены"
    exit 1
fi

echo "✅ Все компоненты на месте"
echo ""

# Проверка EAS CLI
if ! command -v eas &> /dev/null; then
    echo "📦 Установка EAS CLI..."
    npm install -g eas-cli
fi

echo "🚀 Запуск локальной сборки APK..."
echo "⏱️  Это займет 5-10 минут при первой сборке"
echo ""
echo "📝 Логи будут выводиться в реальном времени - отлично для дебага!"
echo ""

# Запуск локальной сборки
eas build --platform android --profile preview --local

echo ""
echo "✅ Сборка завершена!"
echo "📱 APK файл сохранен локально"

