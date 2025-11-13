// Современная цветовая палитра для FoodHub

export const Colors = {
  // Основные цвета
  primary: '#FF6B35',      // Яркий коралловый/оранжевый
  primaryDark: '#E85A2A',  // Темный оттенок primary
  primaryLight: '#FF8F6B', // Светлый оттенок primary
  primaryGradientStart: '#FF6B35', // Для совместимости
  primaryGradientEnd: '#FF8F6B',   // Для совместимости
  
  secondary: '#4ECDC4',    // Бирюзовый
  secondaryDark: '#45B8AF',
  secondaryLight: '#7FDDD6',
  
  // Accent (для совместимости)
  accent: '#9B59B6',       // Фиолетовый
  accentLight: '#B76CC5',
  accentDark: '#8E44AD',
  
  // Фоновые цвета (яркие и современные!)
  background: '#FFF5F0',   // Легкий персиковый фон (не белый!)
  surface: '#FFFFFF',      // Белые карточки
  surfaceAlt: '#FFE8DC',   // Светло-оранжевая альтернатива
  surfaceGradient: '#FFF8F5', // Еще один оттенок
  
  // Дополнительные (для совместимости)
  card: '#FFFFFF',         // Карточки
  trust: '#FFB020',        // Цвет доверия
  
  // Текст
  text: '#1A1A1A',         // Почти черный
  textSecondary: '#6C757D', // Серый
  textLight: '#ADB5BD',    // Светло-серый
  textInverse: '#FFFFFF',  // Белый текст
  
  // Границы
  border: '#DEE2E6',
  borderLight: '#E9ECEF',
  
  // Семантические цвета
  success: '#51CF66',      // Зеленый
  warning: '#FFB020',      // Золотой
  error: '#FF6B6B',        // Красный
  info: '#4C6EF5',         // Синий
  gold: '#FFB020',         // Золотой (для звезд рейтинга)
  
  // Специальные эффекты
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  glassDark: 'rgba(0, 0, 0, 0.3)',
  glassLight: 'rgba(255, 255, 255, 0.9)',
  
  // Градиенты
  gradients: {
    primary: ['#FF6B35', '#FF8F6B'],
    secondary: ['#4ECDC4', '#7FDDD6'],
    success: ['#51CF66', '#69DB7C'],
    sunset: ['#FF6B35', '#FFB020', '#FFC47E'],
    ocean: ['#4ECDC4', '#4C6EF5', '#748FFC'],
    hero: ['#FF6B35', '#E85A2A'],
  },
  
  // Рейтинги
  rating: {
    excellent: '#51CF66',  // 9-10
    good: '#FFB020',       // 7-8.9
    average: '#FF922B',    // 5-6.9
    poor: '#FF6B6B',       // 0-4.9
  },
};

export type ColorsType = typeof Colors;

// Утилита для определения цвета рейтинга
export const getRatingColor = (rating: number): string => {
  if (rating >= 9) return Colors.rating.excellent; // 9-10
  if (rating >= 7) return Colors.rating.good;      // 7-8.9
  if (rating >= 5) return Colors.rating.average;   // 5-6.9
  return Colors.rating.poor;                        // 0-4.9
};
