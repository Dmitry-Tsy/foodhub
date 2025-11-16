import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface DishAttributes {
  id: string;  // Обязательное поле
  name: string;
  description?: string;
  restaurantId: string;
  addedBy: string;
  photo?: string;
  averageRating: number;
  reviewCount: number;
  price?: number;
  category?: string;
  ingredients?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания - id опционален, т.к. генерируется автоматически
export interface DishCreationAttributes extends Optional<DishAttributes, 'id' | 'description' | 'photo' | 'averageRating' | 'reviewCount' | 'price' | 'category' | 'ingredients' | 'createdAt' | 'updatedAt'> {}

class Dish extends Model<DishAttributes, DishCreationAttributes> implements DishAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public restaurantId!: string;
  public addedBy!: string;
  public photo?: string;
  public averageRating!: number;
  public reviewCount!: number;
  public price?: number;
  public category?: string;
  public ingredients?: string[];
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Dish.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'restaurants',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    addedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    averageRating: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'dishes',
    timestamps: true,
    indexes: [
      {
        fields: ['restaurantId'],
      },
      {
        fields: ['addedBy'],
      },
      {
        fields: ['name'],
      },
    ],
  }
);

export default Dish;

