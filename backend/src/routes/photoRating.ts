import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { ratePhoto, getPhotoStats, getDishPhotoRatings } from '../controllers/photoRatingController';

const router = Router();

// Поставить/убрать лайк фото
router.post('/rate', authenticate, ratePhoto);

// Получить статистику по фото (можно смотреть всем)
router.get('/stats', getPhotoStats);

// Получить рейтинги всех фото блюда (без авторизации - можно смотреть всем)
router.get('/dish/:dishId', getDishPhotoRatings);

export default router;

