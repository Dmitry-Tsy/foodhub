import { TasteProfile } from '../types/profile';
import api from './api';

// Получить вкусовой профиль пользователя
export const getTasteProfile = async (userId: string): Promise<TasteProfile | null> => {
  try {
    console.log('👤 Загрузка вкусового профиля');
    const response = await api.get<{ profile: TasteProfile }>('/taste-profile');
    console.log('✅ Вкусовой профиль загружен');
    return response.profile;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log('⚠️ Вкусовой профиль не найден');
      return null;
    }
    console.error('❌ Ошибка загрузки профиля:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка загрузки профиля');
  }
};

// Создать или обновить вкусовой профиль
export const createTasteProfile = async (
  userId: string,
  data: Omit<TasteProfile, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<TasteProfile> => {
  try {
    console.log('👤 Создание/обновление вкусового профиля');
    const response = await api.post<{ profile: TasteProfile }>('/taste-profile', data);
    console.log('✅ Вкусовой профиль сохранен');
    return response.profile;
  } catch (error: any) {
    console.error('❌ Ошибка сохранения профиля:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка сохранения профиля');
  }
};

// Обновить вкусовой профиль (alias для createTasteProfile, так как API использует upsert)
export const updateTasteProfile = async (
  userId: string,
  updates: Partial<Omit<TasteProfile, 'userId' | 'createdAt'>>
): Promise<TasteProfile> => {
  try {
    console.log('📝 Обновление вкусового профиля');
    const response = await api.post<{ profile: TasteProfile }>('/taste-profile', updates);
    console.log('✅ Профиль обновлен');
    return response.profile;
  } catch (error: any) {
    console.error('❌ Ошибка обновления профиля:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка обновления профиля');
  }
};

// Удалить вкусовой профиль
export const deleteTasteProfile = async (userId: string): Promise<void> => {
  try {
    console.log('🗑️ Удаление вкусового профиля');
    await api.delete('/taste-profile');
    console.log('✅ Профиль удален');
  } catch (error: any) {
    console.error('❌ Ошибка удаления профиля:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка удаления профиля');
  }
};

// Популярные кухни
export const POPULAR_CUISINES = [
  'Итальянская',
  'Японская',
  'Грузинская',
  'Русская',
  'Французская',
  'Китайская',
  'Тайская',
  'Индийская',
  'Мексиканская',
  'Корейская',
  'Американская',
  'Средиземноморская',
  'Вьетнамская',
  'Турецкая',
];

// Популярные ингредиенты
export const POPULAR_INGREDIENTS = [
  'Морепродукты',
  'Курица',
  'Говядина',
  'Свинина',
  'Рыба',
  'Грибы',
  'Сыр',
  'Помидоры',
  'Авокадо',
  'Паста',
  'Рис',
  'Картофель',
  'Зелень',
  'Специи',
  'Соусы',
];

// Частые аллергены
export const COMMON_ALLERGENS = [
  'Арахис',
  'Орехи',
  'Глютен',
  'Лактоза',
  'Яйца',
  'Соя',
  'Морепродукты',
  'Рыба',
  'Кунжут',
  'Горчица',
];
