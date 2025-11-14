import { Response } from 'express';
import { Restaurant, Dish, User } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

// Получить или создать ресторан
export const getOrCreateRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    let { googlePlaceId, name, address, phone, latitude, longitude, cuisineType, photos } = req.body;

    // Защита от слишком длинных строк (хотя теперь используем TEXT, но на всякий случай)
    // Обрезаем до разумной длины, если нужно
    const MAX_FIELD_LENGTH = 10000; // TEXT может хранить до 1GB, но ограничим для безопасности
    
    if (name && name.length > MAX_FIELD_LENGTH) {
      console.warn('⚠️ Name слишком длинный, обрезаем:', name.length);
      name = name.substring(0, MAX_FIELD_LENGTH);
    }
    
    if (address && address.length > MAX_FIELD_LENGTH) {
      console.warn('⚠️ Address слишком длинный, обрезаем:', address.length);
      address = address.substring(0, MAX_FIELD_LENGTH);
    }
    
    // Обрабатываем массив photos - обрезаем длинные URL
    if (photos && Array.isArray(photos)) {
      photos = photos.map((photo: string) => {
        if (typeof photo === 'string' && photo.length > MAX_FIELD_LENGTH) {
          console.warn('⚠️ Photo URL слишком длинный, обрезаем:', photo.length);
          return photo.substring(0, MAX_FIELD_LENGTH);
        }
        return photo;
      }).filter((photo: string) => photo && photo.length > 0); // Убираем пустые
    }

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

