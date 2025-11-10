import { User, LoginCredentials, RegisterData } from '../types';
import { mockUsers, simulateDelay } from './mockData';

// Mock authentication service - замените на реальный API
export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  await simulateDelay();
  
  // Простая mock проверка
  const user = mockUsers.find(u => u.email === credentials.email);
  
  if (!user || credentials.password.length < 6) {
    throw new Error('Неверный email или пароль');
  }
  
  return {
    user,
    token: `mock_token_${user.id}_${Date.now()}`,
  };
};

export const register = async (data: RegisterData): Promise<{ user: User; token: string }> => {
  await simulateDelay();
  
  // Проверка на существующий email
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('Пользователь с таким email уже существует');
  }
  
  const newUser: User = {
    id: `user_${Date.now()}`,
    username: data.username,
    email: data.email,
    trustScore: 0,
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date().toISOString(),
  };
  
  mockUsers.push(newUser);
  
  return {
    user: newUser,
    token: `mock_token_${newUser.id}_${Date.now()}`,
  };
};

export const getCurrentUser = async (token: string): Promise<User> => {
  await simulateDelay(300);
  
  // Extract user id from token (mock)
  const userId = token.split('_')[2];
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('Пользователь не найден');
  }
  
  return user;
};

export const updateProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  await simulateDelay();
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('Пользователь не найден');
  }
  
  Object.assign(user, updates);
  return user;
};

