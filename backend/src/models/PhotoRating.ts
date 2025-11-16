import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface PhotoRatingAttributes {
  id: string;
  photoUrl: string; // URL фото
  reviewId: string; // ID отзыва, к которому относится фото
  dishId: string; // ID блюда (для быстрого поиска)
  userId: string; // ID пользователя, который поставил лайк
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PhotoRatingCreationAttributes extends Optional<PhotoRatingAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class PhotoRating extends Model<PhotoRatingAttributes, PhotoRatingCreationAttributes> implements PhotoRatingAttributes {
  public id!: string;
  public photoUrl!: string;
  public reviewId!: string;
  public dishId!: string;
  public userId!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PhotoRating.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    photoUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reviewId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'dish_reviews',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'photo_ratings',
    timestamps: true,
    indexes: [
      {
        fields: ['photoUrl', 'reviewId'], // Уникальность: один пользователь = один лайк на фото
        unique: true,
      },
      {
        fields: ['dishId'],
      },
      {
        fields: ['reviewId'],
      },
      {
        fields: ['userId'],
      },
    ],
  }
);

export default PhotoRating;

