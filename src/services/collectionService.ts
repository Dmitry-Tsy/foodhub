import api from './api';
import { Collection, CollectionCreationAttributes } from '../types';

export interface CreateCollectionResponse {
  success: boolean;
  collection?: Collection;
  error?: string;
}

export interface GetCollectionsResponse {
  success: boolean;
  collections?: Collection[];
  total?: number;
  hasMore?: boolean;
  error?: string;
}

export interface GetCollectionResponse {
  success: boolean;
  collection?: Collection;
  error?: string;
}

export interface UpdateCollectionResponse {
  success: boolean;
  collection?: Collection;
  error?: string;
}

export interface DeleteCollectionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AddDishToCollectionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface RemoveDishFromCollectionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Создать коллекцию
export const createCollection = async (
  data: CollectionCreationAttributes
): Promise<CreateCollectionResponse> => {
  try {
    const response = await api.post<CreateCollectionResponse>('/collections', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating collection:', error);
    throw new Error(error.response?.data?.error || 'Не удалось создать коллекцию');
  }
};

// Получить коллекции пользователя
export const getUserCollections = async (
  publicOnly?: boolean
): Promise<GetCollectionsResponse> => {
  try {
    const params = publicOnly !== undefined ? { publicOnly: publicOnly.toString() } : {};
    const response = await api.get<GetCollectionsResponse>('/collections/me', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error getting user collections:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить коллекции');
  }
};

// Получить публичные коллекции
export const getPublicCollections = async (
  limit?: number,
  offset?: number,
  userId?: string
): Promise<GetCollectionsResponse> => {
  try {
    const params: any = {};
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;
    if (userId) params.userId = userId;

    const response = await api.get<GetCollectionsResponse>('/collections/public', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error getting public collections:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить публичные коллекции');
  }
};

// Получить коллекцию по ID
export const getCollectionById = async (
  collectionId: string
): Promise<GetCollectionResponse> => {
  try {
    const response = await api.get<GetCollectionResponse>(`/collections/${collectionId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting collection:', error);
    throw new Error(error.response?.data?.error || 'Не удалось получить коллекцию');
  }
};

// Обновить коллекцию
export const updateCollection = async (
  collectionId: string,
  data: Partial<CollectionCreationAttributes>
): Promise<UpdateCollectionResponse> => {
  try {
    const response = await api.put<UpdateCollectionResponse>(`/collections/${collectionId}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating collection:', error);
    throw new Error(error.response?.data?.error || 'Не удалось обновить коллекцию');
  }
};

// Удалить коллекцию
export const deleteCollection = async (
  collectionId: string
): Promise<DeleteCollectionResponse> => {
  try {
    const response = await api.delete<DeleteCollectionResponse>(`/collections/${collectionId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting collection:', error);
    throw new Error(error.response?.data?.error || 'Не удалось удалить коллекцию');
  }
};

// Добавить блюдо в коллекцию
export const addDishToCollection = async (
  collectionId: string,
  dishId: string
): Promise<AddDishToCollectionResponse> => {
  try {
    const response = await api.post<AddDishToCollectionResponse>(
      `/collections/${collectionId}/dishes`,
      { dishId }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error adding dish to collection:', error);
    throw new Error(error.response?.data?.error || 'Не удалось добавить блюдо в коллекцию');
  }
};

// Удалить блюдо из коллекции
export const removeDishFromCollection = async (
  collectionId: string,
  dishId: string
): Promise<RemoveDishFromCollectionResponse> => {
  try {
    const response = await api.delete<RemoveDishFromCollectionResponse>(
      `/collections/${collectionId}/dishes/${dishId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error removing dish from collection:', error);
    throw new Error(error.response?.data?.error || 'Не удалось удалить блюдо из коллекции');
  }
};

