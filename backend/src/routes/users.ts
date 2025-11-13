import { Router } from 'express';
import {
  getUserById,
  getUserDishes,
  getUserReviews,
  getUserStats,
} from '../controllers/userController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Получить пользователя по ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:userId', optionalAuth, getUserById);

/**
 * @swagger
 * /api/users/{userId}/dishes:
 *   get:
 *     tags: [Users]
 *     summary: Получить блюда добавленные пользователем
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Количество блюд на странице
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Смещение для пагинации
 *     responses:
 *       200:
 *         description: Список блюд пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dishes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dish'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:userId/dishes', optionalAuth, getUserDishes);

/**
 * @swagger
 * /api/users/{userId}/reviews:
 *   get:
 *     tags: [Users]
 *     summary: Получить отзывы пользователя
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Список отзывов пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DishReview'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:userId/reviews', optionalAuth, getUserReviews);

/**
 * @swagger
 * /api/users/{userId}/stats:
 *   get:
 *     tags: [Users]
 *     summary: Получить статистику пользователя
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Статистика пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     dishesAdded:
 *                       type: integer
 *                     reviewsWritten:
 *                       type: integer
 *                     trustScore:
 *                       type: number
 *                     followersCount:
 *                       type: integer
 *                     followingCount:
 *                       type: integer
 *                     cuisinesTried:
 *                       type: integer
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:userId/stats', optionalAuth, getUserStats);

export default router;

