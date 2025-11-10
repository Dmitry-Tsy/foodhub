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
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Форматирует дату в относительный формат (например, "2 часа назад")
 */
export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true,
    locale: ru 
  });
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

