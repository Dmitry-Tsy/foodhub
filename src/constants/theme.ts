import { Colors } from './colors';

export const Theme = {
  colors: Colors,
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 10,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
    },
  },
  
  // Градиентные пресеты
  gradients: {
    primary: ['#FF6B35', '#FF8F6B', '#FFB020'],
    secondary: ['#4ECDC4', '#7FDDD6'],
    sunset: ['#FF6B35', '#FFB020', '#FFC47E'],
    ocean: ['#4ECDC4', '#4C6EF5'],
    success: ['#51CF66', '#69DB7C'],
  },
  
  layout: {
    screenPadding: 16,
    cardPadding: 16,
    maxWidth: 768,
  },
};

export type ThemeType = typeof Theme;

