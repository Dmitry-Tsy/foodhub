# 📦 Builds - APK файлы

В этой папке хранятся собранные APK файлы приложения.

---

## 📱 Текущие билды

### Production (Рекомендуется):
- **FoodHub-PRODUCTION-v1.4-LOGGER.apk** - Последняя стабильная версия ✅
  - Версия: 1.4
  - Дата: 14 ноября 2025
  - API: https://foodhub-backend-96im.onrender.com
  - Новое: Система логирования! 📝

---

## 📋 История версий

| Версия | APK | Дата | Описание |
|--------|-----|------|----------|
| **1.4** | **FoodHub-PRODUCTION-v1.4-LOGGER.apk** | 14.11.2025 | **✅ НОВОЕ - Система логирования** 📝 |
| 1.3 | FoodHub-PRODUCTION-v1.3-STABLE.apk | 14.11.2025 | Google Places ID → UUID |
| 1.2.1 | FoodHub-PRODUCTION-v1.2.1-HOTFIX.apk | 14.11.2025 | Hotfix: auth profile fallback |
| 1.2 | FoodHub-PRODUCTION-v1.2-FINAL.apk | 14.11.2025 | 4 критичных багфикса |
| 1.1 | FoodHub-PRODUCTION-v1.1-BUGFIXES.apk | 14.11.2025 | Логотип, краш профиля, auth |
| 1.0 | ~~FoodHub-PRODUCTION-v1.0.apk~~ | 14.11.2025 | Первый релиз (устарел) |

---

## 🚀 Установка APK

### На эмулятор или устройство:
```bash
adb install builds/FoodHub-PRODUCTION-v1.1-BUGFIXES.apk
```

### Обновление существующего приложения:
```bash
adb install -r builds/FoodHub-PRODUCTION-v1.1-BUGFIXES.apk
```

---

## 🔨 Сборка нового APK

### Команда для сборки:
```bash
cd android
export ANDROID_HOME=$HOME/Library/Android/sdk
./gradlew clean
./gradlew assembleRelease

# Скопировать в builds/
cd ..
cp android/app/build/outputs/apk/release/app-release.apk builds/FoodHub-PRODUCTION-vX.X.apk
```

---

## 📊 Информация о билдах

### Конфигурация:
- **Build Type:** Release
- **Min SDK:** 21 (Android 5.0)
- **Target SDK:** 34
- **Signing:** Debug keystore (для разработки)

### Размер:
- ~65 MB (средний размер APK)

### API URLs:
- **Production:** https://foodhub-backend-96im.onrender.com/api
- **Local Emulator:** http://10.0.2.2:3000/api
- **Local Device:** http://192.168.31.212:3000/api

---

## ⚠️ Важно

- APK файлы **НЕ** должны попадать в Git (добавлены в .gitignore)
- Храните только актуальные версии
- Удаляйте старые версии после тестирования
- Для production используйте подписанный release keystore

---

## 📝 Naming Convention

Формат имени APK файла:
```
FoodHub-[TYPE]-v[VERSION]-[DESCRIPTION].apk
```

Примеры:
- `FoodHub-PRODUCTION-v1.1-BUGFIXES.apk`
- `FoodHub-EMULATOR-v1.0.apk`
- `FoodHub-LOCAL-DEVICE-v1.0.apk`

---

**Note:** Эта папка создается автоматически и не включается в Git репозиторий.

