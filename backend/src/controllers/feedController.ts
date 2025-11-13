import { Response } from 'express';
import { DishReview, User, Dish, Restaurant } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

// Получить ленту активности
export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const userId = req.userId;

    // Если пользователь авторизован, показываем ленту его подписок
    // Если гость - показываем популярные отзывы
    
    let whereClause = {};
    
    // TODO: добавить фильтрацию по подпискам когда будет готова модель Follow
    // if (userId) {
    //   const following = await Follow.findAll({ where: { followerId: userId } });
    //   const followingIds = following.map(f => f.followingId);
    //   whereClause = { authorId: { [Op.in]: followingIds } };
    // }

    const reviews = await DishReview.findAll({
      where: whereClause,
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
          attributes: ['id', 'name', 'photo', 'restaurantId', 'category'],
          include: [
            {
              model: Restaurant,
              as: 'restaurant',
              attributes: ['id', 'name', 'address'],
            },
          ],
        },
      ],
    });

    const total = await DishReview.count({ where: whereClause });

    res.json({
      feed: reviews,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: total > Number(offset) + reviews.length,
      },
    });
  } catch (error: any) {
    console.error('Error getting feed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Получить популярные блюда
export const getTrendingDishes = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const dishes = await Dish.findAll({
      where: {
        reviewCount: { [Op.gt]: 0 },
      },
      limit: Number(limit),
      order: [
        ['averageRating', 'DESC'],
        ['reviewCount', 'DESC'],
      ],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'address', 'cuisineType'],
        },
      ],
    });

    res.json({ dishes });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

