# 🚀 FoodHub Backend API

Node.js + Express + PostgreSQL + TypeScript

---

## 📦 Установка

### 1. Установите зависимости:
```bash
cd backend
npm install
```

### 2. Настройте PostgreSQL:

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb foodhub
```

**Linux:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb foodhub
```

### 3. Настройте .env:
```bash
cp .env.example .env
# Отредактируйте .env файл
```

Минимальные настройки:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodhub
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

---

## 🚀 Запуск

### Development mode:
```bash
npm run dev
```

Сервер запустится на `http://localhost:3000`

### Production build:
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### Authentication

**POST** `/api/auth/register`
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**GET** `/api/auth/me`  
Headers: `Authorization: Bearer <token>`

**PUT** `/api/auth/profile`  
Headers: `Authorization: Bearer <token>`
```json
{
  "username": "newname",
  "bio": "Food lover",
  "avatar": "https://..."
}
```

### Dishes

**GET** `/api/dishes/restaurant/:restaurantId`  
Получить меню ресторана

**GET** `/api/dishes/:dishId`  
Получить блюдо по ID

**POST** `/api/dishes`  
Headers: `Authorization: Bearer <token>`
```json
{
  "name": "Паста Карбонара",
  "description": "Традиционная итальянская паста",
  "restaurantId": "uuid",
  "price": 750,
  "category": "Паста",
  "photo": "https://..."
}
```

**GET** `/api/dishes/:dishId/reviews`  
Получить отзывы блюда

**POST** `/api/dishes/:dishId/reviews`  
Headers: `Authorization: Bearer <token>`
```json
{
  "rating": 9.5,
  "comment": "Отличная паста!",
  "foodPairing": "Кьянти",
  "photos": ["https://..."]
}
```

---

## 🗄️ База данных

### Таблицы:

1. **users** - пользователи
2. **restaurants** - рестораны
3. **dishes** - блюда
4. **dish_reviews** - отзывы
5. **taste_profiles** - вкусовые профили
6. **follows** - подписки
7. **favorites** - избранное
8. **user_achievements** - достижения

### Схема:
```
users (1) ──→ (N) dishes (addedBy)
users (1) ──→ (N) dish_reviews (authorId)
users (1) ──→ (1) taste_profiles
users (N) ←──→ (N) users (follows)
users (N) ←──→ (N) restaurants (favorites)

restaurants (1) ──→ (N) dishes
dishes (1) ──→ (N) dish_reviews
```

---

## 🔐 Аутентификация

JWT токены с истечением через 7 дней.

**Получение токена:**
1. POST `/api/auth/register` или `/api/auth/login`
2. Получить `data.token`
3. Использовать в headers: `Authorization: Bearer <token>`

---

## 📸 Загрузка фотографий

Будет добавлено:
- Cloudinary интеграция
- `/api/upload/photo` endpoint
- Автоматическая оптимизация изображений

---

## 🎯 Следующие шаги

### Что нужно добавить:

1. **Контроллеры:**
   - restaurantController
   - tasteProfileController
   - achievementController
   - uploadController

2. **Маршруты:**
   - /api/restaurants
   - /api/taste-profile
   - /api/achievements
   - /api/upload

3. **Функции:**
   - Поиск ресторанов
   - Геолокация
   - Подписки/отписки
   - Избранное

4. **Интеграция:**
   - Подключить фронтенд к бэкенду
   - Обновить API URL в React Native

---

## ✅ Готово

- ✅ TypeScript настроен
- ✅ PostgreSQL конфигурация
- ✅ 8 моделей данных
- ✅ Аутентификация (JWT)
- ✅ Endpoints для блюд и отзывов
- ✅ Middleware для auth
- ✅ Базовая структура

---

**Версия:** 1.0.0  
**Статус:** В разработке  
**Требуется:** PostgreSQL 12+, Node.js 18+

