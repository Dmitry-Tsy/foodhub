import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface UserAchievementAttributes {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  unlockedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class UserAchievement extends Model<UserAchievementAttributes> implements UserAchievementAttributes {
  public id!: string;
  public userId!: string;
  public achievementId!: string;
  public progress!: number;
  public unlockedAt?: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserAchievement.init(
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
      onDelete: 'CASCADE',
    },
    achievementId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    unlockedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_achievements',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'achievementId'],
      },
    ],
  }
);

export default UserAchievement;

