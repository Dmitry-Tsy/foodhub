import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export interface AuthRequest extends Request {
  user?: any;
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Токен отсутствует',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
    
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Пользователь не найден',
      });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Невалидный токен',
    });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
      const user = await User.findByPk(decoded.userId);
      if (user) {
        req.user = user;
        req.userId = user.id;
      }
    }
  } catch (error) {
    // Игнорируем ошибки - это optional auth
  }
  
  next();
};

