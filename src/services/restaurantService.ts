import { Restaurant, Location } from '../types';
import { mockRestaurants, simulateDelay } from './mockData';
import * as googlePlacesService from './googlePlacesService';
import * as osmService from './openStreetMapService';
import * as foursquareService from './foursquareService';
import { RESTAURANT_DATA_SOURCE } from '../config/api.config';
import api from './api';

// Приоритет источников данных (проверяются по порядку)
// По умолчанию: OpenStreetMap -> Foursquare -> Google -> Mock
const DATA_SOURCE_PRIORITY = (RESTAURANT_DATA_SOURCE || 'osm,foursquare,google,mock').split(',');

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
  radius: number = 5000,
  useRealData: boolean = true
): Promise<Restaurant[]> => {
  console.log('🏪 getNearbyRestaurants called with:', { location, radius, useRealData });
  
  if (!useRealData) {
    console.log('📋 useRealData=false, используем mock данные');
    return getMockRestaurants(location, radius);
  }

  // Пробуем загрузить из различных источников по приоритету
  for (const source of DATA_SOURCE_PRIORITY) {
    try {
      switch (source.trim()) {
        case 'osm':
          if (osmService.isOSMAvailable()) {
            console.log('🗺️ Попытка загрузки через OpenStreetMap...');
            const osmRestaurants = await osmService.searchNearbyRestaurantsOSM(location, radius, 60);
            if (osmRestaurants.length > 0) {
              console.log('✅ OpenStreetMap вернул:', osmRestaurants.length, 'ресторанов');
              updateRestaurantsCache(osmRestaurants);
              return osmRestaurants;
            }
          }
          break;

        case 'foursquare':
          if (foursquareService.isFoursquareAvailable()) {
            console.log('🏪 Попытка загрузки через Foursquare...');
            const fsqRestaurants = await foursquareService.searchNearbyRestaurantsFoursquare(location, radius, 50);
            if (fsqRestaurants.length > 0) {
              console.log('✅ Foursquare вернул:', fsqRestaurants.length, 'ресторанов');
              updateRestaurantsCache(fsqRestaurants);
              return fsqRestaurants;
            }
          }
          break;

        case 'google':
          if (googlePlacesService.isGooglePlacesAvailable()) {
            console.log('🗺️ Попытка загрузки через Google Places API...');
            const googleRestaurants = await googlePlacesService.searchNearbyRestaurants(location, radius, undefined, 60);
            if (googleRestaurants.length > 0) {
              console.log('✅ Google Places вернул:', googleRestaurants.length, 'ресторанов');
              updateRestaurantsCache(googleRestaurants);
              return googleRestaurants;
            }
          }
          break;
      }
    } catch (error: any) {
      console.warn(`⚠️ ${source} недоступен:`, error.message);
      // Продолжаем к следующему источнику
      continue;
    }
  }

  // Если все источники не сработали, используем mock данные
  console.log('📋 Все внешние источники недоступны, используем mock данные');
  return getMockRestaurants(location, radius);
};

/**
 * Получение mock ресторанов с расчетом расстояний
 */
