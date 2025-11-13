import { DishReview, PaginatedResponse } from '../types';
import api from './api';

// Получить отзывы на блюдо
export const getDishReviews = async (
  dishId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<DishReview>> => {
  try {
    console.log('📝 Загрузка отзывов для блюда:', dishId);
    const response = await api.get<{ reviews: DishReview[] }>(`/dishes/${dishId}/reviews`);
    
    // Простая пагинация на клиенте (можно переделать на серверную)
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = response.reviews.slice(startIndex, endIndex);
    
    console.log(`✅ Загружено отзывов: ${response.reviews.length}`);
    
    return {
      data: paginatedReviews,
      page,
      limit,
      total: response.reviews.length,
      hasMore: endIndex < response.reviews.length,
    };
  } catch (error: any) {
    console.error('❌ Ошибка загрузки отзывов:', error.response?.data || error.message);
    // Возвращаем пустой результат в случае ошибки
    return {
      data: [],
      page,
      limit,
      total: 0,
      hasMore: false,
    };
  }
};

// Получить отзывы пользователя
export const getUserReviews = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<DishReview>> => {
  try {
    console.log('📝 Загрузка отзывов пользователя:', userId);
    const response = await api.get<{ reviews: DishReview[] }>(`/users/${userId}/reviews`);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = response.reviews.slice(startIndex, endIndex);
    
    return {
      data: paginatedReviews,
      page,
      limit,
      total: response.reviews.length,
      hasMore: endIndex < response.reviews.length,
    };
  } catch (error: any) {
    console.error('❌ Ошибка загрузки отзывов пользователя:', error.response?.data || error.message);
    return {
      data: [],
      page,
      limit,
      total: 0,
      hasMore: false,
    };
  }
};

// Создать отзыв
export const createReview = async (reviewData: Partial<DishReview>): Promise<DishReview> => {
  try {
    console.log('✍️ Создание отзыва для блюда:', reviewData.dishId);
    const response = await api.post<{ review: DishReview }>(`/dishes/${reviewData.dishId}/reviews`, reviewData);
    console.log('✅ Отзыв создан');
    return response.review;
  } catch (error: any) {
    console.error('❌ Ошибка создания отзыва:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка создания отзыва');
  }
};

// Обновить отзыв
export const updateReview = async (reviewId: string, updates: Partial<DishReview>): Promise<DishReview> => {
  try {
    console.log('✏️ Обновление отзыва:', reviewId);
    const response = await api.put<{ review: DishReview }>(`/reviews/${reviewId}`, updates);
    console.log('✅ Отзыв обновлен');
    return response.review;
  } catch (error: any) {
    console.error('❌ Ошибка обновления отзыва:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка обновления отзыва');
  }
};

// Удалить отзыв
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    console.log('🗑️ Удаление отзыва:', reviewId);
    await api.delete(`/reviews/${reviewId}`);
    console.log('✅ Отзыв удален');
  } catch (error: any) {
    console.error('❌ Ошибка удаления отзыва:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка удаления отзыва');
  }
};

// Отметить отзыв как полезный
export const markReviewHelpful = async (reviewId: string): Promise<DishReview> => {
  try {
    console.log('👍 Отметка отзыва полезным:', reviewId);
    const response = await api.post<{ review: DishReview }>(`/reviews/${reviewId}/helpful`);
    console.log('✅ Отзыв отмечен полезным');
    return response.review;
  } catch (error: any) {
    console.error('❌ Ошибка отметки отзыва:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка отметки отзыва');
  }
};
