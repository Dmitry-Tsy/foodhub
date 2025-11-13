import { Router } from 'express';
import {
  getOrCreateRestaurant,
  getRestaurantById,
  searchRestaurants,
} from '../controllers/restaurantController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     tags: [Restaurants]
 *     summary: Создать или получить ресторан
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address]
 *             properties:
 *               googlePlaceId:
 *                 type: string
 *                 example: ChIJN1t_tDeuEmsRUsoyG83frY4
 *               name:
 *                 type: string
 *                 example: Ресторан "Белуга"
 *               address:
 *                 type: string
 *                 example: Москва, Смоленская пл., 3
 *               phone:
 *                 type: string
 *                 example: +7 495 123-45-67
 *               latitude:
 *                 type: number
 *                 example: 55.7558
 *               longitude:
 *                 type: number
 *                 example: 37.6173
 *               cuisineType:
 *                 type: string
 *                 example: Русская
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/photo.jpg"]
 *     responses:
 *       200:
 *         description: Ресторан найден или создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurant:
 *                   $ref: '#/components/schemas/Restaurant'
 *       401:
 *         description: Требуется авторизация
 */
router.post('/', authenticate, getOrCreateRestaurant);

/**
 * @swagger
 * /api/restaurants/search:
 *   get:
 *     tags: [Restaurants]
 *     summary: Поиск ресторанов
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Поисковый запрос (название или адрес)
 *         example: Белуга
 *       - in: query
 *         name: cuisine
 *         schema:
 *           type: string
 *         description: Тип кухни
 *         example: Русская
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Максимальное количество результатов
 *     responses:
 *       200:
 *         description: Список найденных ресторанов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurants:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurant'
 */
router.get('/search', optionalAuth, searchRestaurants);

/**
 * @swagger
 * /api/restaurants/{restaurantId}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Получить ресторан по ID
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID ресторана
 *     responses:
 *       200:
 *         description: Данные ресторана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurant:
 *                   $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Ресторан не найден
 */
router.get('/:restaurantId', optionalAuth, getRestaurantById);

export default router;
