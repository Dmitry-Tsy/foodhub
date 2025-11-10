import { Dish } from '../types';
import { mockDishes, simulateDelay } from './mockData';

export const getRestaurantMenu = async (restaurantId: string): Promise<Dish[]> => {
  await simulateDelay();
  
  return mockDishes.filter(dish => dish.restaurantId === restaurantId);
};

export const getDishById = async (dishId: string): Promise<Dish> => {
  await simulateDelay();
  
  const dish = mockDishes.find(d => d.id === dishId);
  
  if (!dish) {
    throw new Error('Блюдо не найдено');
  }
  
  return dish;
};

export const createDish = async (dishData: Partial<Dish>): Promise<Dish> => {
  await simulateDelay();
  
  const newDish: Dish = {
    id: `dish_${Date.now()}`,
    name: dishData.name || '',
    description: dishData.description,
    restaurantId: dishData.restaurantId || '',
    addedBy: dishData.addedBy || '',
    photo: dishData.photo,
    averageRating: 0,
    reviewCount: 0,
    price: dishData.price,
    category: dishData.category,
    createdAt: new Date().toISOString(),
  };
  
  mockDishes.push(newDish);
  return newDish;
};

export const updateDish = async (dishId: string, updates: Partial<Dish>): Promise<Dish> => {
  await simulateDelay();
  
  const dish = mockDishes.find(d => d.id === dishId);
  
  if (!dish) {
    throw new Error('Блюдо не найдено');
  }
  
  Object.assign(dish, updates);
  return dish;
};

export const deleteDish = async (dishId: string): Promise<void> => {
  await simulateDelay();
  
  const index = mockDishes.findIndex(d => d.id === dishId);
  
  if (index === -1) {
    throw new Error('Блюдо не найдено');
  }
  
  mockDishes.splice(index, 1);
};

export const searchDishes = async (query: string): Promise<Dish[]> => {
  await simulateDelay();
  
  const lowercaseQuery = query.toLowerCase();
  
  return mockDishes.filter(dish =>
    dish.name.toLowerCase().includes(lowercaseQuery) ||
    dish.description?.toLowerCase().includes(lowercaseQuery) ||
    dish.category?.toLowerCase().includes(lowercaseQuery)
  );
};

