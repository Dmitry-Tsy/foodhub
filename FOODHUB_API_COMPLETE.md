# 🚀 FoodHub API - Полная документация

## 📊 Обзор

**Версия:** 3.1  
**Базовый URL:** `http://192.168.31.212:3000/api`  
**Swagger UI:** `http://192.168.31.212:3000/api-docs`

---

## 📋 Все эндпоинты (22 шт.)

### 🔐 **Auth - Авторизация (4)**

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/auth/register` | Регистрация | ❌ |
| POST | `/api/auth/login` | Вход в систему | ❌ |
| GET | `/api/auth/me` | Текущий пользователь | ✅ |
| PUT | `/api/auth/profile` | Обновить профиль | ✅ |

### 👥 **Users - Пользователи (4)**

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/users/:userId` | Профиль пользователя | ❌ |
| GET | `/api/users/:userId/dishes` | Блюда пользователя | ❌ |
| GET | `/api/users/:userId/reviews` | Отзывы пользователя | ❌ |
| GET | `/api/users/:userId/stats` | Статистика | ❌ |

### 🍽️ **Dishes - Блюда (3)**

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/dishes/restaurant/:id` | Меню ресторана | ❌ |
| GET | `/api/dishes/:dishId` | Получить блюдо | ❌ |
| POST | `/api/dishes` | Добавить блюдо | ✅ |

### 📝 **Reviews - Отзывы (2)**

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/dishes/:dishId/reviews` | Отзывы на блюдо | ❌ |
| POST | `/api/dishes/:dishId/reviews` | Добавить отзыв | ✅ |

### 🏪 **Restaurants - Рестораны (3)**

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/restaurants` | Создать ресторан | ✅ |
| GET | `/api/restaurants/search` | Поиск ресторанов | ❌ |
| GET | `/api/restaurants/:id` | Получить ресторан | ❌ |

### 👅 **Taste Profile - Вкусовые профили (3)**

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/taste-profile` | Получить профиль | ✅ |
| POST | `/api/taste-profile` | Создать/обновить | ✅ |
| DELETE | `/api/taste-profile` | Удалить профиль | ✅ |

### 📱 **Feed - Лента (2)**

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/feed` | Лента активности | ❌ |
| GET | `/api/feed/trending` | Популярные блюда | ❌ |

### 🔍 **Search - Поиск (1)**

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/search` | Глобальный поиск | ❌ |

---

## 🎯 Примеры использования

### **1. Регистрация и авторизация**

```bash
# Регистрация
curl -X POST http://192.168.31.212:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "foodlover",
    "email": "foodlover@example.com",
    "password": "secure123"
  }'

# Получаем токен в ответе
{
  "user": {...},
  "token": "eyJhbGciOiJIUzI1..."
}

# Используем токен для защищенных запросов
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1..." \
  http://192.168.31.212:3000/api/auth/me
```

### **2. Работа с ресторанами и блюдами**

```bash
# Поиск ресторанов
curl "http://192.168.31.212:3000/api/restaurants/search?query=Белуга"

# Создать ресторан (требует auth)
curl -X POST http://192.168.31.212:3000/api/restaurants \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ресторан Пушкин",
    "address": "Москва, Тверской бульвар, 26А",
    "latitude": 55.7647,
    "longitude": 37.6042,
    "cuisineType": "Русская"
  }'

# Получить меню
curl "http://192.168.31.212:3000/api/dishes/restaurant/RESTAURANT_ID"

# Добавить блюдо (требует auth)
curl -X POST http://192.168.31.212:3000/api/dishes \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Борщ",
    "description": "Традиционный русский борщ",
    "restaurantId": "RESTAURANT_ID",
    "price": 450,
    "category": "Супы"
  }'
```

### **3. Отзывы**

```bash
# Получить отзывы на блюдо
curl "http://192.168.31.212:3000/api/dishes/DISH_ID/reviews"

# Добавить отзыв (требует auth)
curl -X POST http://192.168.31.212:3000/api/dishes/DISH_ID/reviews \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 9.5,
    "comment": "Великолепное блюдо!",
    "foodPairing": "Рекомендую с красным вином"
  }'
```

