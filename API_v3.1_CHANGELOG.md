# 🚀 FoodHub API v3.1 - Changelog

## 📅 Дата: 11 ноября 2025

---

## ✨ Что нового

### 🆕 Новые эндпоинты (Users API)

#### 1. **GET /api/users/:userId**
Получить публичный профиль пользователя

**Пример:**
```bash
curl http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000
```

**Ответ:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "foodlover",
    "avatar": "https://...",
    "bio": "Люблю вкусно поесть",
    "trustScore": "8.50",
    "followersCount": 150,
    "followingCount": 75,
    "reviewsCount": 42,
    "dishesAddedCount": 15,
    "cuisinesTried": 12
  }
}
```

#### 2. **GET /api/users/:userId/dishes**
Получить все блюда добавленные пользователем

**Параметры:**
- `limit` (default: 20) - количество на странице
- `offset` (default: 0) - смещение для пагинации

**Пример:**
```bash
curl "http://localhost:3000/api/users/550e8400.../dishes?limit=10&offset=0"
```

**Ответ:**
```json
{
  "dishes": [
    {
      "id": "...",
      "name": "Тартар из говядины",
      "restaurantId": "...",
      "averageRating": 9.2,
      "reviewCount": 15
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

#### 3. **GET /api/users/:userId/reviews**
Получить все отзывы пользователя

**Параметры:**
- `limit` (default: 20)
- `offset` (default: 0)

**Ответ:**
```json
{
  "reviews": [
    {
      "id": "...",
      "rating": 9.5,
      "comment": "Отличное блюдо!",
      "dish": {
        "id": "...",
        "name": "Паста карбонара",
        "photo": "..."
      }
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### 4. **GET /api/users/:userId/stats**
Получить статистику пользователя

**Ответ:**
```json
{
  "stats": {
    "dishesAdded": 15,
    "reviewsWritten": 42,
    "trustScore": "8.50",
    "followersCount": 150,
    "followingCount": 75,
    "cuisinesTried": 12
  }
}
```

---

### 📖 Полная Swagger документация

Добавлена документация для ВСЕХ эндпоинтов:

#### **Auth (4 эндпоинта)**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PUT /api/auth/profile

#### **Users (4 эндпоинта)** ⭐ NEW
- GET /api/users/:userId
- GET /api/users/:userId/dishes
- GET /api/users/:userId/reviews
- GET /api/users/:userId/stats

#### **Dishes (3 эндпоинта)**
- GET /api/dishes/restaurant/:restaurantId
- GET /api/dishes/:dishId
- POST /api/dishes

#### **Reviews (2 эндпоинта)**
- GET /api/dishes/:dishId/reviews
- POST /api/dishes/:dishId/reviews

#### **Restaurants (3 эндпоинта)**
- POST /api/restaurants
- GET /api/restaurants/search
- GET /api/restaurants/:restaurantId

#### **Taste Profile (3 эндпоинта)**
- GET /api/taste-profile
- POST /api/taste-profile
- DELETE /api/taste-profile

---

## 📊 Статистика API

### **Всего эндпоинтов: 19**

Разбивка по методам:
- **GET**: 11 эндпоинтов
- **POST**: 6 эндпоинтов
- **PUT**: 1 эндпоинт
- **DELETE**: 1 эндпоинт

Разбивка по авторизации:
- **PUBLIC**: 9 эндпоинтов (не требуют токена)
- **PROTECTED**: 10 эндпоинтов (требуют JWT токен)

---

## 🎨 Улучшения Swagger UI

### **Полная документация включает:**

✅ **Описания всех параметров**
- Path parameters (userId, dishId, restaurantId)
- Query parameters (limit, offset, query, cuisine)
- Request body schemas

✅ **Примеры запросов**
- Реалистичные данные
- Правильные типы и форматы
- UUID примеры

✅ **Примеры ответов**
- Success responses (200, 201)
- Error responses (400, 401, 404)
- Полные JSON структуры

✅ **Схемы данных**
- User
- Dish
- DishReview
- Restaurant
- TasteProfile

✅ **Теги для группировки**
- Auth
- Users ⭐ NEW
- Dishes
- Reviews
- Restaurants
- Taste Profile

---

## 🔄 Пагинация

Все эндпоинты списков теперь возвращают единообразную пагинацию:

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
- GET /api/users/:userId/dishes
- GET /api/users/:userId/reviews

---

## 🧪 Примеры использования

### **Сценарий: Профиль пользователя**

```bash
# 1. Получить профиль
curl http://localhost:3000/api/users/550e8400...

# 2. Получить его блюда
curl http://localhost:3000/api/users/550e8400.../dishes

# 3. Получить его отзывы
curl http://localhost:3000/api/users/550e8400.../reviews

# 4. Получить статистику
curl http://localhost:3000/api/users/550e8400.../stats
```

### **Сценарий: Ресторан и меню**

```bash
# 1. Найти ресторан
curl "http://localhost:3000/api/restaurants/search?query=Белуга"

# 2. Получить меню
curl http://localhost:3000/api/dishes/restaurant/550e8400...

# 3. Получить отзывы на блюдо
curl http://localhost:3000/api/dishes/550e8400.../reviews
```

---

## 🌐 Swagger UI

### **Доступ:**

**Localhost:**
```
http://localhost:3000/api-docs
```

**Реальное устройство:**
```
http://192.168.31.212:3000/api-docs
```

### **Функционал:**

✅ **Try it out** - тестирование прямо в браузере
✅ **Authorize** - добавление JWT токена
✅ **Examples** - готовые примеры запросов
✅ **Schemas** - структуры данных
✅ **Export** - скачать OpenAPI спецификацию

---

## 🔒 Авторизация

### **Получение токена:**

```bash
# Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"pass123"}'

# Ответ
{
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### **Использование токена:**

```bash
curl -X POST http://localhost:3000/api/dishes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"name":"Стейк","restaurantId":"..."}'
```

---

## 🎯 Следующие шаги

### **Планируется добавить:**

- [ ] **Feed API** - лента активности
- [ ] **Follow API** - подписки и подписчики
- [ ] **Favorites API** - избранные рестораны/блюда
- [ ] **Search API** - глобальный поиск
- [ ] **Notifications API** - уведомления
- [ ] **Upload API** - загрузка изображений

---

## 📦 Версии

- **v3.0** - Базовая функциональность (Auth, Dishes, Restaurants)
- **v3.1** - Users API + Полная Swagger документация ⭐ CURRENT

---

## 🔗 Ссылки

- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **API Base URL**: http://localhost:3000/api

---

**Разработано для FoodHub 🍽️**

