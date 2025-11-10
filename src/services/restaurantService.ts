import { Restaurant, Location } from '../types';
import { mockRestaurants, simulateDelay } from './mockData';

// Вычисление расстояния между двумя точками (формула Haversine)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Радиус Земли в метрах
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const getNearbyRestaurants = async (
  location: Location,
  radius: number = 5000
): Promise<Restaurant[]> => {
  await simulateDelay();
  
  // Вычисляем расстояния и фильтруем
  const restaurantsWithDistance = mockRestaurants.map(restaurant => {
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      restaurant.location.latitude,
      restaurant.location.longitude
    );
    
    return {
      ...restaurant,
      distance: Math.round(distance),
    };
  });
  
  // Фильтруем по радиусу и сортируем по расстоянию
  return restaurantsWithDistance
    .filter(r => r.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
};

export const getRestaurantById = async (restaurantId: string): Promise<Restaurant> => {
  await simulateDelay();
  
  const restaurant = mockRestaurants.find(r => r.id === restaurantId);
  
  if (!restaurant) {
    throw new Error('Ресторан не найден');
  }
  
  return restaurant;
};

export const searchRestaurants = async (query: string): Promise<Restaurant[]> => {
  await simulateDelay();
  
  const lowercaseQuery = query.toLowerCase();
  
  return mockRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(lowercaseQuery) ||
    restaurant.address.toLowerCase().includes(lowercaseQuery) ||
    restaurant.cuisineType.toLowerCase().includes(lowercaseQuery)
  );
};

export const getRestaurantsByCuisine = async (cuisineType: string): Promise<Restaurant[]> => {
  await simulateDelay();
  
  return mockRestaurants.filter(r => 
    r.cuisineType.toLowerCase() === cuisineType.toLowerCase()
  );
};

