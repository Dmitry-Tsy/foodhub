import { Response } from 'express';
import { TasteProfile, User } from '../models';
import { AuthRequest } from '../middleware/auth';

// Получить вкусовой профиль пользователя
export const getTasteProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const profile = await TasteProfile.findOne({
      where: { userId },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Вкусовой профиль не найден',
      });
    }

    res.json({ profile });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Создать или обновить вкусовой профиль
export const upsertTasteProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      favoriteCuisines,
      favoriteIngredients,
      excludedIngredients,
      spicyLevel,
      dietaryRestrictions,
      preferredPriceRangeMin,
      preferredPriceRangeMax,
      tastePreferences,
    } = req.body;

    let profile = await TasteProfile.findOne({ where: { userId } });

    if (profile) {
      // Обновление существующего профиля
      await profile.update({
        favoriteCuisines: favoriteCuisines || profile.favoriteCuisines,
        favoriteIngredients: favoriteIngredients || profile.favoriteIngredients,
        excludedIngredients: excludedIngredients || profile.excludedIngredients,
        spicyLevel: spicyLevel || profile.spicyLevel,
        dietaryRestrictions: dietaryRestrictions || profile.dietaryRestrictions,
        preferredPriceRangeMin: preferredPriceRangeMin !== undefined ? preferredPriceRangeMin : profile.preferredPriceRangeMin,
        preferredPriceRangeMax: preferredPriceRangeMax !== undefined ? preferredPriceRangeMax : profile.preferredPriceRangeMax,
        tastePreferences: tastePreferences || profile.tastePreferences,
      });
      console.log('✅ Вкусовой профиль обновлен:', userId);
    } else {
      // Создание нового профиля
      profile = await TasteProfile.create({
        userId,
        favoriteCuisines: favoriteCuisines || [],
        favoriteIngredients: favoriteIngredients || [],
        excludedIngredients: excludedIngredients || [],
        spicyLevel: spicyLevel || 'medium',
        dietaryRestrictions: dietaryRestrictions || [],
        preferredPriceRangeMin: preferredPriceRangeMin || 0,
        preferredPriceRangeMax: preferredPriceRangeMax || 5000,
        tastePreferences: tastePreferences || { sweet: 5, salty: 5, sour: 5, bitter: 5, umami: 5 },
      });
      console.log('✅ Вкусовой профиль создан:', userId);
    }

    const profileWithUser = await TasteProfile.findByPk(profile.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
    });

    res.json({ profile: profileWithUser });
  } catch (error: any) {
    console.error('Error upserting taste profile:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка сохранения профиля',
    });
  }
};

// Удалить вкусовой профиль
export const deleteTasteProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const profile = await TasteProfile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Профиль не найден',
      });
    }

    await profile.destroy();
    console.log('✅ Вкусовой профиль удален:', userId);

    res.json({
      success: true,
      message: 'Профиль удален',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

