# 🍽️ FoodHub - Social Food Discovery App

**Версия:** 1.0 Production  
**Статус:** ✅ Production Ready  
**Платформа:** Android (React Native)  
**Backend:** Node.js + PostgreSQL (Render.com)

---

## 🌟 О проекте

FoodHub - это социальная платформа для любителей еды, позволяющая:
- 🔍 Находить лучшие рестораны и блюда
- ⭐ Делиться отзывами и оценками
- 👥 Следить за активностью других пользователей
- 🤖 Получать персональные рекомендации на основе вкусовых предпочтений
- 📊 Отслеживать свои достижения и статистику

---

## 🚀 Production URLs

### Backend API:
```
https://foodhub-backend-96im.onrender.com
```

### Endpoints:
- **API:** https://foodhub-backend-96im.onrender.com/api
- **Swagger UI:** https://foodhub-backend-96im.onrender.com/api-docs
- **Health Check:** https://foodhub-backend-96im.onrender.com/health

---

## 📱 Установка приложения

### Требования:
- Android 5.0 (API 21) или выше
- ~65 MB свободного места

### Установка через ADB:

```bash
# Скачайте APK из релизов или соберите сами
adb install FoodHub-PRODUCTION-v1.0.apk
```

### Первый запуск:
1. Откройте приложение
2. Создайте аккаунт (email + пароль)
3. Заполните профиль
4. Начните исследовать!

---

## 🛠️ Технологии

### Frontend:
- **Framework:** React Native 0.74+ with Expo
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation v6
- **UI Components:** Custom + React Native Elements
- **Storage:** AsyncStorage + Expo SecureStore
- **HTTP Client:** Axios
- **Maps:** (опционально) React Native Maps

### Backend:
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 15
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS
- **API Documentation:** Swagger UI
- **Hosting:** Render.com (Free tier)

### DevOps:
- **Version Control:** Git + GitHub
- **CI/CD:** Render Auto-Deploy
- **Database:** Render PostgreSQL
- **SSL:** Automatic (Render)

---

## 📂 Структура проекта

```
FoodHub/
├── src/                          # Frontend исходный код
│   ├── components/               # React компоненты
│   ├── config/                   # Конфигурация (API URLs)
│   ├── constants/                # Константы (цвета, темы)
│   ├── navigation/               # Навигация приложения
│   ├── screens/                  # Экраны приложения
│   ├── services/                 # API клиенты и сервисы
│   ├── store/                    # Redux store и slices
│   ├── types/                    # TypeScript типы
│   └── utils/                    # Утилиты
│
├── backend/                      # Backend исходный код
│   ├── src/
│   │   ├── config/               # Конфигурация (БД, Swagger)
│   │   ├── controllers/          # Контроллеры API
│   │   ├── middleware/           # Middleware (auth, validation)
│   │   ├── models/               # Sequelize модели
│   │   ├── routes/               # API роуты
│   │   └── server.ts             # Точка входа
│   ├── render.yaml               # Render конфигурация
│   └── package.json
│
├── android/                      # Android нативный код
│   └── app/
│       └── src/main/
│           └── res/              # Ресурсы (иконки, splash)
│
├── assets/                       # Статические ресурсы
│   ├── icon.png                  # Иконка приложения
│   └── splash.png                # Splash screen
│
├── docs/                         # 📚 Документация проекта
│   ├── README.md                 # Индекс документации
│   ├── RENDER_DEPLOY_GUIDE.md   # Гайд по деплою на Render
│   ├── API_CONFIGURATION.md     # Конфигурация API
│   ├── PRODUCTION_READY.md      # Production документация
│   ├── SWAGGER_GUIDE.md         # Использование Swagger API
│   ├── BACKEND_SUMMARY.md       # Обзор backend архитектуры
│   ├── FOODHUB_API_COMPLETE.md  # Полная API документация
│   ├── BUGFIX_v1.1.md           # История багфиксов
│   └── CHANGELOG.md             # История изменений
│
├── builds/                       # 📦 APK файлы
│   ├── README.md                 # Информация о билдах
│   └── *.apk                     # Собранные APK (не в Git)
│
├── logs/                         # 📝 Лог файлы
│   ├── README.md                 # Информация о логах
│   └── *.log                     # Логи (не в Git)
│
└── README.md                     # Этот файл
```

