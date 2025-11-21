# Инструкция по сборке APK вручную

## Проблема

Сборка через EAS Build и Gradle падает из-за проблемы с `expo-module-gradle-plugin`. 

## Решение 1: Через Android Studio (РЕКОМЕНДУЕТСЯ)

1. Откройте проект в Android Studio:
   ```bash
   open -a "Android Studio" /Users/dmitrytsymlyakov/AndroidStudioProjects/FoodHub/android
   ```

2. Дождитесь синхронизации Gradle

3. В меню: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

4. После сборки APK будет в:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

5. Скопируйте в builds/ с нужным именем:
   ```bash
   cp android/app/build/outputs/apk/debug/app-debug.apk builds/FoodHub-DEBUG-v1.14.0-OSM-FOURSQUARE.apk
   ```

## Решение 2: Исправить проблему с Expo модулями

Проблема в том, что Gradle не может найти `expo-module-gradle-plugin`. 

Попробуйте:
1. Очистить кеш:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   rm -rf node_modules/.cache
   ```

2. Переустановить зависимости:
   ```bash
   npm install
   npx expo install --fix
   ```

3. Пересобрать android:
   ```bash
   npx expo prebuild --platform android --clean
   ```

4. Собрать APK:
   ```bash
   cd android
   ./gradlew :app:assembleDebug
   ```

## Решение 3: Использовать последний готовый APK

Пока идет сборка, можно использовать последний собранный APK:
```bash
ls -t builds/*.apk | head -1
```

Версия 1.13.0 уже включает фильтры и сортировку. Новый функционал OpenStreetMap и Foursquare можно протестировать через Expo Go или собрать позже через Android Studio.

## Изменения в версии 1.14.0

- ✅ OpenStreetMap Service для поиска ресторанов (бесплатно)
- ✅ Foursquare Places API (50k запросов/день бесплатно)
- ✅ Умная система fallback между источниками данных
- ✅ Настройка приоритета источников в `src/config/api.config.ts`

Код уже добавлен в проект, просто нужно собрать APK через Android Studio.

