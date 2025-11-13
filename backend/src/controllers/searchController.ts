import { Response } from 'express';
import { User, Dish, Restaurant, DishReview } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

// Глобальный поиск
export const globalSearch = async (req: AuthRequest, res: Response) => {
  try {
    const { query, type, limit = 10 } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Параметр query обязателен',
      });
    }

    const searchPattern = `%${query}%`;
    const results: any = {};

    // Поиск по всем типам или по конкретному
    const searchTypes = type ? [type] : ['users', 'dishes', 'restaurants'];

    if (searchTypes.includes('users')) {
      results.users = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.iLike]: searchPattern } },
            { bio: { [Op.iLike]: searchPattern } },
          ],
        },
        attributes: { exclude: ['password'] },
        limit: Number(limit),
        order: [['trustScore', 'DESC']],
      });
    }

    if (searchTypes.includes('dishes')) {
      results.dishes = await Dish.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: searchPattern } },
            { description: { [Op.iLike]: searchPattern } },
            { category: { [Op.iLike]: searchPattern } },
          ],
        },
        limit: Number(limit),
        order: [['averageRating', 'DESC']],
        include: [
          {
            model: Restaurant,
            as: 'restaurant',
            attributes: ['id', 'name', 'address'],
          },
        ],
      });
    }

    if (searchTypes.includes('restaurants')) {
      results.restaurants = await Restaurant.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: searchPattern } },
            { address: { [Op.iLike]: searchPattern } },
            { cuisineType: { [Op.iLike]: searchPattern } },
          ],
        },
        limit: Number(limit),
        order: [['averageRating', 'DESC']],
      });
    }

    // Подсчет результатов
    const totalResults = Object.values(results).reduce(
      (sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0),
      0
    );

    res.json({
      query,
      totalResults,
      results,
    });
  } catch (error: any) {
    console.error('Error in global search:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

