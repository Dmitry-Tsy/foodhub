import { User, LoginCredentials, RegisterData } from '../types';
import api from './api';
import logger from './logger';

interface AuthResponse {
  user: User;
  token: string;
}

// Реальный API для авторизации
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    logger.info('AUTH', `Попытка входа: ${credentials.email}`);
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    logger.info('AUTH', `Авторизация успешна: ${response.user?.username}`);
    return response;
  } catch (error: any) {
    logger.error('AUTH', 'Ошибка авторизации', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // Более подробные сообщения об ошибках
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      throw new Error('Не удается подключиться к серверу. Проверьте подключение к интернету.');
    }
    
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Ошибка входа');
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    logger.info('AUTH', `Попытка регистрации: ${data.email}`);
    const response = await api.post<AuthResponse>('/auth/register', data);
    logger.info('AUTH', `Регистрация успешна: ${response.user?.username}`);
    return response;
  } catch (error: any) {
    logger.error('AUTH', 'Ошибка регистрации', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      throw new Error('Не удается подключиться к серверу. Убедитесь что бэкенд запущен.');
    }
    
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Ошибка регистрации');
  }
};

export const getCurrentUser = async (token: string): Promise<User> => {
  try {
    logger.debug('AUTH', 'Загрузка профиля пользователя');
    // Пробуем /auth/profile, если 404 - пробуем /auth/me (для обратной совместимости)
    try {
      const response = await api.get<{ user: User }>('/auth/profile');
      logger.info('AUTH', `Профиль загружен: ${response.user.username}`);
      return response.user;
    } catch (profileError: any) {
      if (profileError.response?.status === 404) {
        // Fallback на /auth/me если /profile еще не задеплоен
        logger.warn('AUTH', 'Fallback на /auth/me (endpoint /profile не найден)');
        const response = await api.get<{ user: User }>('/auth/me');
        logger.info('AUTH', `Профиль загружен через /me: ${response.user.username}`);
        return response.user;
      }
      throw profileError;
    }
  } catch (error: any) {
    logger.error('AUTH', 'Ошибка загрузки профиля', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка загрузки профиля. Проверьте подключение к серверу.');
  }
};

export const updateProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  try {
    logger.info('AUTH', 'Обновление профиля', updates);
    const response = await api.put<{ user: User }>('/auth/profile', updates);
    logger.info('AUTH', `Профиль обновлен: ${response.user.username}`);
    return response.user;
  } catch (error: any) {
    logger.error('AUTH', 'Ошибка обновления профиля', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка обновления профиля');
  }
};

