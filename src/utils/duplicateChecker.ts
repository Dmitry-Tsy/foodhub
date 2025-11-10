import stringSimilarity from 'string-similarity';
import { Dish, DuplicateCheckResult } from '../types';

const SIMILARITY_THRESHOLD = 0.85; // 85% схожести

/**
 * Нормализует название блюда для сравнения
 */
const normalizeDishName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, '') // Убираем специальные символы
    .replace(/\s+/g, ' '); // Множественные пробелы в один
};

/**
 * Проверяет существующие блюда на дубликаты
 */
export const checkDuplicateDish = async (
  dishName: string,
  existingDishes: Dish[]
): Promise<DuplicateCheckResult> => {
  if (!dishName || dishName.length < 2) {
    return { isDuplicate: false };
  }

  const normalizedInput = normalizeDishName(dishName);
  
  // Получаем массив названий существующих блюд
  const existingNames = existingDishes.map(dish => normalizeDishName(dish.name));
  
  if (existingNames.length === 0) {
    return { isDuplicate: false };
  }

  // Находим наиболее похожее блюдо
  const matches = stringSimilarity.findBestMatch(normalizedInput, existingNames);
  const bestMatch = matches.bestMatch;

  if (bestMatch.rating >= SIMILARITY_THRESHOLD) {
    const similarDish = existingDishes[matches.bestMatchIndex];
    return {
      isDuplicate: true,
      similarDish: similarDish.name,
      similarity: Math.round(bestMatch.rating * 100),
    };
  }

  return { isDuplicate: false };
};

/**
 * Проверяет точное совпадение названия
 */
export const hasExactMatch = (dishName: string, existingDishes: Dish[]): boolean => {
  const normalizedInput = normalizeDishName(dishName);
  return existingDishes.some(dish => 
    normalizeDishName(dish.name) === normalizedInput
  );
};

/**
 * Возвращает список похожих блюд для предложения пользователю
 */
export const findSimilarDishes = (
  dishName: string,
  existingDishes: Dish[],
  minSimilarity: number = 0.6
): Array<{ dish: Dish; similarity: number }> => {
  if (!dishName || dishName.length < 2) {
    return [];
  }

  const normalizedInput = normalizeDishName(dishName);
  const results: Array<{ dish: Dish; similarity: number }> = [];

  existingDishes.forEach(dish => {
    const normalizedDishName = normalizeDishName(dish.name);
    const similarity = stringSimilarity.compareTwoStrings(normalizedInput, normalizedDishName);
    
    if (similarity >= minSimilarity) {
      results.push({ dish, similarity });
    }
  });

  // Сортируем по убыванию схожести
  return results.sort((a, b) => b.similarity - a.similarity);
};

