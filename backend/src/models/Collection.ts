import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export interface CollectionAttributes {
  id: string;
  name: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  coverPhoto?: string;
  dishCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CollectionCreationAttributes 
  extends Optional<CollectionAttributes, 'id' | 'description' | 'coverPhoto' | 'dishCount' | 'createdAt' | 'updatedAt'> {}

class Collection extends Model<CollectionAttributes, CollectionCreationAttributes> 
  implements CollectionAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public userId!: string;
  public isPublic!: boolean;
  public coverPhoto?: string;
  public dishCount!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Associations
  public user?: User;
}

Collection.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    coverPhoto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dishCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'collections',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['isPublic'],
      },
      {
        fields: ['name'],
      },
    ],
  }
);

export default Collection;

