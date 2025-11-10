import { User, Restaurant, Dish, DishReview, FeedItem } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'foodlover',
    email: 'foodlover@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    trustScore: 4.5,
    followersCount: 150,
    followingCount: 80,
    bio: 'Гурман и любитель хорошей еды',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    username: 'chef_master',
    email: 'chef@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    trustScore: 4.8,
    followersCount: 320,
    followingCount: 50,
    bio: 'Профессиональный шеф-повар',
    createdAt: '2024-01-10T10:00:00Z',
  },
];

// Mock Restaurants
export const mockRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Белуга',
    address: 'Смоленская набережная, 7, Москва',
    location: { latitude: 55.7464, longitude: 37.5771 },
    cuisineType: 'Европейская',
    distance: 500,
    phone: '+7 (495) 123-45-67',
    photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'],
    averageRating: 8.5,
    reviewCount: 124,
  },
  {
    id: 'r2',
    name: 'Twins Garden',
    address: 'Страстной бульвар, 8А, Москва',
    location: { latitude: 55.7656, longitude: 37.6054 },
    cuisineType: 'Авторская',
    distance: 1200,
    phone: '+7 (495) 987-65-43',
    photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0'],
    averageRating: 9.2,
    reviewCount: 89,
  },
  {
    id: 'r3',
    name: 'Сахалин',
    address: 'Якиманка, 2/9, Москва',
    location: { latitude: 55.7425, longitude: 37.6122 },
    cuisineType: 'Морепродукты',
    distance: 800,
    phone: '+7 (495) 555-12-34',
    photos: ['https://images.unsplash.com/photo-1552566626-52f8b828add9'],
    averageRating: 8.8,
    reviewCount: 156,
  },
];

// Mock Dishes
export const mockDishes: Dish[] = [
  {
    id: 'd1',
    name: 'Тартар из говядины',
    description: 'Классический французский тартар с каперсами и яичным желтком',
    restaurantId: 'r1',
    addedBy: '1',
    photo: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    averageRating: 8.7,
    reviewCount: 45,
    price: 1200,
    category: 'Основные блюда',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'd2',
    name: 'Паста карбонара',
    description: 'Традиционная итальянская паста с беконом и сыром пекорино',
    restaurantId: 'r1',
    addedBy: '2',
    photo: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
    averageRating: 9.1,
    reviewCount: 67,
    price: 890,
    category: 'Паста',
    createdAt: '2024-02-05T10:00:00Z',
  },
  {
    id: 'd3',
    name: 'Устрицы',
    description: 'Свежие устрицы с лимоном и соусом мигнонет',
    restaurantId: 'r3',
    addedBy: '1',
    photo: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41',
    averageRating: 9.5,
    reviewCount: 32,
    price: 2500,
    category: 'Закуски',
    createdAt: '2024-02-10T10:00:00Z',
  },
];

// Mock Reviews
export const mockReviews: DishReview[] = [
  {
    id: 'rev1',
    dishId: 'd1',
    authorId: '1',
    rating: 8.5,
    comment: 'Отличный тартар! Мясо свежее, идеальная подача.',
    foodPairing: 'Бордо красное сухое',
    photos: ['https://images.unsplash.com/photo-1544025162-d76694265947'],
    createdAt: '2024-03-01T14:30:00Z',
    updatedAt: '2024-03-01T14:30:00Z',
    helpfulCount: 12,
  },
  {
    id: 'rev2',
    dishId: 'd2',
    authorId: '2',
    rating: 9.2,
    comment: 'Лучшая карбонара в городе! Соус нежный, паста аль денте.',
    foodPairing: 'Просекко',
    photos: [],
    createdAt: '2024-03-02T19:15:00Z',
    updatedAt: '2024-03-02T19:15:00Z',
    helpfulCount: 25,
  },
  {
    id: 'rev3',
    dishId: 'd3',
    authorId: '1',
    rating: 9.8,
    comment: 'Невероятно свежие устрицы! Чувствуется море.',
    foodPairing: 'Шабли',
    photos: ['https://images.unsplash.com/photo-1626200419199-391ae4be7a41'],
    createdAt: '2024-03-03T20:00:00Z',
    updatedAt: '2024-03-03T20:00:00Z',
    helpfulCount: 18,
  },
];

// Mock Feed
export const mockFeed: FeedItem[] = [
  {
    id: 'feed1',
    type: 'review',
    review: mockReviews[2],
    user: mockUsers[0],
    dish: mockDishes[2],
    createdAt: '2024-03-03T20:00:00Z',
  },
  {
    id: 'feed2',
    type: 'review',
    review: mockReviews[1],
    user: mockUsers[1],
    dish: mockDishes[1],
    createdAt: '2024-03-02T19:15:00Z',
  },
  {
    id: 'feed3',
    type: 'dish_added',
    user: mockUsers[0],
    dish: mockDishes[2],
    createdAt: '2024-02-10T10:00:00Z',
  },
];

// Helper function to simulate API delay
export const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