### **4. Профиль пользователя**

```bash
# Публичный профиль
curl "http://192.168.31.212:3000/api/users/USER_ID"

# Блюда пользователя
curl "http://192.168.31.212:3000/api/users/USER_ID/dishes?limit=10"

# Отзывы пользователя
curl "http://192.168.31.212:3000/api/users/USER_ID/reviews?limit=10"

# Статистика
curl "http://192.168.31.212:3000/api/users/USER_ID/stats"
```

### **5. Лента и тренды**

```bash
# Лента активности
curl "http://192.168.31.212:3000/api/feed?limit=20"

# Популярные блюда
curl "http://192.168.31.212:3000/api/feed/trending?limit=10"
```

### **6. Глобальный поиск**

```bash
# Поиск по всему
curl "http://192.168.31.212:3000/api/search?query=паста"

# Поиск только блюд
curl "http://192.168.31.212:3000/api/search?query=паста&type=dishes"

# Поиск только пользователей
curl "http://192.168.31.212:3000/api/search?query=foodlover&type=users"

# Поиск ресторанов
curl "http://192.168.31.212:3000/api/search?query=белуга&type=restaurants"
```

### **7. Вкусовой профиль**

```bash
# Получить профиль (требует auth)
curl -H "Authorization: Bearer TOKEN" \
  "http://192.168.31.212:3000/api/taste-profile"

# Создать/обновить профиль
curl -X POST http://192.168.31.212:3000/api/taste-profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "favoriteCuisines": ["Итальянская", "Японская"],
    "spicyLevel": "medium",
    "preferredPriceRangeMin": 500,
    "preferredPriceRangeMax": 3000
  }'
```

---

## 🔒 Авторизация

### **JWT Token**

После регистрации или входа вы получаете JWT токен:

```json
{
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Использование токена**

Добавьте заголовок Authorization к запросам:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1...
```

### **Эндпоинты требующие авторизации (10):**

1. GET `/api/auth/me`
2. PUT `/api/auth/profile`
3. POST `/api/dishes`
4. POST `/api/dishes/:dishId/reviews`
5. POST `/api/restaurants`
6. GET `/api/taste-profile`
7. POST `/api/taste-profile`
8. DELETE `/api/taste-profile`

---

## 📖 Swagger UI

### **Интерактивная документация:**

**Localhost:**
```
http://localhost:3000/api-docs
```

**Реальное устройство:**
```
http://192.168.31.212:3000/api-docs
```

### **Как использовать:**

1. Откройте Swagger UI
2. Найдите `POST /api/auth/register`
3. Нажмите "Try it out"
4. Заполните данные и нажмите "Execute"
5. Скопируйте `token` из ответа
6. Нажмите "Authorize" (замочек сверху)
7. Вставьте: `Bearer YOUR_TOKEN`
8. Теперь можно тестировать защищенные эндпоинты!

---

## 📊 Структура данных

### **User**
```typescript
{
  id: string (UUID)
  username: string
  email: string
  avatar?: string
  bio?: string
  trustScore: number
  followersCount: number
  followingCount: number
  reviewsCount: number
  dishesAddedCount: number
  cuisinesTried: number
}
```

### **Restaurant**
```typescript
{
  id: string (UUID)
  name: string
  address: string
  latitude: number
  longitude: number
  cuisineType: string
  phone?: string
  photos: string[]
  averageRating: number
  reviewCount: number
}
```

### **Dish**
```typescript
{
  id: string (UUID)
  name: string
  description?: string
  restaurantId: string (UUID)
  addedBy: string (UUID)
  photo?: string
  price?: number
  category?: string
  averageRating: number
  reviewCount: number
}
```

### **DishReview**
```typescript
{
  id: string (UUID)
  dishId: string (UUID)
  authorId: string (UUID)
  rating: number (0-10)
  comment?: string
  foodPairing?: string
  photos: string[]
  helpfulCount: number
}
```

