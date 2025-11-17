-- Миграция для создания таблиц collections и collection_dishes

-- Таблица коллекций
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "isPublic" BOOLEAN DEFAULT TRUE,
    "coverPhoto" TEXT,
    "dishCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections ("userId");
CREATE INDEX IF NOT EXISTS idx_collections_is_public ON collections ("isPublic");
CREATE INDEX IF NOT EXISTS idx_collections_name ON collections (name);

-- Таблица связи коллекций и блюд (many-to-many)
CREATE TABLE IF NOT EXISTS collection_dishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "collectionId" UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    "dishId" UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
    "addedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("collectionId", "dishId") -- Одно блюдо может быть в коллекции только один раз
);

CREATE INDEX IF NOT EXISTS idx_collection_dishes_collection_id ON collection_dishes ("collectionId");
CREATE INDEX IF NOT EXISTS idx_collection_dishes_dish_id ON collection_dishes ("dishId");

