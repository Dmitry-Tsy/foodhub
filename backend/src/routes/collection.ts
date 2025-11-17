import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createCollection,
  getUserCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addDishToCollection,
  removeDishFromCollection,
  getPublicCollections,
} from '../controllers/collectionController';

const router = Router();

// Публичные коллекции (без авторизации)
router.get('/public', getPublicCollections);

// Коллекции пользователя (требует авторизации)
router.get('/me', authenticate, getUserCollections);

// Создать коллекцию (требует авторизации)
router.post('/', authenticate, createCollection);

// Получить коллекцию по ID (можно без авторизации для публичных)
router.get('/:collectionId', getCollectionById);

// Обновить коллекцию (требует авторизации)
router.put('/:collectionId', authenticate, updateCollection);

// Удалить коллекцию (требует авторизации)
router.delete('/:collectionId', authenticate, deleteCollection);

// Добавить блюдо в коллекцию (требует авторизации)
router.post('/:collectionId/dishes', authenticate, addDishToCollection);

// Удалить блюдо из коллекции (требует авторизации)
router.delete('/:collectionId/dishes/:dishId', authenticate, removeDishFromCollection);

export default router;

