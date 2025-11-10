import * as Location from 'expo-location';
import { Location as LocationType } from '../types';

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

export const getCurrentLocation = async (): Promise<LocationType> => {
  const hasPermission = await requestLocationPermission();
  
  if (!hasPermission) {
    throw new Error('Доступ к геолокации не предоставлен');
  }
  
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    throw new Error('Не удалось получить текущее местоположение');
  }
};

export const watchLocation = (
  callback: (location: LocationType) => void
): Promise<Location.LocationSubscription> => {
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: 100, // Обновлять каждые 100 метров
    },
    (location) => {
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  );
};

export const reverseGeocode = async (location: LocationType): Promise<string> => {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    
    if (results.length > 0) {
      const address = results[0];
      return `${address.street || ''} ${address.name || ''}, ${address.city || ''}`.trim();
    }
    
    return 'Адрес не найден';
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return 'Ошибка определения адреса';
  }
};

