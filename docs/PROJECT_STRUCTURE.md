# 📁 Структура проекта FoodHub

**Обновлено:** 14 ноября 2025

---

## 🗂️ Организация проекта

Проект организован по принципу **"чистой архитектуры"** с разделением по функциональным папкам:

```
FoodHub/
├── 📚 docs/             # Документация
├── 📦 builds/           # APK файлы
├── 📝 logs/             # Лог файлы
├── 💻 src/              # Frontend исходный код
├── 🔧 backend/          # Backend исходный код
├── 🤖 android/          # Android нативный код
├── 🎨 assets/           # Статические ресурсы
└── 📄 README.md         # Главный файл проекта
```

---

## 📚 docs/ - Документация

**Назначение:** Вся документация проекта собрана в одном месте

**Содержимое:**
- `README.md` - Индекс всей документации
- `RENDER_DEPLOY_GUIDE.md` - Полный гайд по деплою
- `API_CONFIGURATION.md` - Настройка API режимов
- `PRODUCTION_READY.md` - Production документация
- `SWAGGER_GUIDE.md` - Работа со Swagger
- `BACKEND_SUMMARY.md` - Архитектура backend
- `FOODHUB_API_COMPLETE.md` - Полная API документация
- `BUGFIX_v1.1.md` - История багфиксов
- `DEPLOYMENT_SUMMARY.md` - Сводка деплоя
- `CHANGELOG.md` - История изменений

**Git:** ✅ Все файлы отслеживаются

**Использование:**
```bash
# Читать документацию
open docs/README.md

# Добавить новый документ
touch docs/NEW_FEATURE.md
# Обновите docs/README.md
```

---

## 📦 builds/ - APK файлы

**Назначение:** Хранение собранных APK файлов

**Содержимое:**
- `README.md` - Информация о билдах
- `*.apk` - Собранные APK файлы (не в Git)
- `.gitkeep` - Для отслеживания папки в Git

**Git:** 
- ✅ `README.md` и `.gitkeep` отслеживаются
- ❌ `*.apk` файлы игнорируются

**Использование:**
```bash
# Сборка APK
cd android
./gradlew assembleRelease

# Копирование в builds/
cd ..
cp android/app/build/outputs/apk/release/app-release.apk \
   builds/FoodHub-PRODUCTION-v1.2.apk

# Установка
adb install builds/FoodHub-PRODUCTION-v1.2.apk
```

**Naming Convention:**
```
FoodHub-[TYPE]-v[VERSION]-[DESCRIPTION].apk

Примеры:
- FoodHub-PRODUCTION-v1.1-BUGFIXES.apk
- FoodHub-EMULATOR-v1.0.apk
- FoodHub-DEBUG-v1.1-FEATURE-X.apk
```

---

## 📝 logs/ - Лог файлы

**Назначение:** Хранение логов сборки, backend и приложения

**Содержимое:**
- `README.md` - Информация о логах и best practices
- `*.log` - Различные лог файлы (не в Git)
- `.gitkeep` - Для отслеживания папки в Git

**Git:**
- ✅ `README.md` и `.gitkeep` отслеживаются
- ❌ `*.log` файлы игнорируются

**Типы логов:**
```bash
logs/
├── build-*.log          # Логи сборки APK
├── gradle-*.log         # Gradle логи
├── backend.log          # Backend сервер логи
└── app-*.log            # Логи приложения
```

**Использование:**
```bash
# Просмотр последних логов
tail -50 logs/backend.log

# Поиск ошибок
grep -i error logs/*.log

# Очистка старых логов
rm logs/*.log

# Логи с устройства
adb logcat > logs/device-$(date +%Y%m%d).log
```

---

## 💻 src/ - Frontend код

**Назначение:** Исходный код React Native приложения

**Структура:**
```
src/
├── components/          # Переиспользуемые компоненты
├── config/             # Конфигурация (API URLs, etc.)
├── constants/          # Константы (colors, theme)
├── navigation/         # React Navigation
├── screens/            # Экраны приложения
│   ├── auth/          # Аутентификация
│   ├── tabs/          # Tab экраны
│   └── *.tsx          # Другие экраны
├── services/          # API клиенты, storage
├── store/             # Redux store
│   └── slices/       # Redux slices
├── types/             # TypeScript типы
└── utils/             # Утилиты
```

**Технологии:**
- React Native + Expo
- TypeScript
- Redux Toolkit
- React Navigation

---

## 🔧 backend/ - Backend код

**Назначение:** Node.js + Express API сервер

