import axios from 'axios';
import { Restaurant, Location } from '../types';

// Overpass API для запросов к OpenStreetMap
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Nominatim API для геокодирования (опционально)
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org';

interface OSMCenter {
  lat: number;
  lon: number;
}

interface OSMNode {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: OSMCenter;
  tags: {
    name?: string;
    'name:ru'?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
    'addr:full'?: string;
    'addr:place'?: string;
    amenity?: string;
    cuisine?: string;
    'cuisine:ru'?: string;
    phone?: string;
    website?: string;
    image?: string;
    [key: string]: string | undefined;
  };
}

interface OSMResponse {
  elements: OSMNode[];
}

/**
 * Поиск ресторанов поблизости через OpenStreetMap Overpass API
 * Полностью бесплатный и без ограничений
 */
export const searchNearbyRestaurantsOSM = async (
  location: Location,
  radius: number = 5000,
  maxResults: number = 60
): Promise<Restaurant[]> => {
  try {
    console.log('🗺️ Поиск ресторанов через OpenStreetMap...', { location, radius });

    // Overpass QL запрос для поиска ресторанов в радиусе
    // Ищем amenity=restaurant, amenity=cafe, amenity=fast_food, amenity=bar
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"^(restaurant|cafe|fast_food|bar|food_court|bistro|pub|pizzeria)$"](around:${radius},${location.latitude},${location.longitude});
        way["amenity"~"^(restaurant|cafe|fast_food|bar|food_court|bistro|pub|pizzeria)$"](around:${radius},${location.latitude},${location.longitude});
        relation["amenity"~"^(restaurant|cafe|fast_food|bar|food_court|bistro|pub|pizzeria)$"](around:${radius},${location.latitude},${location.longitude});
      );
      out center;
    `;

    const response = await axios.post<OSMResponse>(OVERPASS_API_URL, query, {
      headers: {
        'Content-Type': 'text/plain',
      },
      timeout: 30000, // 30 секунд таймаут
    });

    if (!response.data || !response.data.elements || response.data.elements.length === 0) {
      console.log('⚠️ OpenStreetMap не нашел ресторанов в радиусе');
      return [];
    }

    console.log('✅ OpenStreetMap вернул:', response.data.elements.length, 'мест');

    // Конвертируем OSM данные в формат Restaurant
    const restaurants: Restaurant[] = response.data.elements
      .slice(0, maxResults) // Ограничиваем количество
      .map((element) => {
        const tags = element.tags || {};
        const name = tags['name:ru'] || tags.name || 'Ресторан';
        
        // Для ways и relations используем center, для nodes - lat/lon
        let lat: number;
        let lon: number;
        if (element.type === 'way' || element.type === 'relation') {
          lat = element.center?.lat || element.lat || location.latitude;
          lon = element.center?.lon || element.lon || location.longitude;
        } else {
          lat = element.lat || location.latitude;
          lon = element.lon || location.longitude;
        }

        // Формируем адрес
        const addressParts = [
          tags['addr:street'],
          tags['addr:housenumber'],
          tags['addr:city'] || tags['addr:place'],
        ].filter(Boolean);
        const address = addressParts.length > 0
          ? addressParts.join(', ')
          : tags['addr:full'] || 'Адрес не указан';

        // Определяем тип кухни
        const cuisineType = tags.cuisine || tags['cuisine:ru'] || getCuisineTypeFromAmenity(tags.amenity);

        // Вычисляем расстояние от пользователя
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          lat,
          lon
        );

        return {
          id: `osm_${element.type}_${element.id}`, // Уникальный ID из OSM
          name,
          address,
          location: {
            latitude: lat,
            longitude: lon,
          },
          cuisineType,
          distance: Math.round(distance),
          phone: tags.phone,
          website: tags.website,
          photos: tags.image ? [tags.image] : undefined,
        };
      })
      .filter((r) => !(r.name === 'Ресторан' && r.address === 'Адрес не указан')) // Фильтруем слишком общие результаты
      .sort((a, b) => (a.distance || 0) - (b.distance || 0)); // Сортируем по расстоянию

    console.log('✅ Конвертировано ресторанов:', restaurants.length);
    return restaurants;
  } catch (error: any) {
    console.error('❌ Ошибка поиска через OpenStreetMap:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw new Error('Не удалось загрузить рестораны через OpenStreetMap');
  }
};

/**
 * Определение типа кухни из amenity тега
 */
const getCuisineTypeFromAmenity = (amenity?: string): string => {
  const map: Record<string, string> = {
    restaurant: 'Ресторан',
    cafe: 'Кафе',
    fast_food: 'Фастфуд',
    bar: 'Бар',
    food_court: 'Фудкорт',
    bistro: 'Бистро',
    pub: 'Паб',
    pizzeria: 'Пиццерия',
  };
  return amenity ? map[amenity] || 'Ресторан' : 'Ресторан';
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
 * Геокодирование адреса через Nominatim (обратный геокодинг)
 */
export const geocodeAddress = async (address: string): Promise<Location | null> => {
  try {
    const response = await axios.get(`${NOMINATIM_API_URL}/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        'accept-language': 'ru',
      },
      headers: {
        'User-Agent': 'FoodHub App', // Требуется Nominatim
      },
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      };
    }
    return null;
  } catch (error: any) {
    console.error('Ошибка геокодирования:', error);
    return null;
  }
};

/**
 * Обратное геокодирование (координаты -> адрес)
 */
export const reverseGeocode = async (location: Location): Promise<string | null> => {
  try {
    const response = await axios.get(`${NOMINATIM_API_URL}/reverse`, {
      params: {
        lat: location.latitude,
        lon: location.longitude,
        format: 'json',
        'accept-language': 'ru',
      },
      headers: {
        'User-Agent': 'FoodHub App',
      },
    });

    if (response.data && response.data.address) {
      const addr = response.data.address;
      const parts = [
        addr.road,
        addr.house_number,
        addr.city || addr.town || addr.village,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : response.data.display_name;
    }
    return null;
  } catch (error: any) {
    console.error('Ошибка обратного геокодирования:', error);
    return null;
  }
};

/**
 * Проверка доступности OpenStreetMap API
 */
export const isOSMAvailable = (): boolean => {
  return true; // OSM всегда доступен
};

