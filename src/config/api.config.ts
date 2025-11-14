/**
 * API Configuration
 * 
 * Легко переключайтесь между локальным и production API
 */

export type Environment = 'local' | 'production';

// 🔧 ИЗМЕНИТЕ ЭТУ НАСТРОЙКУ ДЛЯ ПЕРЕКЛЮЧЕНИЯ МЕЖДУ ОКРУЖЕНИЯМИ
export const CURRENT_ENV: Environment = 'production'; // 'local' или 'production'

export const API_CONFIG = {
  local: {
    // Для эмулятора
    emulator: 'http://10.0.2.2:3000',
    // Для реального устройства (замените на IP вашего компьютера)
    device: 'http://192.168.31.212:3000',
  },
  production: {
    // Ваш Render URL
    url: 'https://foodhub-backend-96im.onrender.com',
  },
};

/**
 * Получить базовый URL API
 * 
 * @param isEmulator - true если используется эмулятор, false для реального устройства
 * @returns Базовый URL API
 */
export const getApiBaseUrl = (isEmulator: boolean = true): string => {
  if (CURRENT_ENV === 'production') {
    return API_CONFIG.production.url;
  }
  
  // Для локальной разработки
  return isEmulator ? API_CONFIG.local.emulator : API_CONFIG.local.device;
};

/**
 * Получить полный URL API (с /api)
 */
export const getApiUrl = (isEmulator: boolean = true): string => {
  return `${getApiBaseUrl(isEmulator)}/api`;
};

/**
 * Текущая конфигурация (для отладки)
 */
export const getCurrentConfig = (isEmulator: boolean = true) => {
  const baseUrl = getApiBaseUrl(isEmulator);
  const apiUrl = getApiUrl(isEmulator);
  
  return {
    environment: CURRENT_ENV,
    baseUrl,
    apiUrl,
    isEmulator,
    isProduction: CURRENT_ENV === 'production',
    isLocal: CURRENT_ENV === 'local',
  };
};

// Экспорт для удобства
export default {
  CURRENT_ENV,
  API_CONFIG,
  getApiBaseUrl,
  getApiUrl,
  getCurrentConfig,
};

