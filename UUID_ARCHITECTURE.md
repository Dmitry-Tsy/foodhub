# 🔑 Архитектура UUID и типизации в FoodHub

## ✅ Правильная реализация

### 📋 **Как устроена типизация:**

```typescript
// 1. Полная модель (с обязательным id)
export interface UserAttributes {
  id: string;  // ✅ ОБЯЗАТЕЛЬНОЕ поле
  username: string;
  email: string;
  password: string;
  // ... остальные поля
}

// 2. Тип для создания (id опционален)
export interface UserCreationAttributes 
  extends Optional<UserAttributes, 'id' | 'avatar' | 'bio' | ...> {}

// 3. Sequelize модель использует оба типа
class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string;  // ✅ В экземпляре id всегда есть
  // ...
}
```

---

## 🔧 **Как это работает:**

### **При чтении из БД:**
```typescript
const user = await User.findByPk('uuid');
console.log(user.id);  // ✅ Всегда есть (тип: string)
```

### **При создании:**
```typescript
const user = await User.create({
  username: 'test',
  email: 'test@example.com',
  password: 'password',
  // id НЕ нужен! Sequelize сгенерирует автоматически
});

console.log(user.id);  // ✅ UUID уже сгенерирован!
// Например: "d499d8be-4db7-4a30-ae61-08bf7c529237"
```

---

## 🗄️ **Настройка в Sequelize:**

```typescript
User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,  // 👈 Автогенерация!
    primaryKey: true,
  },
  // ... остальные поля
}, {
  sequelize,
  tableName: 'users',
});
```

**Что происходит:**
1. `DataTypes.UUID` - тип поля в PostgreSQL: `uuid`
2. `defaultValue: DataTypes.UUIDV4` - PostgreSQL генерирует UUID автоматически
3. `primaryKey: true` - это первичный ключ (уникальный)

---

## 🔗 **Внешние ключи (Foreign Keys):**

### **Определение связи:**

```typescript
// В модели Dish
export interface DishAttributes {
  id: string;                    // ✅ Первичный ключ
  restaurantId: string;         // ✅ Внешний ключ -> restaurants.id
  addedBy: string;              // ✅ Внешний ключ -> users.id
  // ...
}

// Настройка в Sequelize
Dish.init({
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'restaurants',      // 👈 Ссылка на таблицу
      key: 'id',                 // 👈 Ссылка на поле
    },
    onDelete: 'CASCADE',         // Удалить блюда при удалении ресторана
  },
  addedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
});
```

---

## 📊 **Структура связей в FoodHub:**

```
┌─────────┐
│  users  │◄────┐
│  - id   │     │ (addedBy)
└─────────┘     │
     ▲          │
     │          │
     │ (authorId)
     │          │
┌────┴────────┬─┴───────┐
│dish_reviews │  dishes │
│  - id       │  - id   │
│  - dishId ──┼────►────┤
│  - authorId │         │
└─────────────┴─────────┘
                  │
                  │ (restaurantId)
                  ▼
            ┌─────────────┐
            │ restaurants │
            │   - id      │
            └─────────────┘
```

**Связи:**
- `dishes.restaurantId` → `restaurants.id`
- `dishes.addedBy` → `users.id`
- `dish_reviews.dishId` → `dishes.id`
- `dish_reviews.authorId` → `users.id`
- `taste_profiles.userId` → `users.id`
- `favorites.userId` → `users.id`
- `follows.followerId` → `users.id`
- `follows.followingId` → `users.id`

---

## ✅ **Преимущества UUID:**

### **1. Глобальная уникальность**
```typescript
// UUID гарантированно уникален даже между серверами
const id1 = "d499d8be-4db7-4a30-ae61-08bf7c529237";  // Сервер 1
const id2 = "a7f3c9e2-5d8b-4c1a-9f2e-3b6d7e8f9a1b";  // Сервер 2
// Никогда не пересекутся!
```

### **2. Безопасность**
```typescript
// ❌ С auto-increment легко перебрать:
// /api/users/1
// /api/users/2
// /api/users/3

// ✅ С UUID невозможно угадать:
// /api/users/d499d8be-4db7-4a30-ae61-08bf7c529237
```

### **3. Распределенные системы**
```typescript
// Можно генерировать ID на клиенте до отправки в БД
const tempId = uuidv4();
// Не нужно ждать ответа от БД для получения ID
```

### **4. Слияние баз данных**
```typescript
// При объединении двух БД UUID не конфликтуют
// В отличие от auto-increment (1, 2, 3...)
```

---

## 🧪 **Проверка работы:**

### **Создание пользователя:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@example.com", "password": "pass123"}'
```

**Ответ:**
```json
{
  "user": {
    "id": "d499d8be-4db7-4a30-ae61-08bf7c529237",  // ✅ UUID сгенерирован!
    "username": "test",
    "email": "test@example.com",
    ...
  },
  "token": "eyJhbGciOiJIUzI1..."
}
```

### **Проверка в БД:**
```sql
SELECT id, username, email FROM users WHERE username = 'test';

--                  id                  | username |      email
-- --------------------------------------+----------+------------------
--  d499d8be-4db7-4a30-ae61-08bf7c529237 | test     | test@example.com
```

---

## 🎯 **Итог:**

| Аспект | Реализация |
|--------|------------|
| **Тип в TypeScript** | `id: string` (обязательное) |
| **Генерация** | Автоматически в PostgreSQL |
| **Формат** | UUID v4 |
| **Уникальность** | Гарантирована глобально |
| **Внешние ключи** | Работают через UUID |
| **Primary Key** | ✅ Да |
| **Можно задать вручную** | ❌ Нет (генерируется автоматически) |

---

## 📝 **Все модели с UUID:**

1. ✅ **users** - `id` (UUID)
2. ✅ **restaurants** - `id` (UUID)
3. ✅ **dishes** - `id` (UUID)
   - `restaurantId` (FK → restaurants.id)
   - `addedBy` (FK → users.id)
4. ✅ **dish_reviews** - `id` (UUID)
   - `dishId` (FK → dishes.id)
   - `authorId` (FK → users.id)
5. ✅ **taste_profiles** - `id` (UUID)
   - `userId` (FK → users.id)
6. ✅ **favorites** - `id` (UUID)
   - `userId` (FK → users.id)
7. ✅ **follows** - `id` (UUID)
   - `followerId` (FK → users.id)
   - `followingId` (FK → users.id)
8. ✅ **user_achievements** - `id` (UUID)
   - `userId` (FK → users.id)

---

**Архитектура правильная! UUID генерируется автоматически, внешние ключи работают! ✅**

