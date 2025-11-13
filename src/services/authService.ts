import { User, LoginCredentials, RegisterData } from '../types';
import api from './api';

interface AuthResponse {
  user: User;
  token: string;
}

// Реальный API для авторизации
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('🔐 Авторизация:', credentials.email);
    console.log('📡 API URL:', 'http://192.168.31.212:3000/api/auth/login');
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    console.log('✅ Авторизация успешна:', response.user?.username);
    return response;
  } catch (error: any) {
    console.error('❌ Ошибка авторизации:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    
    // Более подробные сообщения об ошибках
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      throw new Error('Не удается подключиться к серверу. Убедитесь что бэкенд запущен на http://192.168.31.212:3000');
    }
    
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Ошибка входа');
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('📝 Регистрация:', data.email);
    console.log('📡 API URL:', 'http://192.168.31.212:3000/api/auth/register');
    const response = await api.post<AuthResponse>('/auth/register', data);
    console.log('✅ Регистрация успешна:', response.user?.username);
    return response;
  } catch (error: any) {
    console.error('❌ Ошибка регистрации:', {
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
    console.log('👤 Загрузка профиля пользователя');
    const response = await api.get<{ user: User }>('/auth/profile');
    console.log('✅ Профиль загружен:', response.user.username);
    return response.user;
  } catch (error: any) {
    console.error('❌ Ошибка загрузки профиля:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка загрузки профиля');
  }
};

export const updateProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  try {
    console.log('✏️ Обновление профиля');
    const response = await api.put<{ user: User }>('/auth/profile', updates);
    console.log('✅ Профиль обновлен');
    return response.user;
  } catch (error: any) {
    console.error('❌ Ошибка обновления профиля:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка обновления профиля');
  }
};

