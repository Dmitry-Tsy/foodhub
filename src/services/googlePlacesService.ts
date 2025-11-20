import axios from 'axios';
import { Restaurant, Location } from '../types';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyCnveR2zXFc-UMPCvhD49A51ayEHG99W98';
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now: boolean;
  };
}

interface NearbySearchResponse {
  results: GooglePlace[];
  status: string;
  next_page_token?: string;
}

/**
 * Поиск ресторанов поблизости через Google Places API
 * Поддерживает пагинацию для получения более 20 результатов
 */
export const searchNearbyRestaurants = async (
  location: Location,
  radius: number = 5000,
  keyword?: string,
  maxResults: number = 60 // Максимум результатов (3 страницы по 20)
): Promise<Restaurant[]> => {
  try {
    const allResults: Restaurant[] = [];
    let nextPageToken: string | undefined;
    let pageCount = 0;
    const maxPages = Math.ceil(maxResults / 20); // Google Places API возвращает максимум 20 за раз

    do {
      const params: any = {
        location: `${location.latitude},${location.longitude}`,
        radius: radius.toString(),
        type: 'restaurant',
        key: GOOGLE_PLACES_API_KEY,
        ...(keyword && { keyword }),
        ...(nextPageToken && { pagetoken: nextPageToken }),
      };

      const response = await axios.get<NearbySearchResponse>(
        `${PLACES_API_URL}/nearbysearch/json`,
        { params }
      );

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      if (response.data.status === 'ZERO_RESULTS') {
        break;
      }

      const restaurants = response.data.results.map(place => 
        convertGooglePlaceToRestaurant(place, location)
      );
      allResults.push(...restaurants);

      nextPageToken = response.data.next_page_token;
      pageCount++;

      // Если есть next_page_token, нужно подождать немного перед следующим запросом
      // Google требует небольшую задержку между запросами с pagetoken
      if (nextPageToken && pageCount < maxPages) {
        // Ждем 2 секунды перед следующим запросом (Google требует минимум 2 секунды)
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } while (nextPageToken && pageCount < maxPages && allResults.length < maxResults);

    // Ограничиваем до maxResults если получили больше
    return allResults.slice(0, maxResults);
  } catch (error: any) {
    console.error('Error searching nearby restaurants:', error);
    throw new Error('Не удалось загрузить рестораны');
  }
};

/**
 * Текстовый поиск ресторанов
 */
export const searchRestaurantsByText = async (
  query: string,
  location?: Location
): Promise<Restaurant[]> => {
  try {
    const params = {
      query: `${query} restaurant`,
      key: GOOGLE_PLACES_API_KEY,
      ...(location && { location: `${location.latitude},${location.longitude}` }),
    };

    const response = await axios.get<NearbySearchResponse>(
      `${PLACES_API_URL}/textsearch/json`,
      { params }
    );

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    return response.data.results.map(place => 
      convertGooglePlaceToRestaurant(place, location)
    );
  } catch (error: any) {
    console.error('Error searching restaurants by text:', error);
    throw new Error('Не удалось найти рестораны');
  }
};

/**
 * Получить фото ресторана по photo_reference
 */
export const getPlacePhotoUrl = (
  photoReference: string,
  maxWidth: number = 400
): string => {
  return `${PLACES_API_URL}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
};

/**
 * Получить детальную информацию о ресторане
 */
export const getPlaceDetails = async (placeId: string): Promise<any> => {
  try {
    const response = await axios.get(`${PLACES_API_URL}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,photos,rating,user_ratings_total,types,geometry',
        key: GOOGLE_PLACES_API_KEY,
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    return response.data.result;
  } catch (error: any) {
    console.error('Error getting place details:', error);
    throw new Error('Не удалось загрузить детали ресторана');
  }
};

/**
 * Конвертация Google Place в формат Restaurant
 */
const convertGooglePlaceToRestaurant = (
  place: GooglePlace,
  userLocation?: Location
): Restaurant => {
  // Определяем тип кухни из types
  const cuisineTypes = place.types.filter(type => 
    !['restaurant', 'food', 'point_of_interest', 'establishment'].includes(type)
  );
  const cuisineType = cuisineTypes.length > 0 
    ? cuisineTypes[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Ресторан';

  // Вычисляем расстояние если есть координаты пользователя
  let distance: number | undefined;
  if (userLocation) {
    const R = 6371e3; // Радиус Земли в метрах
    const φ1 = userLocation.latitude * Math.PI / 180;
    const φ2 = place.geometry.location.lat * Math.PI / 180;
    const Δφ = (place.geometry.location.lat - userLocation.latitude) * Math.PI / 180;
    const Δλ = (place.geometry.location.lng - userLocation.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    distance = Math.round(R * c);
  }

  // Получаем URL фотографий
  const photos = place.photos?.map(photo => 
    getPlacePhotoUrl(photo.photo_reference, 800)
  ) || [];

  return {
    id: place.place_id,
    name: place.name,
    address: place.vicinity,
    location: {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    },
    cuisineType,
    distance,
    photos: photos.slice(0, 3), // Максимум 3 фото
    averageRating: place.rating ? place.rating * 2 : undefined, // Google использует 0-5, мы 0-10
    reviewCount: place.user_ratings_total,
  };
};

/**
 * Проверка доступности Google Places API
 */
export const isGooglePlacesAvailable = (): boolean => {
  return GOOGLE_PLACES_API_KEY !== 'YOUR_API_KEY_HERE' && GOOGLE_PLACES_API_KEY.length > 0;
};

