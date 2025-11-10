import { RegisterData, LoginCredentials } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Пароль должен содержать минимум 6 символов' };
  }
  return { isValid: true };
};

export const validateUsername = (username: string): { isValid: boolean; message?: string } => {
  if (username.length < 3) {
    return { isValid: false, message: 'Имя пользователя должно содержать минимум 3 символа' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, message: 'Имя пользователя может содержать только буквы, цифры и _' };
  }
  return { isValid: true };
};

export const validateLoginForm = (credentials: LoginCredentials): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!credentials.email) {
    errors.email = 'Email обязателен';
  } else if (!validateEmail(credentials.email)) {
    errors.email = 'Неверный формат email';
  }
  
  if (!credentials.password) {
    errors.password = 'Пароль обязателен';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (data: RegisterData): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.message || 'Неверное имя пользователя';
  }
  
  if (!validateEmail(data.email)) {
    errors.email = 'Неверный формат email';
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message || 'Неверный пароль';
  }
  
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRating = (rating: number): boolean => {
  return rating >= 0 && rating <= 10;
};

export const validateReview = (rating: number, comment?: string): { isValid: boolean; message?: string } => {
  if (!validateRating(rating)) {
    return { isValid: false, message: 'Рейтинг должен быть от 0 до 10' };
  }
  
  if (comment && comment.length > 1000) {
    return { isValid: false, message: 'Комментарий не должен превышать 1000 символов' };
  }
  
  return { isValid: true };
};

