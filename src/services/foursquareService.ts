import axios from 'axios';
import { Restaurant, Location } from '../types';

// Foursquare Places API
// Регистрация: https://developer.foursquare.com/
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY || '';
const FOURSQUARE_API_SECRET = process.env.FOURSQUARE_API_SECRET || '';
const FOURSQUARE_API_URL = 'https://api.foursquare.com/v3/places';

interface FoursquarePlace {
  fsq_id: string;
  name: string;
  location: {
    address?: string;
    locality?: string;
    region?: string;
    formatted_address?: string;
    latitude: number;
    longitude: number;
  };
  categories: Array<{
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }>;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  rating?: number;
  tips?: Array<{
    text: string;
  }>;
  photos?: Array<{
    id: string;
    created_at: string;
    prefix: string;
    suffix: string;
    width: number;
    height: number;
  }>;
  price?: number; // 1-4
  tel?: string;
  website?: string;
}

interface FoursquareResponse {
  results: FoursquarePlace[];
  context: {
    geo_bounds?: {
      circle: {
        center: {
          latitude: number;
          longitude: number;
        };
        radius: number;
      };
    };
  };
}

/**
 * Поиск ресторанов через Foursquare Places API
 * Бесплатный tier: 50,000 запросов/день
 */
export const searchNearbyRestaurantsFoursquare = async (
  location: Location,
  radius: number = 5000,
  maxResults: number = 50
): Promise<Restaurant[]> => {
  try {
    if (!FOURSQUARE_API_KEY) {
      throw new Error('Foursquare API Key не настроен');
    }

    console.log('🏪 Поиск ресторанов через Foursquare...', { location, radius });

    // Foursquare использует категорию 13065 для ресторанов
    const categories = '13065,13068,13377,13379'; // Restaurants, Cafes, Fast Food, Bars

    // Foursquare Places API v3 использует другой формат
    // Нужен API ключ в заголовке Authorization
    const response = await axios.get<FoursquareResponse>(
      `${FOURSQUARE_API_URL}/search`,
      {
        params: {
          query: 'restaurant',
          ll: `${location.latitude},${location.longitude}`,
          radius: radius,
          categories: categories,
          limit: Math.min(maxResults, 50), // Foursquare ограничивает 50 за запрос
          sort: 'DISTANCE',
        },
        headers: {
          Authorization: FOURSQUARE_API_KEY, // В формате "Bearer YOUR_API_KEY" или просто API_KEY
          'Accept': 'application/json',
        },
      }
    );

    if (!response.data || !response.data.results || response.data.results.length === 0) {
      console.log('⚠️ Foursquare не нашел ресторанов');
      return [];
    }

    console.log('✅ Foursquare вернул:', response.data.results.length, 'ресторанов');

    // Конвертируем Foursquare данные в формат Restaurant
    const restaurants: Restaurant[] = response.data.results.map((place) => {
      const mainLocation = place.geocodes?.main || place.location;
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        mainLocation.latitude,
        mainLocation.longitude
      );

      const address = place.location.formatted_address || 
                     place.location.address || 
                     `${place.location.locality || ''}, ${place.location.region || ''}`.trim();

      const cuisineType = place.categories?.[0]?.name || 'Ресторан';

      // Получаем фото
      const photos = place.photos?.slice(0, 3).map((photo) => 
        `${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`
      );

      return {
        id: `fsq_${place.fsq_id}`,
        name: place.name,
        address,
        location: {
          latitude: mainLocation.latitude,
          longitude: mainLocation.longitude,
        },
        cuisineType,
        distance: Math.round(distance),
        phone: place.tel,
        website: place.website,
        photos,
        averageRating: place.rating ? place.rating : undefined, // Foursquare использует шкалу 0-10 (совпадает с нашей)
      };
    });

    return restaurants;
  } catch (error: any) {
    console.error('❌ Ошибка поиска через Foursquare:', error);
    throw new Error('Не удалось загрузить рестораны через Foursquare');
  }
};

/**
 * Вычисление расстояния между двумя точками (формула Haversine)
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Радиус Земли в метрах
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Проверка доступности Foursquare API
 */
export const isFoursquareAvailable = (): boolean => {
  return !!FOURSQUARE_API_KEY && FOURSQUARE_API_KEY.length > 0;
};

