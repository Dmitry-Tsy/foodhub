import { FeedItem, PaginatedResponse } from '../types';
import { mockFeed, simulateDelay } from './mockData';

export const getFeed = async (
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<FeedItem>> => {
  await simulateDelay();
  
  const sortedFeed = [...mockFeed].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedFeed = sortedFeed.slice(startIndex, endIndex);
  
  return {
    data: paginatedFeed,
    page,
    limit,
    total: sortedFeed.length,
    hasMore: endIndex < sortedFeed.length,
  };
};

export const getUserFeed = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<FeedItem>> => {
  await simulateDelay();
  
  const userFeed = mockFeed
    .filter(item => item.user?.id === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedFeed = userFeed.slice(startIndex, endIndex);
  
  return {
    data: paginatedFeed,
    page,
    limit,
    total: userFeed.length,
    hasMore: endIndex < userFeed.length,
  };
};

