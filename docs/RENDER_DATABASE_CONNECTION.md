# Подключение к PostgreSQL на Render через pgAdmin

## Шаг 1: Получение параметров подключения из Render

1. Войдите в [Render Dashboard](https://dashboard.render.com/)
2. Найдите ваш **PostgreSQL** сервис в списке
3. Перейдите в раздел **"Info"** или **"Connections"**
4. Найдите строку подключения **"Internal Database URL"** или **"External Connection String"**

Строка подключения обычно выглядит так:
```
postgresql://username:password@host:port/database?sslmode=require
```

## Шаг 2: Парсинг параметров подключения

Из строки подключения извлеките:
- **Host** (хост)
- **Port** (порт) - обычно 5432
- **Database** (имя базы данных)
- **Username** (имя пользователя)
- **Password** (пароль)

Например, из строки:
```
postgresql://foodhub_user:abc123@dpg-xxxxx-a.frankfurt-postgres.render.com:5432/foodhub_db
```

Получаем:
- Host: `dpg-xxxxx-a.frankfurt-postgres.render.com`
- Port: `5432`
- Database: `foodhub_db`
- Username: `foodhub_user`
- Password: `abc123`

## Шаг 3: Настройка подключения в pgAdmin

### Вариант 1: Через UI pgAdmin

1. Откройте **pgAdmin**
2. Правой кнопкой на **"Servers"** → **"Create"** → **"Server..."**
3. Во вкладке **"General"**:
   - Name: `FoodHub Render` (любое имя)

4. Во вкладке **"Connection"**:
   - **Host name/address**: `dpg-xxxxx-a.frankfurt-postgres.render.com` (ваш хост)
   - **Port**: `5432`
   - **Maintenance database**: `foodhub_db` (имя вашей БД)
   - **Username**: `foodhub_user` (ваш пользователь)
   - **Password**: `abc123` (ваш пароль)
   - ✅ **Save password**: отметьте галочку

5. Во вкладке **"SSL"**:
   - **SSL mode**: выберите `Require` или `Prefer`
   - Это **критично** для Render!

6. Нажмите **"Save"**

### Вариант 2: Через Connection String

1. Правой кнопкой на **"Servers"** → **"Create"** → **"Server..."**
2. Во вкладке **"Connection"**:
   - Вставьте полную строку подключения в поле **"Connection string"**
   - Формат: `postgresql://username:password@host:port/database`

## Важные замечания

### SSL обязательно!
Render требует SSL соединения. Убедитесь, что:
- **SSL mode** установлен на `Require` или `Prefer`
- В pgAdmin вкладка **SSL** настроена правильно

### Firewall на Render
Если подключение не работает:
1. В Render Dashboard → ваш PostgreSQL → **"Network"**
2. Убедитесь, что разрешены внешние подключения
3. Возможно, нужно добавить ваш IP в whitelist

### Альтернатива: psql в терминале

Если pgAdmin не работает, можно подключиться через psql:

```bash
psql "postgresql://username:password@host:port/database?sslmode=require"
```

Или с переменными окружения:
```bash
export PGHOST=your-host.render.com
export PGPORT=5432
export PGDATABASE=your-database
export PGUSER=your-username
export PGPASSWORD=your-password
export PGSSLMODE=require

psql
```

## Шаг 4: Выполнение миграции

После подключения выполните SQL миграцию:

1. В pgAdmin найдите вашу базу данных
2. Правой кнопкой → **"Query Tool"**
3. Откройте файл `backend/migrations/alter-restaurants-text.sql`
4. Скопируйте содержимое и выполните в Query Tool (F5)

Или выполните команды напрямую:

```sql
ALTER TABLE restaurants ALTER COLUMN "googlePlaceId" TYPE TEXT;
ALTER TABLE restaurants ALTER COLUMN "name" TYPE TEXT;
ALTER TABLE restaurants ALTER COLUMN "address" TYPE TEXT;
ALTER TABLE restaurants ALTER COLUMN "cuisineType" TYPE TEXT;
ALTER TABLE restaurants ALTER COLUMN "phone" TYPE TEXT;
ALTER TABLE restaurants ALTER COLUMN "website" TYPE TEXT;
ALTER TABLE restaurants ALTER COLUMN "photos" TYPE TEXT[] USING "photos"::TEXT[];
```

## Проверка подключения

После подключения проверьте:
1. Видите ли вы таблицу `restaurants` в базе данных
2. Можете ли выполнить запрос: `SELECT * FROM restaurants LIMIT 1;`

## Troubleshooting

### Ошибка "connection timeout"
- Проверьте, что хост и порт правильные
- Убедитесь, что SSL включен

### Ошибка "password authentication failed"
- Проверьте правильность пароля в Render Dashboard
- Попробуйте сбросить пароль в Render

### Ошибка "SSL required"
- Обязательно установите **SSL mode** на `Require` в pgAdmin

## Безопасность

⚠️ **Важно**: 
- Не коммитьте пароли в Git
- Используйте переменные окружения
- Не делитесь строками подключения публично

