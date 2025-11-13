import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Поддержка DATABASE_URL (для Render и других хостингов)
// или отдельных переменных (для локальной разработки)
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : new Sequelize(
      process.env.DB_NAME || 'foodhub',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );

export default sequelize;

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    
    // Синхронизация моделей
    if (process.env.NODE_ENV === 'production') {
      // В продакшене используем sync без alter (безопаснее)
      await sequelize.sync();
      console.log('📊 Database models synchronized (production mode)');
    } else {
      // В dev режиме используем alter для автообновления
      await sequelize.sync({ alter: true });
      console.log('📊 Database models synchronized (development mode)');
    }
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    process.exit(1);
  }
};

