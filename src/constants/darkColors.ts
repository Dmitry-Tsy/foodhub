// Темная цветовая палитра для FoodHub

export const DarkColors = {
  // Основные цвета (остаются яркими даже в темной теме)
  primary: '#FF6B35',      // Яркий коралловый
  primaryDark: '#E85A2A',
  primaryLight: '#FF8F6B',
  primaryGradientStart: '#FF6B35',
  primaryGradientEnd: '#FF8F6B',
  
  secondary: '#4ECDC4',    // Бирюзовый
  secondaryDark: '#45B8AF',
  secondaryLight: '#7FDDD6',
  
  accent: '#9B59B6',       // Фиолетовый
  accentLight: '#B76CC5',
  accentDark: '#8E44AD',
  
  // Фоновые цвета (темные)
  background: '#121212',   // Темный фон
  surface: '#1E1E1E',      // Темные карточки
  surfaceAlt: '#2A2A2A',   // Альтернативный темный фон
  surfaceGradient: '#1A1A1A',
  
  card: '#1E1E1E',         // Темные карточки
  trust: '#FFB020',        // Цвет доверия (яркий)
  
  // Текст (светлый на темном)
  text: '#FFFFFF',         // Белый текст
  textSecondary: '#B0B0B0', // Светло-серый
  textLight: '#808080',    // Средне-серый
  textInverse: '#000000',  // Черный текст (для ярких фонов)
  
  // Границы (светлее для видимости)
  border: '#333333',
  borderLight: '#2A2A2A',
  
  // Семантические цвета
  success: '#51CF66',
  warning: '#FFB020',
  warningLight: '#332915',  // Темный фон для предупреждения
  error: '#FF6B6B',
  info: '#4C6EF5',
  gold: '#FFB020',
  
  // Специальные эффекты
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.7)', // Более темный overlay
  
  // Рейтинги (яркие на темном)
  rating: {
    excellent: '#51CF66',  // Зеленый
    veryGood: '#4ECDC4',   // Бирюзовый
    good: '#4C6EF5',       // Синий
    fair: '#FFB020',       // Золотой
    poor: '#FF6B6B',       // Красный
  },
};

// Функция получения цвета рейтинга (та же логика, но для темной темы)
export const getDarkRatingColor = (rating: number | null | undefined): string => {
  if (rating === null || rating === undefined || isNaN(rating)) {
    return DarkColors.rating.poor;
  }
  const numRating = Number(rating);
  if (isNaN(numRating)) {
    return DarkColors.rating.poor;
  }
  const safeRating = Math.max(0, Math.min(10, numRating));
  
  if (safeRating >= 9) return DarkColors.rating.excellent;
  if (safeRating >= 8) return DarkColors.rating.veryGood;
  if (safeRating >= 7) return DarkColors.rating.good;
  if (safeRating >= 6) return DarkColors.rating.fair;
  return DarkColors.rating.poor;
};

