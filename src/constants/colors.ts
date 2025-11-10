export const Colors = {
  // Primary Colors
  primary: '#FF6B35',
  primaryDark: '#E85A2A',
  primaryLight: '#FF8559',
  
  // Secondary Colors
  secondary: '#4ECDC4',
  secondaryDark: '#3DB3AB',
  secondaryLight: '#6FD9D2',
  
  // Neutral Colors
  background: '#FFFFFF',
  surface: '#F7F7F7',
  card: '#FFFFFF',
  
  // Text Colors
  text: '#2D3436',
  textSecondary: '#636E72',
  textLight: '#B2BEC3',
  
  // Status Colors
  success: '#00B894',
  error: '#D63031',
  warning: '#FDCB6E',
  info: '#0984E3',
  
  // Rating Colors
  ratingExcellent: '#00B894', // 8.0-10.0
  ratingGood: '#55EFC4',      // 6.0-7.9
  ratingAverage: '#FDCB6E',   // 4.0-5.9
  ratingPoor: '#FF7675',      // 2.0-3.9
  ratingBad: '#D63031',       // 0.0-1.9
  
  // UI Elements
  border: '#DFE6E9',
  borderLight: '#F0F3F4',
  shadow: '#00000029',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Social
  like: '#E74C3C',
  trust: '#3498DB',
  
  // Transparent
  transparent: 'transparent',
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 8.0) return Colors.ratingExcellent;
  if (rating >= 6.0) return Colors.ratingGood;
  if (rating >= 4.0) return Colors.ratingAverage;
  if (rating >= 2.0) return Colors.ratingPoor;
  return Colors.ratingBad;
};

