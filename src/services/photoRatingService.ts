import api from './api';
import { ReviewPhoto } from '../types';

export interface PhotoRatingResponse {
  success: boolean;
  rated: boolean;
  message: string;
}

export interface PhotoStatsResponse {
  success: boolean;
  photoUrl: string;
  reviewId: string;
  rating: number;
  voteCount: number;
  score: number;
}

export interface DishPhotoRatingsResponse {
  success: boolean;
  photos: ReviewPhoto[];
}

// Поставить/убрать лайк фото
export const ratePhoto = async (
  photoUrl: string,
  reviewId: string
): Promise<PhotoRatingResponse> => {
  try {
    const response = await api.post<PhotoRatingResponse>('/photo-ratings/rate', {
      photoUrl,
      reviewId,
    });
    return response;
  } catch (error: any) {
    console.error('❌ Ошибка оценки фото:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Ошибка оценки фото');
  }
};

// Получить статистику по фото
export const getPhotoStats = async (
  photoUrl: string,
  reviewId: string
): Promise<PhotoStatsResponse> => {
  try {
    const response = await api.get<PhotoStatsResponse>('/photo-ratings/stats', {
      params: { photoUrl, reviewId },
    });
    return response;
  } catch (error: any) {
    console.error('❌ Ошибка получения статистики фото:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Ошибка получения статистики фото');
  }
};

// Получить рейтинги всех фото блюда
export const getDishPhotoRatings = async (
  dishId: string
): Promise<DishPhotoRatingsResponse> => {
  try {
    const response = await api.get<DishPhotoRatingsResponse>(
      `/photo-ratings/dish/${dishId}`
    );
    return response;
  } catch (error: any) {
    console.error('❌ Ошибка получения рейтингов фото блюда:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || 'Ошибка получения рейтингов фото блюда'
    );
  }
};

