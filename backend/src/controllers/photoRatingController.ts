import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import PhotoRating from '../models/PhotoRating';
import DishReview from '../models/DishReview';
import { Op } from 'sequelize';

// Поставить лайк фото
export const ratePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { photoUrl, reviewId } = req.body;
    const userId = req.userId!;

    if (!photoUrl || !reviewId) {
      return res.status(400).json({
        success: false,
        error: 'photoUrl и reviewId обязательны',
      });
    }

    // Проверяем что отзыв существует
    const review = await DishReview.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Отзыв не найден',
      });
    }

    // Проверяем что фото есть в отзыве
    if (!review.photos.includes(photoUrl)) {
      return res.status(400).json({
        success: false,
        error: 'Фото не найдено в отзыве',
      });
    }

    // Проверяем не лайкал ли уже пользователь это фото
    const existingRating = await PhotoRating.findOne({
      where: {
        photoUrl,
        reviewId,
        userId,
      },
    });

    if (existingRating) {
      // Убираем лайк
      await existingRating.destroy();
      return res.json({
        success: true,
        rated: false,
        message: 'Лайк убран',
      });
    }

    // Ставим лайк
    const rating = await PhotoRating.create({
      photoUrl,
      reviewId,
      dishId: review.dishId,
      userId,
    });

    return res.json({
      success: true,
      rated: true,
      message: 'Лайк поставлен',
    });
  } catch (error: any) {
    console.error('Error rating photo:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка оценки фото',
    });
  }
};

// Получить статистику по фото (количество лайков)
export const getPhotoStats = async (req: AuthRequest, res: Response) => {
  try {
    const { photoUrl, reviewId } = req.query;

    if (!photoUrl || !reviewId) {
      return res.status(400).json({
        success: false,
        error: 'photoUrl и reviewId обязательны',
      });
    }

    const voteCount = await PhotoRating.count({
      where: {
        photoUrl: photoUrl as string,
        reviewId: reviewId as string,
      },
    });

    // Средний рейтинг фото (пока просто считаем количество лайков)
    // В будущем можно добавить числовые рейтинги (1-10)
    const rating = voteCount > 0 ? 10.0 : 0;

    return res.json({
      success: true,
      photoUrl: photoUrl as string,
      reviewId: reviewId as string,
      rating,
      voteCount,
      score: rating * voteCount, // Для сортировки
    });
  } catch (error: any) {
    console.error('Error getting photo stats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка получения статистики фото',
    });
  }
};

// Получить рейтинги всех фото из отзывов блюда
// Можно вызывать без авторизации
export const getDishPhotoRatings = async (req: Request, res: Response) => {
  try {
    const { dishId } = req.params;

    if (!dishId) {
      return res.status(400).json({
        success: false,
        error: 'dishId обязателен',
      });
    }

    // Получаем все фото из всех отзывов блюда
    const reviews = await DishReview.findAll({
      where: { dishId },
      attributes: ['id', 'photos'],
    });

    // Собираем все фото
    const allPhotos: string[] = [];
    const photoToReviewMap: Record<string, string> = {};
    
    reviews.forEach((review) => {
      if (review.photos && review.photos.length > 0) {
        review.photos.forEach((photoUrl) => {
          if (!allPhotos.includes(photoUrl)) {
            allPhotos.push(photoUrl);
            photoToReviewMap[photoUrl] = review.id;
          }
        });
      }
    });

    // Получаем статистику по каждому фото
    const photoStats = await Promise.all(
      allPhotos.map(async (photoUrl) => {
        const voteCount = await PhotoRating.count({
          where: {
            photoUrl,
            dishId,
          },
        });

        // Рейтинг фото: если есть лайки - 10.0, если нет - 0
        // В будущем можно сделать средний рейтинг от всех пользователей
        const rating = voteCount > 0 ? 10.0 : 0;
        const score = rating * voteCount; // Для сортировки по популярности

        return {
          url: photoUrl,
          reviewId: photoToReviewMap[photoUrl],
          rating,
          voteCount,
          score,
        };
      })
    );

    // Сортируем по score (rating * voteCount) по убыванию
    photoStats.sort((a, b) => b.score - a.score);

    return res.json({
      success: true,
      photos: photoStats,
    });
  } catch (error: any) {
    console.error('Error getting dish photo ratings:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка получения рейтингов фото',
    });
  }
};

