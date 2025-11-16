import { Dish, DuplicateCheckResult } from '../types';

/**
 * Нормализует название блюда для сравнения
 * Убирает регистр, пробелы, знаки препинания
 */
const normalizeDishName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\sа-яё]/gi, '') // Убираем специальные символы (включая русские)
    .replace(/\s+/g, ' ') // Множественные пробелы в один
    .replace(/\s/g, ''); // Убираем все пробелы для точного сравнения
};

/**
 * Проверяет существующие блюда на дубликаты
 * Использует ТОЛЬКО точное совпадение (без учета регистра и пробелов)
 */
export const checkDuplicateDish = async (
  dishName: string,
  existingDishes: Dish[]
): Promise<DuplicateCheckResult> => {
  if (!dishName || dishName.length < 2) {
    return { isDuplicate: false };
  }

  const normalizedInput = normalizeDishName(dishName);
  
  if (normalizedInput.length < 2) {
    return { isDuplicate: false };
  }
  
  // Получаем массив названий существующих блюд
  const existingNames = existingDishes.map(dish => normalizeDishName(dish.name));
  
  if (existingNames.length === 0) {
    return { isDuplicate: false };
  }

  // Проверяем ТОЛЬКО точное совпадение
  const exactMatchIndex = existingNames.findIndex(name => name === normalizedInput);
  
  if (exactMatchIndex !== -1) {
    const similarDish = existingDishes[exactMatchIndex];
    return {
      isDuplicate: true,
      similarDish: similarDish.name,
      similarity: 100, // Точное совпадение
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