---

## 🎯 Основные функции

### 🔐 Аутентификация
- Регистрация с email/паролем
- JWT токены
- Безопасное хранение (SecureStore)
- Автоматический refresh

### 🍽️ Рестораны и блюда
- Просмотр каталога ресторанов
- Детальная информация о блюдах
- Фильтрация по категориям
- Поиск по названию

### ⭐ Отзывы и рейтинги
- 5-звездочная система оценки
- Текстовые отзывы
- Загрузка фото
- Лайки и комментарии

### 👤 Профиль пользователя
- Персональная информация
- История отзывов
- Любимые рестораны
- Статистика активности

### 🤖 AI функции
- Вкусовой профиль (Taste Profile)
- Персональные рекомендации
- Система достижений
- AI сомелье

### 🔍 Поиск
- Глобальный поиск
- Поиск по ресторанам
- Поиск по блюдам
- Поиск пользователей

### 📱 Другое
- Темная/светлая тема
- Офлайн режим (частично)
- Push-уведомления (планируется)
- Геолокация (планируется)

---

## 🚀 Разработка

### Требования:
- Node.js 18+
- npm или yarn
- Android Studio (для сборки)
- PostgreSQL 15 (для локального бэкенда)

### Установка зависимостей:

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### Локальная разработка:

#### 1. Запустите PostgreSQL:
```bash
brew services start postgresql@15
createdb foodhub
```

#### 2. Настройте .env для backend:
```bash
cd backend
cp .env.example .env
# Отредактируйте .env с вашими настройками
```

#### 3. Запустите backend:
```bash
cd backend
npm run dev
```

#### 4. Настройте frontend для local mode:

В `src/config/api.config.ts`:
```typescript
export const CURRENT_ENV: Environment = 'local';
```

В `src/services/api.ts`:
```typescript
const isEmulator = true; // true для эмулятора, false для реального устройства
```

#### 5. Запустите frontend:
```bash
# Вариант 1: Expo
npx expo start

# Вариант 2: React Native CLI (для продакшен билда)
cd android
./gradlew assembleRelease
```

### Сборка APK:

```bash
cd android
export ANDROID_HOME=$HOME/Library/Android/sdk
./gradlew clean
./gradlew assembleRelease

# APK будет в:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🌐 Деплой на Render

### Быстрый старт:

1. **Зарегистрируйтесь на [Render.com](https://render.com)**

2. **Создайте PostgreSQL базу:**
   - New + → PostgreSQL
   - Name: `foodhub-db`
   - Free tier

3. **Создайте Web Service:**
   - New + → Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Настройте Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your-secret-key
   DATABASE_URL=(Internal Database URL из шага 2)
   ALLOWED_ORIGINS=*
   ```

5. **Deploy!**

**Подробная инструкция:** См. `RENDER_DEPLOY_GUIDE.md`

---

## 📚 Документация

Вся документация проекта находится в папке [`docs/`](docs/)

| Документ | Описание |
|----------|----------|
| [`README.md`](README.md) | Этот файл - общая информация |
| [`docs/RENDER_DEPLOY_GUIDE.md`](docs/RENDER_DEPLOY_GUIDE.md) | Полная инструкция по деплою на Render |
| [`docs/API_CONFIGURATION.md`](docs/API_CONFIGURATION.md) | Настройка API (local/production режимы) |
| [`docs/PRODUCTION_READY.md`](docs/PRODUCTION_READY.md) | Production документация и URLs |
| [`docs/SWAGGER_GUIDE.md`](docs/SWAGGER_GUIDE.md) | Использование Swagger API |
| [`docs/BACKEND_SUMMARY.md`](docs/BACKEND_SUMMARY.md) | Архитектура backend |
| [`docs/FOODHUB_API_COMPLETE.md`](docs/FOODHUB_API_COMPLETE.md) | Полная документация API |
| [`docs/BUGFIX_v1.1.md`](docs/BUGFIX_v1.1.md) | История багфиксов |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | История изменений |

**См. также:** [`docs/README.md`](docs/README.md) - полный индекс документации

---

## 🧪 Тестирование

### Встроенный тест connectivity:

