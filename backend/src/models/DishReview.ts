import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface DishReviewAttributes {
  id: string;  // Обязательное поле
  dishId: string;
  authorId: string;
  rating: number;
  comment?: string;
  foodPairing?: string;
  photos: string[];
  helpfulCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания - id опционален, т.к. генерируется автоматически
export interface DishReviewCreationAttributes extends Optional<DishReviewAttributes, 'id' | 'comment' | 'foodPairing' | 'photos' | 'helpfulCount' | 'createdAt' | 'updatedAt'> {}

class DishReview extends Model<DishReviewAttributes, DishReviewCreationAttributes> implements DishReviewAttributes {
  public id!: string;
  public dishId!: string;
  public authorId!: string;
  public rating!: number;
  public comment?: string;
  public foodPairing?: string;
  public photos!: string[];
  public helpfulCount!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DishReview.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    dishId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'dishes',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    foodPairing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    helpfulCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'dish_reviews',
    timestamps: true,
    indexes: [
      {
        fields: ['dishId'],
      },
      {
        fields: ['authorId'],
      },
      {
        fields: ['rating'],
      },
    ],
  }
);

export default DishReview;