### **TasteProfile**
```typescript
{
  id: string (UUID)
  userId: string (UUID)
  favoriteCuisines: string[]
  favoriteIngredients: string[]
  excludedIngredients: string[]
  spicyLevel: 'none' | 'mild' | 'medium' | 'hot' | 'extreme'
  dietaryRestrictions: string[]
  preferredPriceRangeMin: number
  preferredPriceRangeMax: number
  tastePreferences: {
    sweet: number (0-10)
    salty: number (0-10)
    sour: number (0-10)
    bitter: number (0-10)
    umami: number (0-10)
  }
}
```

---

## 🎨 Пагинация

Многие эндпоинты поддерживают пагинацию:

**Query параметры:**
- `limit` (default: 20) - количество на странице
- `offset` (default: 0) - смещение

**Формат ответа:**
```json
{
  "items": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

**Применяется к:**
- GET `/api/users/:userId/dishes`
- GET `/api/users/:userId/reviews`
- GET `/api/feed`

---

## 🔍 Поиск

### **Глобальный поиск**

```bash
GET /api/search?query=паста&type=dishes&limit=10
```

**Параметры:**
- `query` (required) - поисковый запрос
- `type` (optional) - `users` | `dishes` | `restaurants`
- `limit` (default: 10) - максимум результатов на тип

**Ответ:**
```json
{
  "query": "паста",
  "totalResults": 15,
  "results": {
    "users": [...],
    "dishes": [...],
    "restaurants": [...]
  }
}
```

### **Поиск ресторанов**

```bash
GET /api/restaurants/search?query=белуга&cuisine=русская&limit=20
```

---

## 📱 Лента активности

### **Персональная лента**

```bash
GET /api/feed?limit=20&offset=0
```

Для авторизованных - отзывы подписок  
Для гостей - популярные отзывы

### **Популярные блюда**

```bash
GET /api/feed/trending?limit=10
```

Блюда с высоким рейтингом и количеством отзывов

---

## 🌐 CORS

API настроен для работы с любыми источниками:

```typescript
cors({
  origin: '*',
  credentials: true,
})
```

---

## 🔧 Технологии

- **Node.js** + **Express** - веб-фреймворк
- **TypeScript** - типизация
- **PostgreSQL** - база данных
- **Sequelize** - ORM
- **JWT** - авторизация
- **Swagger** - документация
- **bcryptjs** - хеширование паролей
- **Helmet** - безопасность
- **Morgan** - логирование запросов

---

## 📦 Установка и запуск

```bash
# 1. Установить зависимости
cd backend
npm install

# 2. Настроить .env
cp .env.example .env
# Отредактировать .env с вашими данными

# 3. Создать базу данных
createdb foodhub

# 4. Запустить сервер
npm run dev

# 5. Открыть Swagger UI
open http://localhost:3000/api-docs
```

---

## 🧪 Тестирование

### **Через Swagger UI:**
1. Откройте `http://localhost:3000/api-docs`
2. Протестируйте любой эндпоинт

### **Через curl:**
```bash
# Health check
curl http://localhost:3000/health

# Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"pass123"}'

# Поиск
curl "http://localhost:3000/api/search?query=pizza"
```

### **Через мобильное приложение:**
1. Установите `FoodHub-v3.1-FIXED.apk`
2. Запустите бэкенд
3. Зарегистрируйтесь в приложении
4. Используйте все функции!

---

## 📈 Статистика API

- **Всего эндпоинтов:** 22
- **Категорий:** 8
- **Public эндпоинтов:** 12 (не требуют авторизации)
- **Protected эндпоинтов:** 10 (требуют JWT токен)
- **Моделей БД:** 8
- **TypeScript файлов:** 25+

---

## 🎯 Roadmap

### **Планируется:**
- [ ] Follow API (подписки)
- [ ] Favorites API (избранное)
- [ ] Notifications API (уведомления)
- [ ] Upload API (загрузка изображений на Cloudinary)
- [ ] AI Recommendations (персонализированные рекомендации)
- [ ] Analytics API (аналитика для владельцев)

---

## 📞 Поддержка

**Swagger UI:** http://localhost:3000/api-docs  
**Health Check:** http://localhost:3000/health  

---

**Разработано для FoodHub 🍽️**  
**Версия:** 3.1  
**Дата:** 11 ноября 2025