После установки APK:
1. Откройте приложение
2. Profile → 🔧 Тест подключения
3. Запустите тесты
4. Проверьте результаты

### Ручное тестирование API:

```bash
# Health check
curl https://foodhub-backend-96im.onrender.com/health

# Регистрация
curl -X POST https://foodhub-backend-96im.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Логин
curl -X POST https://foodhub-backend-96im.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Swagger UI:

Откройте в браузере:
```
https://foodhub-backend-96im.onrender.com/api-docs
```

---

## 🔒 Безопасность

- ✅ Пароли хешируются с bcrypt
- ✅ JWT токены для аутентификации
- ✅ Защищенное хранилище для токенов (SecureStore)
- ✅ Helmet.js для HTTP headers security
- ✅ CORS настроен
- ✅ SQL injection защита (Sequelize ORM)
- ✅ HTTPS (Render автоматически)

---

## 📝 API Endpoints

### Auth:
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Логин
- `GET /api/auth/me` - Текущий пользователь

### Restaurants:
- `GET /api/restaurants` - Список ресторанов
- `GET /api/restaurants/:id` - Детали ресторана
- `POST /api/restaurants` - Создать ресторан

### Dishes:
- `GET /api/dishes` - Список блюд
- `GET /api/dishes/:id` - Детали блюда
- `POST /api/dishes` - Создать блюдо
- `POST /api/dishes/:id/reviews` - Добавить отзыв

### Users:
- `GET /api/users/:id` - Профиль пользователя
- `GET /api/users/:id/dishes` - Блюда пользователя
- `GET /api/users/:id/reviews` - Отзывы пользователя

### Search:
- `GET /api/search?q=query` - Глобальный поиск

### Feed:
- `GET /api/feed` - Лента активности

**Полная документация:** https://foodhub-backend-96im.onrender.com/api-docs

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to server"

**Причина:** Render сервис "заснул" (free tier)

**Решение:**
1. Откройте https://foodhub-backend-96im.onrender.com/health в браузере
2. Подождите 30-60 секунд (холодный старт)
3. Попробуйте снова

### ❌ Регистрация не работает

**Решение:**
1. Проверьте в Profile → 🔧 Тест подключения
2. Проверьте что API URL правильный
3. Проверьте логи в Render Dashboard

### ❌ Приложение крашится

**Решение:**
```bash
# Посмотрите логи
adb logcat | grep -E "FoodHub|Error|FATAL"

# Переустановите
adb uninstall com.foodhub
adb install FoodHub-PRODUCTION-v1.0.apk
```

---

## 💰 Стоимость

### Текущая конфигурация (FREE):

| Ресурс | Лимит | Стоимость |
|--------|-------|-----------|
| Render Web Service | 750 часов/мес | $0 |
| Render PostgreSQL | 1 GB | $0 |
| Bandwidth | 100 GB/мес | $0 |

**Итого: $0/месяц** 🎉

**Ограничение:** Сервис "засыпает" после 15 минут неактивности (первый запрос медленный)

---

## 🗺️ Roadmap

### v1.1 (ближайшее):
- [ ] Push-уведомления
- [ ] Геолокация и карта ресторанов
- [ ] Система друзей/подписок
- [ ] Улучшенная система рекомендаций

### v2.0 (будущее):
- [ ] iOS версия
- [ ] Web-версия
- [ ] Бронирование столиков
- [ ] Интеграция с Google Places API
- [ ] Монетизация (Premium функции)

---

## 👥 Вклад

Проект находится в активной разработке. Если вы хотите внести вклад:

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

## 📄 Лицензия

Этот проект создан в образовательных целях.

---

## 📞 Контакты

**GitHub:** https://github.com/Dmitry-Tsy/foodhub  
**Backend API:** https://foodhub-backend-96im.onrender.com  
**Swagger UI:** https://foodhub-backend-96im.onrender.com/api-docs

---

## 🎉 Благодарности

- React Native & Expo команда
- Render.com за бесплатный хостинг
- Все разработчики open-source библиотек

---

**Сделано с ❤️ для любителей хорошей еды!** 🍽️

**Версия:** 1.0 Production  
**Дата:** Ноябрь 2025  
**Статус:** ✅ Production Ready & Working!
