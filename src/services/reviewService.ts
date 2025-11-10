import { DishReview, PaginatedResponse } from '../types';
import { mockReviews, mockDishes, simulateDelay } from './mockData';

export const getDishReviews = async (
  dishId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<DishReview>> => {
  await simulateDelay();
  
  const dishReviews = mockReviews
    .filter(review => review.dishId === dishId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReviews = dishReviews.slice(startIndex, endIndex);
  
  return {
    data: paginatedReviews,
    page,
    limit,
    total: dishReviews.length,
    hasMore: endIndex < dishReviews.length,
  };
};

export const getUserReviews = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<DishReview>> => {
  await simulateDelay();
  
  const userReviews = mockReviews
    .filter(review => review.authorId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReviews = userReviews.slice(startIndex, endIndex);
  
  return {
    data: paginatedReviews,
    page,
    limit,
    total: userReviews.length,
    hasMore: endIndex < userReviews.length,
  };
};

export const createReview = async (reviewData: Partial<DishReview>): Promise<DishReview> => {
  await simulateDelay();
  
  const newReview: DishReview = {
    id: `review_${Date.now()}`,
    dishId: reviewData.dishId || '',
    authorId: reviewData.authorId || '',
    rating: reviewData.rating || 0,
    comment: reviewData.comment,
    foodPairing: reviewData.foodPairing,
    photos: reviewData.photos || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    helpfulCount: 0,
  };
  
  mockReviews.push(newReview);
  
  // Обновляем средний рейтинг блюда
  const dish = mockDishes.find(d => d.id === newReview.dishId);
  if (dish) {
    const dishReviews = mockReviews.filter(r => r.dishId === dish.id);
    const avgRating = dishReviews.reduce((sum, r) => sum + r.rating, 0) / dishReviews.length;
    dish.averageRating = Math.round(avgRating * 10) / 10;
    dish.reviewCount = dishReviews.length;
  }
  
  return newReview;
};

export const updateReview = async (reviewId: string, updates: Partial<DishReview>): Promise<DishReview> => {
  await simulateDelay();
  
  const review = mockReviews.find(r => r.id === reviewId);
  
  if (!review) {
    throw new Error('Отзыв не найден');
  }
  
  Object.assign(review, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  
  // Обновляем средний рейтинг блюда при изменении рейтинга
  if (updates.rating) {
    const dish = mockDishes.find(d => d.id === review.dishId);
    if (dish) {
      const dishReviews = mockReviews.filter(r => r.dishId === dish.id);
      const avgRating = dishReviews.reduce((sum, r) => sum + r.rating, 0) / dishReviews.length;
      dish.averageRating = Math.round(avgRating * 10) / 10;
    }
  }
  
  return review;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await simulateDelay();
  
  const index = mockReviews.findIndex(r => r.id === reviewId);
  
  if (index === -1) {
    throw new Error('Отзыв не найден');
  }
  
  const review = mockReviews[index];
  mockReviews.splice(index, 1);
  
  // Обновляем средний рейтинг блюда
  const dish = mockDishes.find(d => d.id === review.dishId);
  if (dish) {
    const dishReviews = mockReviews.filter(r => r.dishId === dish.id);
    if (dishReviews.length > 0) {
      const avgRating = dishReviews.reduce((sum, r) => sum + r.rating, 0) / dishReviews.length;
      dish.averageRating = Math.round(avgRating * 10) / 10;
      dish.reviewCount = dishReviews.length;
    } else {
      dish.averageRating = 0;
      dish.reviewCount = 0;
    }
  }
};

export const markReviewHelpful = async (reviewId: string): Promise<DishReview> => {
  await simulateDelay();
  
  const review = mockReviews.find(r => r.id === reviewId);
  
  if (!review) {
    throw new Error('Отзыв не найден');
  }
  
  review.helpfulCount = (review.helpfulCount || 0) + 1;
  return review;
};

