import { User } from '../types';
import { mockUsers, simulateDelay } from './mockData';

export const getUserProfile = async (userId: string): Promise<User> => {
  await simulateDelay();
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('Пользователь не найден');
  }
  
  return user;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  await simulateDelay();
  
  const lowercaseQuery = query.toLowerCase();
  
  return mockUsers.filter(user =>
    user.username.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery)
  );
};

export const followUser = async (userId: string): Promise<{ success: boolean }> => {
  await simulateDelay();
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('Пользователь не найден');
  }
  
  user.followersCount += 1;
  
  return { success: true };
};

export const unfollowUser = async (userId: string): Promise<{ success: boolean }> => {
  await simulateDelay();
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('Пользователь не найден');
  }
  
  user.followersCount = Math.max(0, user.followersCount - 1);
  
  return { success: true };
};

export const getFollowers = async (userId: string): Promise<User[]> => {
  await simulateDelay();
  
  // Mock данные - в реальном приложении это будет API запрос
  return mockUsers.slice(0, 3);
};

export const getFollowing = async (userId: string): Promise<User[]> => {
  await simulateDelay();
  
  // Mock данные - в реальном приложении это будет API запрос
  return mockUsers.slice(0, 2);
};

export const rateTrust = async (
  userId: string,
  rating: number
): Promise<{ success: boolean; newTrustScore: number }> => {
  await simulateDelay();
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('Пользователь не найден');
  }
  
  // Простой расчет нового рейтинга доверия (в реальном приложении будет сложнее)
  const currentScore = user.trustScore;
  const newScore = (currentScore * 10 + rating) / 11; // Weighted average
  user.trustScore = Math.round(newScore * 10) / 10;
  
  return {
    success: true,
    newTrustScore: user.trustScore,
  };
};

export const getSuggestedUsers = async (limit: number = 10): Promise<User[]> => {
  await simulateDelay();
  
  // Возвращаем пользователей с высоким рейтингом доверия
  return mockUsers
    .sort((a, b) => b.trustScore - a.trustScore)
    .slice(0, limit);
};

