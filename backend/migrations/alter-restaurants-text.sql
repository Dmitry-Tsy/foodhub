-- Миграция: Изменение типов полей restaurants с VARCHAR(255) на TEXT
-- Это необходимо для поддержки длинных строк (например, длинных URL фотографий)

-- Изменяем googlePlaceId
ALTER TABLE restaurants ALTER COLUMN "googlePlaceId" TYPE TEXT;

-- Изменяем name
ALTER TABLE restaurants ALTER COLUMN "name" TYPE TEXT;

-- Изменяем address
ALTER TABLE restaurants ALTER COLUMN "address" TYPE TEXT;

-- Изменяем cuisineType
ALTER TABLE restaurants ALTER COLUMN "cuisineType" TYPE TEXT;

-- Изменяем phone
ALTER TABLE restaurants ALTER COLUMN "phone" TYPE TEXT;

-- Изменяем website
ALTER TABLE restaurants ALTER COLUMN "website" TYPE TEXT;

-- Изменяем тип элементов массива photos с VARCHAR на TEXT
-- В PostgreSQL массивы строк хранятся как TEXT[], поэтому нужно явно изменить тип
ALTER TABLE restaurants ALTER COLUMN "photos" TYPE TEXT[] USING "photos"::TEXT[];

