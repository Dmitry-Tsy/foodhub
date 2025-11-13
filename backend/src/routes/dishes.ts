import { Router } from 'express';
import {
  getRestaurantMenu,
  getDishById,
  addDish,
  getDishReviews,
  addReview,
} from '../controllers/dishController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/dishes/restaurant/{restaurantId}:
 *   get:
 *     tags: [Dishes]
 *     summary: Получить меню ресторана
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
 *         description: Список блюд ресторана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dishes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dish'
 *       404:
 *         description: Ресторан не найден
 */
router.get('/restaurant/:restaurantId', optionalAuth, getRestaurantMenu);

/**
 * @swagger
 * /api/dishes/{dishId}:
 *   get:
 *     tags: [Dishes]
 *     summary: Получить блюдо по ID
 *     parameters:
 *       - in: path
 *         name: dishId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID блюда
 *     responses:
 *       200:
 *         description: Данные блюда
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dish:
 *                   $ref: '#/components/schemas/Dish'
 *       404:
 *         description: Блюдо не найдено
 */
router.get('/:dishId', optionalAuth, getDishById);

/**
 * @swagger
 * /api/dishes:
 *   post:
 *     tags: [Dishes]
 *     summary: Добавить новое блюдо в меню
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, restaurantId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Тартар из говядины
 *               description:
 *                 type: string
 *                 example: Классический французский тартар с каперсами
 *               restaurantId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               photo:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/photo.jpg
 *               price:
 *                 type: number
 *                 example: 1200
 *               category:
 *                 type: string
 *                 example: Основные блюда
 *     responses:
 *       201:
 *         description: Блюдо успешно добавлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dish:
 *                   $ref: '#/components/schemas/Dish'
 *       400:
 *         description: Блюдо уже существует или ошибка валидации
 *       401:
 *         description: Требуется авторизация
 */
router.post('/', authenticate, addDish);

/**
 * @swagger
 * /api/dishes/{dishId}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Получить отзывы на блюдо
 *     parameters:
 *       - in: path
 *         name: dishId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID блюда
 *     responses:
 *       200:
 *         description: Список отзывов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DishReview'
 */
router.get('/:dishId/reviews', optionalAuth, getDishReviews);

/**
 * @swagger
 * /api/dishes/{dishId}/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Добавить отзыв на блюдо
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dishId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *                 example: 9.5
 *               comment:
 *                 type: string
 *                 example: Великолепное блюдо! Мясо идеально прожарено.
 *               foodPairing:
 *                 type: string
 *                 example: Рекомендую с красным вином Каберне Совиньон
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example: ["https://example.com/photo1.jpg"]
 *     responses:
 *       201:
 *         description: Отзыв успешно добавлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 review:
 *                   $ref: '#/components/schemas/DishReview'
 *       400:
 *         description: Вы уже оставили отзыв на это блюдо
 *       401:
 *         description: Требуется авторизация
 */
router.post('/:dishId/reviews', authenticate, addReview);

export default router;
