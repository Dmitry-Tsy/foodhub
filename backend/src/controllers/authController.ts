import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { AuthRequest } from '../middleware/auth';

// Генерация JWT токена
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' } as any);
};

// Регистрация
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Проверка существования
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Пользователь с таким email уже существует',
      });
    }

    const existingUsername = await User.findOne({
      where: { username },
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        error: 'Пользователь с таким именем уже существует',
      });
    }

    // Создание пользователя (id генерируется автоматически)
    const user = await User.create({
      username,
      email,
      password,
      trustScore: 0,
      followersCount: 0,
      followingCount: 0,
      reviewsCount: 0,
      photosCount: 0,
      dishesAddedCount: 0,
      cuisinesTried: 0,
    });

    const token = generateToken(user.id);

    console.log('✅ Новый пользователь зарегистрирован:', username);

    res.status(201).json({
      user: user.toJSON(),
      token,
    });
  } catch (error: any) {
    console.error('Error in register:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка регистрации',
    });
  }
};

// Вход
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль',
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль',
      });
    }

    const token = generateToken(user.id);

    console.log('✅ Пользователь вошел:', user.username);

    res.json({
      user: user.toJSON(),
      token,
    });
  } catch (error: any) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка входа',
    });
  }
};

// Получение текущего пользователя
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      user: req.user.toJSON(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка получения пользователя',
    });
  }
};

// Обновление профиля
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = req.user;

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    console.log('✅ Профиль обновлен:', user.username);

    res.json({
      user: user.toJSON(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Ошибка обновления профиля',
    });
  }
};

