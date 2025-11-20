import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Collection from '../models/Collection';
import CollectionDish from '../models/CollectionDish';
import Dish from '../models/Dish';
import User from '../models/User';
import Restaurant from '../models/Restaurant';
import { Op } from 'sequelize';

// Создать коллекцию
export const createCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, isPublic, coverPhoto } = req.body;
    const userId = req.userId!;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Название коллекции обязательно',
      });
    }

    const collection = await Collection.create({
      name: name.trim(),
      description: description?.trim() || undefined,
      userId,
      isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      coverPhoto: coverPhoto || undefined,
      dishCount: 0,
    });

    const collectionWithUser = await Collection.findByPk(collection.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
    });

    res.status(201).json({ success: true, collection: collectionWithUser });
  } catch (error: any) {
    console.error('Error creating collection:', error);
    res.status(500).json({ success: false, error: error.message || 'Ошибка создания коллекции' });
  }
};

// Получить коллекции пользователя
export const getUserCollections = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { publicOnly } = req.query;

    const where: any = { userId };
    if (publicOnly === 'true') {
      where.isPublic = true;
    }

    const collections = await Collection.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, collections });
  } catch (error: any) {
    console.error('Error getting user collections:', error);
    res.status(500).json({ success: false, error: error.message || 'Ошибка получения коллекций' });
  }
};

// Получить коллекцию по ID (можно смотреть публичные коллекции без авторизации)
export const getCollectionById = async (req: AuthRequest | any, res: Response) => {
  try {
    const { collectionId } = req.params;
    const userId = req.userId; // Может быть undefined для неавторизованных

    const collection = await Collection.findByPk(collectionId, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
        {
          model: Dish,
          as: 'dishes',
          through: { attributes: ['addedAt', 'order'] },
          include: [
            { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
            { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'address'] },
          ],
          order: [[CollectionDish, 'order', 'ASC'], [CollectionDish, 'addedAt', 'DESC']],
        },
      ],
    });

    if (!collection) {
      return res.status(404).json({ success: false, error: 'Коллекция не найдена' });
    }

    // Проверяем доступ: только владелец может видеть приватные коллекции
    if (!collection.isPublic && collection.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Доступ запрещен' });
    }

    res.json({ success: true, collection });
  } catch (error: any) {
    console.error('Error getting collection:', error);
    res.status(500).json({ success: false, error: error.message || 'Ошибка получения коллекции' });
  }
};

// Обновить коллекцию
export const updateCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { collectionId } = req.params;
    const { name, description, isPublic, coverPhoto } = req.body;
    const userId = req.userId!;

    const collection = await Collection.findByPk(collectionId);

    if (!collection) {
      return res.status(404).json({ success: false, error: 'Коллекция не найдена' });
    }

    // Проверяем владельца
    if (collection.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Доступ запрещен' });
    }

    // Обновляем поля
    if (name !== undefined) collection.name = name.trim();
    if (description !== undefined) collection.description = description?.trim() || undefined;
    if (isPublic !== undefined) collection.isPublic = Boolean(isPublic);
    if (coverPhoto !== undefined) collection.coverPhoto = coverPhoto || undefined;

    await collection.save();

    const updatedCollection = await Collection.findByPk(collection.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
    });

    res.json({ success: true, collection: updatedCollection });
  } catch (error: any) {
    console.error('Error updating collection:', error);
    res.status(500).json({ success: false, error: error.message || 'Ошибка обновления коллекции' });
  }
};

// Удалить коллекцию
export const deleteCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { collectionId } = req.params;
    const userId = req.userId!;

    const collection = await Collection.findByPk(collectionId);

    if (!collection) {
      return res.status(404).json({ success: false, error: 'Коллекция не найдена' });
    }

    // Проверяем владельца
    if (collection.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Доступ запрещен' });
    }

    await collection.destroy();

    res.json({ success: true, message: 'Коллекция удалена' });
  } catch (error: any) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ success: false, error: error.message || 'Ошибка удаления коллекции' });
  }
};

// Добавить блюдо в коллекцию
export const addDishToCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { collectionId } = req.params;
    const { dishId } = req.body;
    const userId = req.userId!;

    if (!dishId) {
      return res.status(400).json({ success: false, error: 'Необходимо указать ID блюда' });
    }

    const collection = await Collection.findByPk(collectionId);

    if (!collection) {
      return res.status(404).json({ success: false, error: 'Коллекция не найдена' });
    }

    // Проверяем владельца
    if (collection.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Доступ запрещен' });
    }

    // Проверяем существование блюда
    const dish = await Dish.findByPk(dishId);
    if (!dish) {
      return res.status(404).json({ success: false, error: 'Блюдо не найдено' });
    }

    // Проверяем, нет ли уже этого блюда в коллекции
    const existing = await CollectionDish.findOne({
      where: { collectionId, dishId },
    });

    if (existing) {
      return res.status(400).json({ success: false, error: 'Блюдо уже в коллекции' });
    }

    // Получаем текущий максимальный order
    const maxOrderResult = await CollectionDish.max('order', {
      where: { collectionId },
    });
    const maxOrder = typeof maxOrderResult === 'number' ? maxOrderResult : 0;

    // Добавляем блюдо
    await CollectionDish.create({
      collectionId,
      dishId,
      order: maxOrder + 1,
      addedAt: new Date(),
    });

    // Обновляем счетчик блюд
    collection.dishCount = await CollectionDish.count({ where: { collectionId } });
    await collection.save();

    res.status(201).json({ success: true, message: 'Блюдо добавлено в коллекцию' });
  } catch (error: any) {
    console.error('Error adding dish to collection:', error);
    res.status(500).json({ success: false, error: error.message || 'Ошибка добавления блюда' });
  }
};

// Удалить блюдо из коллекции
export const removeDishFromCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { collectionId, dishId } = req.params;
    const userId = req.userId!;

    const collection = await Collection.findByPk(collectionId);

    if (!collection) {
      return res.status(404).json({ success: false, error: 'Коллекция не найдена' });
    }

    // Проверяем владельца
    if (collection.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Доступ запрещен' });
    }

    const collectionDish = await CollectionDish.findOne({
      where: { collectionId, dishId },
    });

    if (!collectionDish) {
      return res.status(404).json({ success: false, error: 'Блюдо не найдено в коллекции' });
    }

    await collectionDish.destroy();

    // Обновляем счетчик блюд
    collection.dishCount = await CollectionDish.count({ where: { collectionId } });
    await collection.save();

    res.json({ success: true, message: 'Блюдо удалено из коллекции' });
  } catch (error: any) {
    console.error('Error removing dish from collection:', error);
    res.status(500).json({ success: false, error: error.message || 'Ошибка удаления блюда' });
  }
};

// Получить публичные коллекции (можно без авторизации)
export const getPublicCollections = async (req: any, res: Response) => {
  try {
    const { limit = 20, offset = 0, userId } = req.query;

    const where: any = { isPublic: true };
    if (userId) {
      where.userId = userId;
    }

    const collections = await Collection.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: Number(offset),
    });

    res.json({
      success: true,
      collections: collections.rows,
      total: collections.count,
      hasMore: Number(offset) + Number(limit) < collections.count,
    });
  } catch (error: any) {
    console.error('Error getting public collections:', error);
    res.status(500).json({ success: false, error: error.message || 'Ошибка получения коллекций' });
  }
};

