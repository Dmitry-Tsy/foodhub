// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  trustScore: number;
  followersCount: number;
  followingCount: number;
  bio?: string;
  createdAt: string;
}

// Restaurant Types
export interface Location {
  latitude: number;
  longitude: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  location: Location;
  cuisineType: string;
  distance?: number; // в метрах
  phone?: string;
  website?: string;
  openingHours?: string;
  photos?: string[];
  averageRating?: number;
  reviewCount?: number;
}

// Dish Types
export interface Dish {
  id: string;
  name: string;
  description?: string;
  restaurantId: string;
  restaurant?: Restaurant;
  addedBy: string;
  addedByUser?: User;
  photo?: string;
  averageRating: number;
  reviewCount: number;
  price?: number;
  category?: string;
  ingredients?: string[];
  createdAt: string;
}

// Review Types
export interface ReviewPhoto {
  url: string;
  rating?: number; // Рейтинг фото (0.0 - 10.0)
  voteCount?: number; // Количество голосов за фото
  score?: number; // rating * voteCount (для сортировки)
}

export interface DishReview {
  id: string;
  dishId: string;
  dish?: Dish;
  authorId: string;
  author?: User;
  rating: number; // 0.0 - 10.0
  comment?: string;
  foodPairing?: string; // рекомендуемый напиток
  photos: string[];
  photoRatings?: Record<string, ReviewPhoto>; // Рейтинги фото по URL
  createdAt: string;
  updatedAt: string;
  helpfulCount?: number;
}

// Trust Rating Types
export interface TrustRating {
  id: string;
  fromUserId: string;
  toUserId: string;
  rating: number; // 1-5
  createdAt: string;
}

// Follow Types
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

// Feed Types
export interface FeedItem {
  id: string;
  type: 'review' | 'follow' | 'dish_added';
  review?: DishReview;
  user?: User;
  dish?: Dish;
  createdAt: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean; // Режим гостя - просмотр без авторизации
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Duplicate Check Types
export interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarDish?: string;
  similarity?: number;
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  RestaurantDetail: { restaurantId: string };
  DishDetail: { dishId: string };
  AddReview: { dishId: string; restaurantId: string };
  ReviewDetail: { reviewId: string; dishId: string };
  AddDish: { restaurantId: string };
  UserProfile: { userId: string };
  EditProfile: undefined;
  TasteProfile: undefined;
  Achievements: undefined;
  Recommendations: undefined;
  ConnectivityTest: undefined;
  LogViewer: undefined;
};

export type MainTabParamList = {
  Search: undefined;
  Add: undefined;
  Feed: undefined;
  Logs: undefined;
  Profile: undefined;
};

// Re-export profile types
export * from './profile';

