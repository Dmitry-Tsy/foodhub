# 🔧 Конфигурация API для FoodHub

## 📋 Обзор

Теперь приложение поддерживает **3 режима работы**:

1. 🖥️ **Локальный (эмулятор)** - `http://10.0.2.2:3000`
2. 📱 **Локальный (реальное устройство)** - `http://192.168.31.212:3000`
3. ☁️ **Production (Render)** - `https://foodhub-backend.onrender.com`

---

## 🎯 Как переключать режимы

### Файл: `src/config/api.config.ts`

Откройте файл и найдите строку:

```typescript
export const CURRENT_ENV: Environment = 'local'; // 'local' или 'production'
```

### Режим 1: Локальная разработка (LOCAL)

```typescript
export const CURRENT_ENV: Environment = 'local';
```

Затем в файлах:
- `src/services/api.ts`
- `src/screens/ConnectivityTestScreen.tsx`

Найдите строку:
```typescript
const isEmulator = true; // true = эмулятор, false = реальное устройство
```

**Для эмулятора:**
```typescript
const isEmulator = true;
```
→ API URL: `http://10.0.2.2:3000/api`

**Для реального устройства:**
```typescript
const isEmulator = false;
```
→ API URL: `http://192.168.31.212:3000/api`

### Режим 2: Production (PRODUCTION)

В `src/config/api.config.ts`:

```typescript
export const CURRENT_ENV: Environment = 'production';
```

И обновите URL:
```typescript
export const API_CONFIG = {
  // ...
  production: {
    url: 'https://foodhub-backend.onrender.com', // ВАШ URL от Render
  },
};
```

→ API URL: `https://foodhub-backend.onrender.com/api`

---

## 📦 Сборка APK для разных режимов

### APK для локальной разработки (эмулятор)

```bash
# 1. Настройте конфиг
# src/config/api.config.ts:
#   CURRENT_ENV = 'local'
# src/services/api.ts:
#   isEmulator = true

# 2. Соберите APK
cd /Users/dmitrytsymlyakov/AndroidStudioProjects/FoodHub/android
export ANDROID_HOME=$HOME/Library/Android/sdk
./gradlew assembleRelease

# 3. Скопируйте APK
cd ..
cp android/app/build/outputs/apk/release/app-release.apk FoodHub-LOCAL-EMULATOR.apk

# 4. Установите
adb install FoodHub-LOCAL-EMULATOR.apk
```

### APK для реального устройства (локальная сеть)

```bash
# 1. Настройте конфиг
# src/config/api.config.ts:
#   CURRENT_ENV = 'local'
# src/services/api.ts:
#   isEmulator = false

# 2. Соберите и установите
cd /Users/dmitrytsymlyakov/AndroidStudioProjects/FoodHub/android
./gradlew assembleRelease
cd ..
cp android/app/build/outputs/apk/release/app-release.apk FoodHub-LOCAL-DEVICE.apk
adb install FoodHub-LOCAL-DEVICE.apk
```

### APK для Production (Render)

```bash
# 1. Настройте конфиг
# src/config/api.config.ts:
#   CURRENT_ENV = 'production'
#   production.url = 'https://foodhub-backend.onrender.com'

# 2. Соберите и установите
cd /Users/dmitrytsymlyakov/AndroidStudioProjects/FoodHub/android
./gradlew assembleRelease
cd ..
cp android/app/build/outputs/apk/release/app-release.apk FoodHub-PRODUCTION.apk
adb install FoodHub-PRODUCTION.apk
```

---

## 🔍 Проверка текущей конфигурации

### В коде (для отладки):

```typescript
import { getCurrentConfig } from '../config/api.config';

const config = getCurrentConfig(true); // true = эмулятор, false = устройство
console.log('Current API Config:', config);
```

Выведет:
```javascript
{
  environment: 'local',        // или 'production'
  baseUrl: 'http://10.0.2.2:3000',
  apiUrl: 'http://10.0.2.2:3000/api',
  isEmulator: true,
  isProduction: false,
  isLocal: true
}
```

### В приложении:

Перейдите в **Profile → 🔧 Тест подключения** и посмотрите какой URL используется.

---

## 🎯 Быстрый старт (рекомендации)

### Для разработки:

**Используйте эмулятор:**
1. `CURRENT_ENV = 'local'`
2. `isEmulator = true`
3. Запустите локальный бэкенд: `cd backend && npm run dev`
4. Соберите APK: `FoodHub-LOCAL-EMULATOR.apk`

### Для тестирования на реальном устройстве:

**Вариант A - Локальная сеть:**
1. `CURRENT_ENV = 'local'`
2. `isEmulator = false`
3. Запустите локальный бэкенд
4. Убедитесь что устройство и компьютер в одной Wi-Fi
5. Соберите APK: `FoodHub-LOCAL-DEVICE.apk`

