import { Router } from 'express';
import {
  getTasteProfile,
  upsertTasteProfile,
  deleteTasteProfile,
} from '../controllers/tasteProfileController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/taste-profile:
 *   get:
 *     tags: [Taste Profile]
 *     summary: Получить вкусовой профиль пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Вкусовой профиль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/TasteProfile'
 *       404:
 *         description: Профиль не найден
 *       401:
 *         description: Требуется авторизация
 */
router.get('/', authenticate, getTasteProfile);

/**
 * @swagger
 * /api/taste-profile:
 *   post:
 *     tags: [Taste Profile]
 *     summary: Создать или обновить вкусовой профиль
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               favoriteCuisines:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Итальянская", "Японская", "Грузинская"]
 *               favoriteIngredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Морепродукты", "Паста", "Сыр"]
 *               excludedIngredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Орехи", "Кинза"]
 *               spicyLevel:
 *                 type: string
 *                 enum: [none, mild, medium, hot, extreme]
 *                 example: medium
 *               dietaryRestrictions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Без глютена", "Вегетарианство"]
 *               preferredPriceRangeMin:
 *                 type: integer
 *                 example: 500
 *               preferredPriceRangeMax:
 *                 type: integer
 *                 example: 3000
 *               tastePreferences:
 *                 type: object
 *                 properties:
 *                   sweet:
 *                     type: integer
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 7
 *                   salty:
 *                     type: integer
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 6
 *                   sour:
 *                     type: integer
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 5
 *                   bitter:
 *                     type: integer
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 4
 *                   umami:
 *                     type: integer
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 8
 *     responses:
 *       200:
 *         description: Профиль создан или обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/TasteProfile'
 *       401:
 *         description: Требуется авторизация
 */
router.post('/', authenticate, upsertTasteProfile);

/**
 * @swagger
 * /api/taste-profile:
 *   delete:
 *     tags: [Taste Profile]
 *     summary: Удалить вкусовой профиль
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Профиль не найден
 *       401:
 *         description: Требуется авторизация
 */
router.delete('/', authenticate, deleteTasteProfile);

export default router;
