import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
  id: string;  // Обязательное поле
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  trustScore: number;
  followersCount: number;
  followingCount: number;
  reviewsCount: number;
  photosCount: number;
  dishesAddedCount: number;
  cuisinesTried: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания - id опционален, т.к. генерируется автоматически
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar' | 'bio' | 'trustScore' | 'followersCount' | 'followingCount' | 'reviewsCount' | 'photosCount' | 'dishesAddedCount' | 'cuisinesTried' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public avatar?: string;
  public bio?: string;
  public trustScore!: number;
  public followersCount!: number;
  public followingCount!: number;
  public reviewsCount!: number;
  public photosCount!: number;
  public dishesAddedCount!: number;
  public cuisinesTried!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Метод для проверки пароля
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Метод для возврата публичных данных (без пароля)
  public toJSON(): Partial<UserAttributes> {
    const values = { ...this.get() };
    delete (values as any).password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trustScore: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    followersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    followingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reviewsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    photosCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dishesAddedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    cuisinesTried: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

export default User;

