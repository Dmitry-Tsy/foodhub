import { formatDistanceToNow, format } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Форматирует расстояние в удобочитаемый формат
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} м`;
  }
  return `${(meters / 1000).toFixed(1)} км`;
};

/**
 * Форматирует рейтинг с одним десятичным знаком
 * Безопасная обработка null/undefined
 */
export const formatRating = (rating: number | null | undefined): string => {
  // Защита от null/undefined
  if (rating === null || rating === undefined || isNaN(rating)) {
    return '0.0';
  }
  
  // Проверяем что это число
  const numRating = Number(rating);
  if (isNaN(numRating)) {
    return '0.0';
  }
  
  // Ограничиваем диапазон от 0 до 10
  const safeRating = Math.max(0, Math.min(10, numRating));
  
  try {
    return safeRating.toFixed(1);
  } catch (error) {
    console.error('❌ Ошибка в formatRating:', error, rating);
    return '0.0';
  }
};

/**
 * Форматирует дату в относительный формат (например, "2 часа назад")
 * Безопасная обработка ошибок
 */
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  try {
    if (!date) {
      return 'Недавно';
    }
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Проверяем валидность даты
    if (isNaN(dateObj.getTime())) {
      console.warn('⚠️ formatRelativeTime: неверная дата', date);
      return 'Недавно';
    }
    
    return formatDistanceToNow(dateObj, { 
      addSuffix: true,
      locale: ru 
    });
  } catch (error) {
    console.error('❌ Ошибка в formatRelativeTime:', error, date);
    return 'Недавно';
  }
};

/**
 * Форматирует дату в абсолютный формат
 */
export const formatDate = (date: string | Date, formatString: string = 'dd.MM.yyyy'): string => {
  return format(new Date(date), formatString, { locale: ru });
};

/**
 * Форматирует количество подписчиков/отзывов в короткий формат
 */
export const formatCount = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  }
  if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return `${(count / 1000000).toFixed(1)}M`;
};

/**
 * Форматирует цену
 */
export const formatPrice = (price: number, currency: string = '₽'): string => {
  return `${price} ${currency}`;
};

/**
 * Обрезает текст до определенной длины
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

