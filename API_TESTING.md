# 🧪 Тестирование API

## ✅ Проверка работоспособности

### Health Check
```bash
curl http://localhost:3000/health
```

**Ожидаемый ответ:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-11T...",
  "uptime": 123.45
}
```

---

## 📋 Доступные эндпоинты

### 🔐 Авторизация (PUBLIC - не требует токена)

#### Регистрация
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Ответ:**
```json
{
  "user": {
    "id": "uuid...",
    "username": "testuser",
    "email": "test@example.com",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Вход
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

### 👤 Профиль (требует токен)

#### Получить профиль
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Обновить профиль
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Любитель хорошей еды",
    "avatar": "https://..."
  }'
```

---

### 🏪 Рестораны

#### Создать/получить ресторан
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "googlePlaceId": "ChIJ...",
    "name": "Белуга",
    "address": "Москва, ул. Пушкина",
    "latitude": 55.7558,
    "longitude": 37.6173,
    "cuisineType": "Русская",
    "photos": ["https://..."]
  }'
```

#### Получить ресторан по ID
```bash
curl http://localhost:3000/api/restaurants/RESTAURANT_ID
```

#### Поиск ресторанов
```bash
# Все рестораны
curl http://localhost:3000/api/restaurants/search

# По названию
curl "http://localhost:3000/api/restaurants/search?query=Белуга"

# По кухне
curl "http://localhost:3000/api/restaurants/search?cuisine=Русская"

# С лимитом
curl "http://localhost:3000/api/restaurants/search?limit=10"
```

---

### 🍽️ Блюда

#### Получить меню ресторана
```bash
curl http://localhost:3000/api/dishes/restaurant/RESTAURANT_ID
```

#### Получить блюдо по ID
```bash
curl http://localhost:3000/api/dishes/DISH_ID
```

#### Добавить блюдо (требует токен)
```bash
curl -X POST http://localhost:3000/api/dishes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тартар из говядины",
    "description": "Классический французский тартар",
    "restaurantId": "RESTAURANT_ID",
    "photo": "https://...",
    "price": 1200,
    "category": "Основные блюда"
  }'
```

#### Обновить блюдо (требует токен)
```bash
curl -X PUT http://localhost:3000/api/dishes/DISH_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1300
  }'
```

#### Удалить блюдо (требует токен)
```bash
curl -X DELETE http://localhost:3000/api/dishes/DISH_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 📝 Отзывы

#### Получить отзывы на блюдо
```bash
curl http://localhost:3000/api/dishes/DISH_ID/reviews
```

#### Добавить отзыв (требует токен)
```bash
curl -X POST http://localhost:3000/api/dishes/DISH_ID/reviews \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 9.5,
    "comment": "Великолепное блюдо!",
    "foodPairing": "Рекомендую с красным вином",
    "photos": ["https://..."]
  }'
```

---

### 👅 Вкусовой профиль (требует токен)

#### Получить профиль
```bash
curl http://localhost:3000/api/taste-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Создать/обновить профиль
```bash
curl -X POST http://localhost:3000/api/taste-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "favoriteCuisines": ["Итальянская", "Японская"],
    "favoriteIngredients": ["Морепродукты", "Паста"],
    "excludedIngredients": ["Орехи"],
    "spicyLevel": "medium",
    "dietaryRestrictions": ["Без глютена"],
    "preferredPriceRangeMin": 500,
    "preferredPriceRangeMax": 3000,
    "tastePreferences": {
      "sweet": 7,
      "salty": 6,
      "sour": 5,
      "bitter": 4,
      "umami": 8
    }
  }'
```

#### Удалить профиль
```bash
curl -X DELETE http://localhost:3000/api/taste-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔍 Примеры тестирования

### 1. Полный сценарий регистрации и добавления блюда

```bash
# Шаг 1: Регистрация
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "foodlover",
    "email": "foodlover@test.com",
    "password": "password123"
  }')

# Извлечь токен
TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
echo "Token: $TOKEN"

# Шаг 2: Создать ресторан
RESTAURANT=$(curl -s -X POST http://localhost:3000/api/restaurants \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "googlePlaceId": "test123",
    "name": "Тестовый ресторан",
    "address": "Москва, Тверская 1",
    "latitude": 55.7558,
    "longitude": 37.6173,
    "cuisineType": "Русская"
  }')

RESTAURANT_ID=$(echo $RESTAURANT | python3 -c "import sys, json; print(json.load(sys.stdin)['restaurant']['id'])")
echo "Restaurant ID: $RESTAURANT_ID"

# Шаг 3: Добавить блюдо
curl -X POST http://localhost:3000/api/dishes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Борщ\",
    \"description\": \"Традиционный русский борщ\",
    \"restaurantId\": \"$RESTAURANT_ID\",
    \"price\": 450,
    \"category\": \"Супы\"
  }" | python3 -m json.tool
```

---

## 🌐 Тестирование с реального устройства

Замените `localhost` на IP компьютера:

```bash
# Health check
curl http://192.168.31.212:3000/health

# Регистрация
curl -X POST http://192.168.31.212:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 🔧 Отладка

### Проверить логи сервера
Логи выводятся в консоль где запущен `npm run dev`

### Проверить базу данных
```bash
psql foodhub

# Посмотреть пользователей
SELECT * FROM users;

# Посмотреть рестораны
SELECT * FROM restaurants;

# Посмотреть блюда
SELECT * FROM dishes;

# Посмотреть отзывы
SELECT * FROM dish_reviews;
```

---

## ⚠️ Частые ошибки

### "Endpoint not found"
- ✅ Правильно: `/api/auth/login`
- ❌ Неправильно: `/api` (базовый путь, не эндпоинт)

### 401 Unauthorized
- Убедитесь что передаете токен в заголовке
- Формат: `Authorization: Bearer YOUR_TOKEN`

### 404 Not Found
- Проверьте ID ресторана/блюда
- Убедитесь что объект существует в БД

### Network Error
- Проверьте что сервер запущен
- Проверьте firewall/брандмауэр
- Для устройства: проверьте что в одной Wi-Fi сети

---

**Готово! Теперь вы можете тестировать API! 🎉**

