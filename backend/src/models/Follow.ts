import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface FollowAttributes {
  id: string;
  followerId: string;
  followingId: string;
  createdAt?: Date;
}

class Follow extends Model<FollowAttributes> implements FollowAttributes {
  public id!: string;
  public followerId!: string;
  public followingId!: string;
  public readonly createdAt!: Date;
}

Follow.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    followingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'follows',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['followerId', 'followingId'],
      },
    ],
  }
);

export default Follow;

