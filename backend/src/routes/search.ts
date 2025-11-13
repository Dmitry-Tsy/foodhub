import { Router } from 'express';
import { globalSearch } from '../controllers/searchController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Глобальный поиск по всем сущностям
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Поисковый запрос
 *         example: паста
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [users, dishes, restaurants]
 *         description: Тип поиска (опционально, по умолчанию все)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Максимум результатов на тип
 *     responses:
 *       200:
 *         description: Результаты поиска
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 query:
 *                   type: string
 *                   example: паста
 *                 totalResults:
 *                   type: integer
 *                   example: 15
 *                 results:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     dishes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Dish'
 *                     restaurants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Параметр query обязателен
 */
router.get('/', optionalAuth, globalSearch);

export default router;

