import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface FavoriteAttributes {
  id: string;
  userId: string;
  restaurantId: string;
  createdAt?: Date;
}

class Favorite extends Model<FavoriteAttributes> implements FavoriteAttributes {
  public id!: string;
  public userId!: string;
  public restaurantId!: string;
  public readonly createdAt!: Date;
}

Favorite.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'restaurants',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'favorites',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'restaurantId'],
      },
    ],
  }
);

export default Favorite;

