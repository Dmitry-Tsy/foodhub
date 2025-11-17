import { Animated } from 'react-native';

// Плавное появление
export const fadeIn = (value: Animated.Value, duration: number = 300) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  });
};

// Плавное исчезновение
export const fadeOut = (value: Animated.Value, duration: number = 300) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};

// Масштабирование
export const scaleIn = (value: Animated.Value, duration: number = 300) => {
  return Animated.spring(value, {
    toValue: 1,
    friction: 8,
    tension: 40,
    useNativeDriver: true,
  });
};

// Пульсация
export const pulse = (value: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ])
  );
};

// Скольжение снизу
export const slideUp = (value: Animated.Value, duration: number = 300) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};

// Скольжение сверху
export const slideDown = (value: Animated.Value, duration: number = 300) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  });
};

