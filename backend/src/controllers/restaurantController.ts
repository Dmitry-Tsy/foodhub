import { Response } from 'express';
import { Restaurant, Dish, User } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

// Получить или создать ресторан
export const getOrCreateRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { googlePlaceId, name, address, phone, latitude, longitude, cuisineType, photos } = req.body;

    let restaurant = await Restaurant.findOne({
      where: { googlePlaceId },
    });

    if (!restaurant) {
      restaurant = await Restaurant.create({
        googlePlaceId,
        name,
        address,
        phone,
        latitude: latitude || 0,
        longitude: longitude || 0,
        cuisineType: cuisineType || 'Разное',
        photos: photos || [],
        averageRating: 0,
        reviewCount: 0,
      });
      console.log('✅ Новый ресторан создан:', name);
    }

    res.json({ restaurant });
  } catch (error: any) {
    console.error('Error getting/creating restaurant:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка обработки ресторана',
    });
  }
};

// Получить ресторан по ID
export const getRestaurantById = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findByPk(restaurantId, {
      include: [
        {
          model: Dish,
          as: 'dishes',
          include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
          limit: 10,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Ресторан не найден',
      });
    }

    res.json({ restaurant });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Поиск ресторанов
export const searchRestaurants = async (req: AuthRequest, res: Response) => {
  try {
    const { query, cuisine, limit = 20 } = req.query;

    const where: any = {};

    if (query) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { address: { [Op.iLike]: `%${query}%` } },
      ];
    }

    if (cuisine) {
      where.cuisineType = { [Op.iLike]: `%${cuisine}%` };
    }

    const restaurants = await Restaurant.findAll({
      where,
      limit: Number(limit),
      order: [['averageRating', 'DESC']],
    });

    res.json({ restaurants });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

