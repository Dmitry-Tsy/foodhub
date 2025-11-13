// Типы для вкусового профиля и достижений

export interface TasteProfile {
  userId: string;
  favoriteCuisines: string[]; // ["Итальянская", "Японская", ...]
  favoriteIngredients: string[]; // ["Морепродукты", "Грибы", ...]
  excludedIngredients: string[]; // ["Арахис", "Лактоза", ...] - аллергии
  spicyLevel: 'none' | 'mild' | 'medium' | 'hot' | 'extreme';
  dietaryRestrictions: DietType[];
  preferredPriceRange: [number, number]; // [min, max]
  tastePreferences: {
    sweet: number; // 0-10
    salty: number;
    sour: number;
    bitter: number;
    umami: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type DietType = 
  | 'vegetarian' 
  | 'vegan' 
  | 'pescatarian' 
  | 'keto' 
  | 'paleo' 
  | 'gluten-free'
  | 'dairy-free'
  | 'halal'
  | 'kosher';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Ionicons name
  category: AchievementCategory;
  condition: {
    type: 'reviews_count' | 'cuisines_tried' | 'photos_uploaded' | 'trust_score' | 'dishes_added' | 'followers_count';
    target: number;
  };
  reward?: {
    points: number;
    badge: string;
  };
}

export type AchievementCategory = 'critic' | 'explorer' | 'photographer' | 'social' | 'contributor';

export interface UserAchievement {
  achievementId: string;
  userId: string;
  unlockedAt: string;
  progress: number; // 0-100
}

export interface Recommendation {
  type: 'dish' | 'restaurant' | 'cuisine';
  itemId: string;
  score: number; // 0-100 - насколько подходит
  reason: string; // "Вам понравится, потому что..."
  tags: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'try_cuisines' | 'write_reviews' | 'explore_area' | 'photo_challenge';
  goal: {
    target: number;
    current: number;
  };
  reward: {
    points: number;
    achievement?: string;
  };
  startDate: string;
  endDate: string;
  participants: number;
}

export interface Pairing {
  dishId: string;
  drink: string;
  drinkType: 'wine' | 'beer' | 'cocktail' | 'sake' | 'tea' | 'other';
  confidence: number; // 0-100
  reason: string;
  addedBy: 'ai' | 'user';
  userId?: string;
  votes: number;
}

