import { Response } from 'express';
import { User, Dish, DishReview } from '../models';
import { AuthRequest } from '../middleware/auth';

// Получить пользователя по ID
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден',
      });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Получить блюда добавленные пользователем
export const getUserDishes = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден',
      });
    }

    const dishes = await Dish.findAll({
      where: { addedBy: userId },
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });

    const total = await Dish.count({ where: { addedBy: userId } });

    res.json({
      dishes,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: total > Number(offset) + dishes.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Получить отзывы пользователя
export const getUserReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден',
      });
    }

    const reviews = await DishReview.findAll({
      where: { authorId: userId },
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar', 'trustScore'],
        },
        {
          model: Dish,
          as: 'dish',
          attributes: ['id', 'name', 'photo', 'restaurantId'],
        },
      ],
    });

    const total = await DishReview.count({ where: { authorId: userId } });

    res.json({
      reviews,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: total > Number(offset) + reviews.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Получить статистику пользователя
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден',
      });
    }

    const dishesCount = await Dish.count({ where: { addedBy: userId } });
    const reviewsCount = await DishReview.count({ where: { authorId: userId } });

    res.json({
      stats: {
        dishesAdded: dishesCount,
        reviewsWritten: reviewsCount,
        trustScore: user.trustScore,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        cuisinesTried: user.cuisinesTried,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

