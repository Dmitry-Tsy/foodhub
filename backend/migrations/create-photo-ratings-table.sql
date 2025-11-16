-- Миграция для создания таблицы photo_ratings
-- Хранит лайки/оценки пользователей для фото из отзывов

CREATE TABLE IF NOT EXISTS "photo_ratings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "photoUrl" TEXT NOT NULL,
  "reviewId" UUID NOT NULL,
  "dishId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "photo_ratings_reviewId_fkey" 
    FOREIGN KEY ("reviewId") 
    REFERENCES "dish_reviews"("id") 
    ON DELETE CASCADE,
    
  CONSTRAINT "photo_ratings_dishId_fkey" 
    FOREIGN KEY ("dishId") 
    REFERENCES "dishes"("id") 
    ON DELETE CASCADE,
    
  CONSTRAINT "photo_ratings_userId_fkey" 
    FOREIGN KEY ("userId") 
    REFERENCES "users"("id") 
    ON DELETE CASCADE
);

-- Уникальный индекс: один пользователь может лайкнуть одно фото только один раз
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_photo_rating" 
  ON "photo_ratings"("photoUrl", "reviewId", "userId");

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS "photo_ratings_dishId_idx" ON "photo_ratings"("dishId");
CREATE INDEX IF NOT EXISTS "photo_ratings_reviewId_idx" ON "photo_ratings"("reviewId");
CREATE INDEX IF NOT EXISTS "photo_ratings_userId_idx" ON "photo_ratings"("userId");
CREATE INDEX IF NOT EXISTS "photo_ratings_photoUrl_idx" ON "photo_ratings"("photoUrl");

-- Комментарии к таблице и колонкам
COMMENT ON TABLE "photo_ratings" IS 'Лайки/оценки пользователей для фото из отзывов';
COMMENT ON COLUMN "photo_ratings"."photoUrl" IS 'URL фото из отзыва';
COMMENT ON COLUMN "photo_ratings"."reviewId" IS 'ID отзыва, к которому относится фото';
COMMENT ON COLUMN "photo_ratings"."dishId" IS 'ID блюда (для быстрого поиска)';
COMMENT ON COLUMN "photo_ratings"."userId" IS 'ID пользователя, который поставил лайк';

