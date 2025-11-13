import { Router } from 'express';
import { getFeed, getTrendingDishes } from '../controllers/feedController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/feed:
 *   get:
 *     tags: [Feed]
 *     summary: Получить ленту активности
 *     description: Для авторизованных - отзывы подписок, для гостей - популярные отзывы
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Количество отзывов
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Смещение для пагинации
 *     responses:
 *       200:
 *         description: Лента отзывов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feed:
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
 */
router.get('/', optionalAuth, getFeed);

/**
 * @swagger
 * /api/feed/trending:
 *   get:
 *     tags: [Feed]
 *     summary: Получить популярные блюда
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество блюд
 *     responses:
 *       200:
 *         description: Список популярных блюд
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dishes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dish'
 */
router.get('/trending', optionalAuth, getTrendingDishes);

export default router;

