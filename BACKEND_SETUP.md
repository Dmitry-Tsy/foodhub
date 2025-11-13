# 🚀 FoodHub Backend - Полная документация

## 📦 Что создано

### Структура бэкенда:
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # PostgreSQL конфигурация
│   ├── models/                  # 8 моделей данных
│   │   ├── User.ts              # Пользователи
│   │   ├── Restaurant.ts        # Рестораны
│   │   ├── Dish.ts              # Блюда
│   │   ├── DishReview.ts        # Отзывы
│   │   ├── TasteProfile.ts      # Вкусовые профили
│   │   ├── Follow.ts            # Подписки
│   │   ├── Favorite.ts          # Избранное
│   │   ├── UserAchievement.ts   # Достижения
│   │   └── index.ts             # Связи моделей
│   ├── controllers/
│   │   ├── authController.ts    # Авторизация
│   │   └── dishController.ts    # Блюда и отзывы
│   ├── middleware/
│   │   └── auth.ts              # JWT middleware
│   ├── routes/
│   │   ├── auth.ts              # Auth endpoints
│   │   └── dishes.ts            # Dishes endpoints
│   ├── app.ts                   # Express app
│   └── server.ts                # Entry point
├── .env                         # Переменные окружения
├── .env.example                 # Пример конфигурации
├── tsconfig.json                # TypeScript config
├── nodemon.json                 # Nodemon config
├── package.json                 # Зависимости
└── README.md                    # Документация

```

---

## 🗄️ Модели данных (PostgreSQL)

### 1. Users (пользователи)
```typescript
{
  id: UUID,
  username: string (unique),
  email: string (unique),
  password: string (hashed),
  avatar?: string,
  bio?: string,
  trustScore: decimal(3,2),      // 0.00-5.00
  followersCount: integer,
  followingCount: integer,
  reviewsCount: integer,
  photosCount: integer,
  dishesAddedCount: integer,
  cuisinesTried: integer,
  createdAt, updatedAt
}
```

### 2. Restaurants (рестораны)
```typescript
{
  id: UUID,
  googlePlaceId?: string,
  name: string,
  address: string,
  latitude: decimal(10,8),
  longitude: decimal(11,8),
  cuisineType: string,
  phone?: string,
  website?: string,
  openingHours?: text,
  photos: string[],
  averageRating?: decimal(4,2),
  reviewCount: integer,
  createdAt, updatedAt
}
```

### 3. Dishes (блюда)
```typescript
{
  id: UUID,
  name: string,
  description?: text,
  restaurantId: UUID → restaurants.id,
  addedBy: UUID → users.id,
  photo?: string,
  averageRating: decimal(4,2),
  reviewCount: integer,
  price?: integer,
  category?: string,
  createdAt, updatedAt
}
```

### 4. DishReviews (отзывы)
```typescript
{
  id: UUID,
  dishId: UUID → dishes.id,
  authorId: UUID → users.id,
  rating: decimal(4,2),         // 0.00-10.00
  comment?: text,
  foodPairing?: string,
  photos: string[],
  helpfulCount: integer,
  createdAt, updatedAt
}
```

### 5. TasteProfiles (вкусовые профили)
```typescript
{
  id: UUID,
  userId: UUID → users.id (unique),
  favoriteCuisines: string[],
  favoriteIngredients: string[],
  excludedIngredients: string[],
  spicyLevel: enum('none','mild','medium','hot','extreme'),
  dietaryRestrictions: string[],
  preferredPriceRangeMin: integer,
  preferredPriceRangeMax: integer,
  tastePreferences: jsonb {
    sweet: 0-10,
    salty: 0-10,
    sour: 0-10,
    bitter: 0-10,
    umami: 0-10
  },
  createdAt, updatedAt
}
```

### 6-8. Социальные модели
```typescript
// Follows (подписки)
{ followerId: UUID, followingId: UUID }

// Favorites (избранное)
{ userId: UUID, restaurantId: UUID }

// UserAchievements (достижения)
{ userId: UUID, achievementId: string, progress: 0-100, unlockedAt? }
```

---

## 📡 API Endpoints

### Готовые endpoints:

**Authentication:**
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь (auth required)
- `PUT /api/auth/profile` - Обновление профиля (auth required)

**Dishes:**
- `GET /api/dishes/restaurant/:restaurantId` - Меню ресторана
- `GET /api/dishes/:dishId` - Блюдо по ID
- `POST /api/dishes` - Добавить блюдо (auth required)
- `GET /api/dishes/:dishId/reviews` - Отзывы блюда
- `POST /api/dishes/:dishId/reviews` - Добавить отзыв (auth required)

### Нужно добавить:

**Restaurants:**
- `GET /api/restaurants/nearby` - Рестораны поблизости
- `GET /api/restaurants/:id` - Ресторан по ID
- `POST /api/restaurants` - Добавить ресторан

**Taste Profile:**
- `GET /api/taste-profile` - Получить профиль
- `POST /api/taste-profile` - Создать профиль
- `PUT /api/taste-profile` - Обновить профиль

**Achievements:**
- `GET /api/achievements` - Все достижения
- `GET /api/achievements/user` - Достижения пользователя
- `POST /api/achievements/check` - Проверка новых достижений

**Social:**
- `POST /api/follow/:userId` - Подписаться
- `DELETE /api/follow/:userId` - Отписаться
- `GET /api/followers` - Список подписчиков
- `POST /api/favorites/:restaurantId` - В избранное

**Upload:**
- `POST /api/upload/photo` - Загрузка фото (Cloudinary)

---

## 🔧 Установка и запуск

### 1. Установите PostgreSQL:

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt install postgresql
sudo systemctl start postgresql
```

### 2. Создайте базу данных:
```bash
createdb foodhub
# или
psql -U postgres -c "CREATE DATABASE foodhub;"
```

### 3. Установите зависимости:
```bash
cd backend
npm install
```

### 4. Настройте .env:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodhub
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

### 5. Запустите сервер:
```bash
npm run dev
```

Сервер запустится на `http://localhost:3000`

---

## 🧪 Тестирование API

### Регистрация:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Вход:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Добавление блюда:
```bash
curl -X POST http://localhost:3000/api/dishes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "Паста Карбонара",
    "description": "Классическая итальянская паста",
    "restaurantId": "uuid",
    "price": 750,
    "category": "Паста"
  }'
```

---

## 🔗 Подключение фронтенда

### Обновите API URL в React Native:

**src/services/api.ts:**
```typescript
const API_URL = 'http://localhost:3000/api';
// или для реального устройства:
// const API_URL = 'http://192.168.1.X:3000/api';
```

### Используйте реальные endpoints вместо mock:

**src/services/authService.ts:**
```typescript
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data.data;
};
```

---

## 📊 Статистика

**Создано:**
- 📄 17 TypeScript файлов
- 🗄️ 8 моделей данных
- 🎮 2 контроллера
- 🛣️ 2 маршрута
- 🔐 JWT аутентификация
- 📝 Полная документация

**Размер:** ~500 строк кода бэкенда

**Технологии:**
- Node.js + Express
- PostgreSQL + Sequelize ORM
- TypeScript
- JWT
- bcryptjs
- CORS

---

## 🎯 Следующие шаги

1. Установите PostgreSQL
2. Создайте базу данных `foodhub`
3. Настройте `.env`
4. Запустите `npm run dev`
5. Проверьте `http://localhost:3000/health`
6. Тестируйте endpoints

**Бэкенд готов к работе!** 🚀

---

**Версия:** 1.0.0  
**Дата:** 11 ноября 2024  
**Статус:** ✅ Базовая структура готова