**Вариант B - Production (РЕКОМЕНДУЕТСЯ):**
1. Задеплойте бэкенд на Render (см. `RENDER_DEPLOY_GUIDE.md`)
2. `CURRENT_ENV = 'production'`
3. Обновите `production.url` с вашим Render URL
4. Соберите APK: `FoodHub-PRODUCTION.apk`
5. ✅ Работает ВЕЗДЕ, без локального сервера!

---

## 🚀 Production деплой - полный чеклист

### 1. Задеплойте бэкенд на Render

Следуйте инструкции: `RENDER_DEPLOY_GUIDE.md`

Получите URL, например:
```
https://foodhub-backend.onrender.com
```

### 2. Обновите frontend конфигурацию

**Файл:** `src/config/api.config.ts`

```typescript
export const CURRENT_ENV: Environment = 'production';

export const API_CONFIG = {
  // ...
  production: {
    url: 'https://foodhub-backend.onrender.com', // ВАШ URL!
  },
};
```

### 3. Соберите production APK

```bash
cd /Users/dmitrytsymlyakov/AndroidStudioProjects/FoodHub

# Убедитесь что конфигурация = production
cat src/config/api.config.ts | grep CURRENT_ENV

# Соберите
cd android
export ANDROID_HOME=$HOME/Library/Android/sdk
./gradlew clean
./gradlew assembleRelease

# Скопируйте
cd ..
cp android/app/build/outputs/apk/release/app-release.apk FoodHub-PRODUCTION.apk
ls -lh FoodHub-PRODUCTION.apk
```

### 4. Протестируйте

```bash
# Установите на устройство
adb install FoodHub-PRODUCTION.apk

# Откройте приложение
# Profile → 🔧 Тест подключения
# Должен показать: https://foodhub-backend.onrender.com

# Попробуйте зарегистрироваться и войти!
```

### 5. Распространение

Теперь APK можно:
- Отправить друзьям
- Загрузить на Google Drive
- Поделиться в Telegram
- Установить на любое Android устройство

**Работает без локального сервера! 🎉**

---

## 📊 Сравнение режимов

| Параметр | Local (Emulator) | Local (Device) | Production |
|----------|------------------|----------------|------------|
| **API URL** | 10.0.2.2:3000 | 192.168.31.212:3000 | render.com |
| **Нужен локальный сервер** | ✅ Да | ✅ Да | ❌ Нет |
| **Нужна одна Wi-Fi** | ❌ Нет | ✅ Да | ❌ Нет |
| **Работает везде** | ❌ Нет | ❌ Нет | ✅ Да |
| **Стабильность** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Рекомендуется для** | Разработка | Тест на устройстве | Демо/Продакшен |

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to server"

**Проблема:** Приложение не может подключиться к API

**Решение:**
1. Откройте `Profile → 🔧 Тест подключения`
2. Посмотрите какой URL используется
3. Проверьте что сервер доступен (откройте URL/health в браузере)
4. Убедитесь что конфигурация правильная

### ❌ После смены конфига ничего не изменилось

**Проблема:** APK использует старую конфигурацию

**Решение:**
```bash
# Пересоберите с чистого листа
cd android
./gradlew clean
./gradlew assembleRelease
cd ..
adb uninstall com.foodhub  # Удалите старое приложение
adb install FoodHub-xxx.apk  # Установите новое
```

### ❌ Production APK не работает

**Проблема:** Render URL неправильный или сервис "спит"

**Решение:**
1. Откройте в браузере: `https://ВАШ_URL/health`
2. Подождите 30-60 секунд (холодный старт)
3. Должен показать `{"status": "ok"}`
4. Попробуйте в приложении снова

---

## 💡 Советы

### Для быстрой разработки:

**Используйте эмулятор + локальный сервер**
- Быстро
- Стабильно
- Не зависит от сети

### Для демонстрации:

**Используйте Production (Render)**
- Работает везде
- Не нужен локальный сервер
- Можно поделиться APK

### Для отладки на реальном устройстве:

**Используйте локальную сеть (device mode)**
- Видно логи на компьютере
- Можно дебажить
- Быстро тестировать изменения

---

## 🎯 Итог

**Текущая конфигурация универсальная и гибкая!**

- ✅ Поддержка 3 режимов
- ✅ Легкое переключение (один файл)
- ✅ Встроенная диагностика
- ✅ Готово к production

**Следующий шаг:** Задеплойте на Render и соберите production APK! 🚀

См. детальную инструкцию: `RENDER_DEPLOY_GUIDE.md`