**Структура:**
```
backend/
├── src/
│   ├── config/         # Конфигурация (DB, Swagger)
│   ├── controllers/    # Контроллеры API
│   ├── middleware/     # Middleware (auth, validation)
│   ├── models/         # Sequelize модели
│   ├── routes/         # API роуты
│   └── server.ts       # Entry point
├── dist/              # Compiled JS (не в Git)
├── render.yaml        # Render.com config
├── package.json       # Dependencies
└── tsconfig.json      # TypeScript config
```

**Технологии:**
- Node.js 18+
- Express.js
- TypeScript
- PostgreSQL + Sequelize
- JWT auth
- Swagger UI

---

## 🤖 android/ - Android нативный код

**Назначение:** Android нативная часть (React Native)

**Структура:**
```
android/
├── app/
│   ├── src/main/
│   │   ├── res/           # Ресурсы
│   │   │   ├── mipmap-*/  # Иконки
│   │   │   └── values/    # Strings, colors
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── gradle/
├── build.gradle
└── settings.gradle
```

**Конфигурация:**
- Min SDK: 21 (Android 5.0)
- Target SDK: 34
- Compile SDK: 34

---

## 🎨 assets/ - Статические ресурсы

**Назначение:** Изображения, иконки, шрифты

**Содержимое:**
```
assets/
├── icon.png               # App icon (1024x1024)
├── adaptive-icon.png      # Android adaptive icon
├── splash.png             # Splash screen
├── favicon.png            # Web favicon
└── *.jpg, *.svg          # Другие ресурсы
```

**Использование:**
```typescript
// В React Native
import { Image } from 'react-native';
<Image source={require('../assets/icon.png')} />
```

---

## 📄 Корневые файлы

### README.md
Главный файл проекта с общей информацией

### .gitignore
Исключения для Git:
- `builds/*.apk` - APK файлы
- `logs/*.log` - Логи
- `backend/dist/` - Compiled код
- `node_modules/` - Dependencies

### package.json
Frontend dependencies и scripts

### tsconfig.json
TypeScript конфигурация для frontend

### app.json / eas.json
Expo конфигурация

---

## 🔄 Workflow

### Разработка:
```bash
# 1. Frontend
npm install
npm start

# 2. Backend
cd backend
npm install
npm run dev

# 3. Android (для билда)
cd android
./gradlew assembleRelease
```

### Деплой:
```bash
# 1. Backend → Render.com
git push origin main
# (автоматический деплой)

# 2. Frontend → APK
cd android
./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk \
   ../builds/FoodHub-PRODUCTION-vX.X.apk
```

### Документация:
```bash
# Обновить документы в docs/
vim docs/NEW_FEATURE.md

# Обновить индекс
vim docs/README.md

# Commit
git add docs/
git commit -m "docs: add NEW_FEATURE documentation"
```

---

## 📊 Размеры

| Папка | Примерный размер | В Git |
|-------|------------------|-------|
| `src/` | ~5 MB | ✅ |
| `backend/` | ~3 MB | ✅ |
| `android/` | ~50 MB | ✅ |
| `node_modules/` | ~500 MB | ❌ |
| `docs/` | ~1 MB | ✅ |
| `builds/` | ~65 MB/APK | ❌ |
| `logs/` | переменный | ❌ |

---

## 🎯 Best Practices

### Документация (docs/):
- Обновляйте docs/README.md при добавлении файлов
- Используйте markdown для форматирования
- Добавляйте примеры кода
- Ссылайтесь на другие документы

### Билды (builds/):
- Используйте семантическое версионирование (v1.0.0)
- Удаляйте старые APK после тестирования
- Храните только актуальные версии
- Документируйте изменения в CHANGELOG.md

### Логи (logs/):
- Очищайте старые логи регулярно
- Используйте rotation для больших логов
- НЕ логируйте sensitive данные
- Добавляйте timestamps

### Код:
- Следуйте структуре папок
- Используйте TypeScript типы
- Комментируйте сложные части
- Пишите тесты (TODO)

---

## 🔗 Связанные документы

- [`docs/README.md`](README.md) - Индекс документации
- [`../README.md`](../README.md) - Главный README
- [`RENDER_DEPLOY_GUIDE.md`](RENDER_DEPLOY_GUIDE.md) - Деплой
- [`BACKEND_SUMMARY.md`](BACKEND_SUMMARY.md) - Архитектура backend

---

**Последнее обновление:** 14 ноября 2025  
**Версия проекта:** 1.1