const getMockRestaurants = async (location: Location, radius: number): Promise<Restaurant[]> => {
  await simulateDelay();
  
  // Вычисляем расстояния и фильтруем
  const restaurantsWithDistance = mockRestaurants.map((restaurant) => {
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
  const filtered = restaurantsWithDistance
    .filter((r) => r.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
  
  // Если нет ресторанов в радиусе, показываем все (для demo)
  return filtered.length > 0 ? filtered : restaurantsWithDistance.sort((a, b) => a.distance - b.distance);
};
  
  // Используем mock данные
  console.log('📋 Используем mock рестораны, всего:', mockRestaurants.length);
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
  const filtered = restaurantsWithDistance
    .filter(r => r.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
  
  // Если нет ресторанов в радиусе, показываем все (для demo)
  if (filtered.length === 0) {
    console.log('⚠️ Нет ресторанов в радиусе', radius, 'м, показываем все:', restaurantsWithDistance.length);
    return restaurantsWithDistance.sort((a, b) => a.distance - b.distance);
  }
  
  console.log('✅ Возвращаем', filtered.length, 'ресторанов в радиусе', radius, 'м');
  return filtered;
};

// Кеш загруженных ресторанов для быстрого доступа по ID (только Google Places)
let restaurantsCache: Restaurant[] = [];

export const updateRestaurantsCache = (restaurants: Restaurant[]) => {
  // Обновляем кеш, добавляя новые рестораны
  const newRestaurants = restaurants.filter(
    newR => !restaurantsCache.some(cachedR => cachedR.id === newR.id)
  );
  restaurantsCache = [...restaurantsCache, ...newRestaurants];
  console.log('📦 Кеш ресторанов обновлен, всего:', restaurantsCache.length);
};

export const getRestaurantById = async (restaurantId: string): Promise<Restaurant> => {
  console.log('🔍 Поиск ресторана по ID:', restaurantId);
  await simulateDelay();
  
  // Сначала ищем в кеше (включает Google Places + mock)
  let restaurant = restaurantsCache.find(r => r.id === restaurantId);
  
  // Если не нашли, пробуем загрузить детали через Google Places API
  if (!restaurant && googlePlacesService.isGooglePlacesAvailable()) {
    try {
      console.log('🗺️ Загрузка деталей ресторана из Google Places...');
      const placeDetails = await googlePlacesService.getPlaceDetails(restaurantId);
      if (placeDetails) {
        // Конвертируем Google Place в Restaurant
        const location = placeDetails.geometry?.location 
          ? { latitude: placeDetails.geometry.location.lat, longitude: placeDetails.geometry.location.lng }
          : undefined;
        
        const photos = placeDetails.photos?.map((photo: any) => 
          googlePlacesService.getPlacePhotoUrl(photo.photo_reference, 800)
        ) || [];
        
        restaurant = {
          id: restaurantId,
          name: placeDetails.name || 'Ресторан',
          address: placeDetails.formatted_address || '',
          location: location || { latitude: 0, longitude: 0 },
          cuisineType: placeDetails.types?.[0]?.replace(/_/g, ' ') || 'Ресторан',
          phone: placeDetails.formatted_phone_number,
          photos: photos.slice(0, 3),
          averageRating: placeDetails.rating ? placeDetails.rating * 2 : undefined,
          reviewCount: placeDetails.user_ratings_total,
        };
        
        if (restaurant) {
          // Добавляем в кеш
          restaurantsCache.push(restaurant);
          console.log('✅ Детали ресторана загружены из Google Places');
          return restaurant;
        }
      }
    } catch (error: any) {
      console.warn('⚠️ Не удалось загрузить детали из Google Places:', error.message);
    }
  }
  
  // Если не нашли в кеше и Google Places, ищем в mock данных
  if (!restaurant) {
    restaurant = mockRestaurants.find(r => r.id === restaurantId);
  }
  
  if (!restaurant) {
    console.error('❌ Ресторан не найден:', restaurantId);
    throw new Error('Ресторан не найден');
  }
  
  console.log('✅ Ресторан найден:', restaurant.name);
  return restaurant;
};

export const searchRestaurants = async (
  query: string,
  location?: Location,
  useRealData: boolean = true
): Promise<Restaurant[]> => {
  // Пробуем использовать Google Places API если доступен
  if (useRealData && googlePlacesService.isGooglePlacesAvailable() && location) {
    try {
      console.log('🗺️ Поиск ресторанов через Google Places API...');
      const realRestaurants = await googlePlacesService.searchRestaurantsByText(query, location);
      // Обновляем кеш
      updateRestaurantsCache(realRestaurants);
      return realRestaurants;
    } catch (error) {
      console.warn('Google Places API недоступен для поиска, используем mock данные');
      // Fallback к mock данным при ошибке
    }
  }
  
  // Используем mock данные
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

/**
 * Получить или создать ресторан в БД
 * Конвертирует Google Places ID в UUID из нашей базы
 */
export const getOrCreateRestaurantInDB = async (restaurant: Restaurant): Promise<string> => {
  try {
    console.log('🏪 Получение/создание ресторана в БД:', restaurant.name);
    
    // Отправляем данные ресторана на backend
    const response = await api.post<{ restaurant: { id: string } }>('/restaurants', {
      googlePlaceId: restaurant.id, // Google Places ID
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      latitude: restaurant.location.latitude,
      longitude: restaurant.location.longitude,
      cuisineType: restaurant.cuisineType,
      photos: restaurant.photos,
    });
    
    console.log('✅ Ресторан в БД, UUID:', response.restaurant.id);
    return response.restaurant.id; // Возвращаем UUID из базы
  } catch (error: any) {
    console.error('❌ Ошибка создания ресторана в БД:', error);
    throw new Error('Не удалось создать ресторан в базе данных');
  }
};

