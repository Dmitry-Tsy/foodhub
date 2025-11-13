import { Dish } from '../types';
import api from './api';

// Реальный API для работы с блюдами
export const getRestaurantMenu = async (restaurantId: string): Promise<Dish[]> => {
  try {
    console.log('🍽️ Загрузка меню для ресторана:', restaurantId);
    const response = await api.get<{ dishes: Dish[] }>(`/dishes/restaurant/${restaurantId}`);
    console.log(`✅ Загружено блюд: ${response.dishes.length}`);
    return response.dishes;
  } catch (error: any) {
    console.error('❌ Ошибка загрузки меню:', error.response?.data || error.message);
    // Возвращаем пустой массив если ресторан не найден или еще нет блюд
    if (error.response?.status === 404) {
      console.log('⚠️ Меню пустое');
      return [];
    }
    throw new Error(error.response?.data?.message || 'Ошибка загрузки меню');
  }
};

export const getDishById = async (dishId: string): Promise<Dish> => {
  try {
    console.log('🔍 Поиск блюда по ID:', dishId);
    const response = await api.get<{ dish: Dish }>(`/dishes/${dishId}`);
    console.log('✅ Блюдо найдено:', response.dish.name);
    return response.dish;
  } catch (error: any) {
    console.error('❌ Ошибка поиска блюда:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Блюдо не найдено');
  }
};

export const createDish = async (dishData: Partial<Dish>): Promise<Dish> => {
  try {
    console.log('➕ Создание нового блюда:', dishData.name);
    const response = await api.post<{ dish: Dish }>('/dishes', dishData);
    console.log('✅ Блюдо создано:', response.dish.id);
    return response.dish;
  } catch (error: any) {
    console.error('❌ Ошибка создания блюда:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка создания блюда');
  }
};

export const updateDish = async (dishId: string, updates: Partial<Dish>): Promise<Dish> => {
  try {
    console.log('✏️ Обновление блюда:', dishId);
    const response = await api.put<{ dish: Dish }>(`/dishes/${dishId}`, updates);
    console.log('✅ Блюдо обновлено');
    return response.dish;
  } catch (error: any) {
    console.error('❌ Ошибка обновления блюда:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка обновления блюда');
  }
};

export const deleteDish = async (dishId: string): Promise<void> => {
  try {
    console.log('🗑️ Удаление блюда:', dishId);
    await api.delete(`/dishes/${dishId}`);
    console.log('✅ Блюдо удалено');
  } catch (error: any) {
    console.error('❌ Ошибка удаления блюда:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка удаления блюда');
  }
};
