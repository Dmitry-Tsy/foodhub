-- Миграция для добавления поля ingredients в таблицу dishes
-- ingredients будет массивом строк (TEXT[])

-- Добавляем колонку ingredients
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS "ingredients" TEXT[] DEFAULT '{}';

-- Комментарий к колонке
COMMENT ON COLUMN dishes."ingredients" IS 'Список ингредиентов блюда';

