import { Response } from 'express';
import { Dish, Restaurant, User, DishReview } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

// Получить меню ресторана
export const getRestaurantMenu = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const dishes = await Dish.findAll({
      where: { restaurantId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ dishes });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка загрузки меню',
    });
  }
};

// Добавить блюдо
export const addDish = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, restaurantId, photo, price, category } = req.body;
    const userId = req.userId!;

    // Валидация входных данных
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Название блюда обязательно',
      });
    }

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        error: 'ID ресторана обязателен',
      });
    }

    // Проверяем что ресторан существует
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Ресторан не найден',
      });
    }

    // Проверка дубликатов - ищем точное совпадение названия в этом ресторане
    const existingDish = await Dish.findOne({
      where: {
        restaurantId,
        name: { [Op.iLike]: name.trim() },
      },
    });

    if (existingDish) {
      return res.status(400).json({
        success: false,
        error: `Блюдо "${existingDish.name}" уже есть в меню этого ресторана`,
        similarDish: existingDish,
      });
    }

    const dish = await Dish.create({
      name: name.trim(),
      description: description?.trim() || null,
      restaurantId, // Гарантированно UUID ресторана из БД
      addedBy: userId,
      photo: photo || null,
      price: price ? Number(price) : null,
      category: category?.trim() || null,
      averageRating: 0,
      reviewCount: 0,
    });

    console.log('✅ Блюдо создано в БД:', {
      dishId: dish.id,
      dishName: dish.name,
      restaurantId: dish.restaurantId,
      addedBy: dish.addedBy,
    });

    // Обновляем счетчик пользователя
    await User.increment('dishesAddedCount', { where: { id: userId } });

    const dishWithRelations = await Dish.findByPk(dish.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
    });

    console.log('✅ Новое блюдо добавлено:', name);

    res.status(201).json({ dish: dishWithRelations });
  } catch (error: any) {
    console.error('Error adding dish:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка добавления блюда',
    });
  }
};

// Получить блюдо по ID
export const getDishById = async (req: AuthRequest, res: Response) => {
  try {
    const { dishId } = req.params;

    const dish = await Dish.findByPk(dishId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
        {
          model: Restaurant,
          as: 'restaurant',
        },
      ],
    });

    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Блюдо не найдено',
      });
    }

    res.json({ dish });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Получить отзывы блюда
export const getDishReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { dishId } = req.params;

    const reviews = await DishReview.findAll({
      where: { dishId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar', 'trustScore'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Добавить отзыв
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { dishId, rating, comment, foodPairing, photos } = req.body;
    const userId = req.userId!;

    // Проверка существования отзыва
    const existingReview = await DishReview.findOne({
      where: { dishId, authorId: userId },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'Вы уже оставили отзыв на это блюдо',
      });
    }

    const review = await DishReview.create({
      dishId,
      authorId: userId,
      rating,
      comment,
      foodPairing,
      photos: photos || [],
      helpfulCount: 0,
    });

    // Обновляем рейтинг блюда
    const reviews = await DishReview.findAll({ where: { dishId } });
    const avgRating = reviews.reduce((sum, r) => sum + parseFloat(r.rating.toString()), 0) / reviews.length;
    
    await Dish.update(
      {
        averageRating: avgRating,
        reviewCount: reviews.length,
      },
      { where: { id: dishId } }
    );

    // Обновляем счетчики пользователя
    await User.increment('reviewsCount', { where: { id: userId } });
    if (photos && photos.length > 0) {
      await User.increment('photosCount', { by: photos.length, where: { id: userId } });
    }

    const reviewWithAuthor = await DishReview.findByPk(review.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'trustScore'] }],
    });

    console.log('✅ Новый отзыв добавлен:', dishId);

    res.status(201).json({ review: reviewWithAuthor });
  } catch (error: any) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка добавления отзыва',
    });
  }
};

