import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Collection from './Collection';
import Dish from './Dish';

export interface CollectionDishAttributes {
  id: string;
  collectionId: string;
  dishId: string;
  addedAt: Date;
  order: number; // Порядок в коллекции
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CollectionDishCreationAttributes 
  extends Optional<CollectionDishAttributes, 'id' | 'addedAt' | 'order' | 'createdAt' | 'updatedAt'> {}

class CollectionDish extends Model<CollectionDishAttributes, CollectionDishCreationAttributes> 
  implements CollectionDishAttributes {
  public id!: string;
  public collectionId!: string;
  public dishId!: string;
  public addedAt!: Date;
  public order!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Associations
  public collection?: Collection;
  public dish?: Dish;
}

CollectionDish.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    collectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'collections',
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
    addedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'collection_dishes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['collectionId', 'dishId'], // Одно блюдо может быть в коллекции только один раз
      },
      {
        fields: ['collectionId'],
      },
      {
        fields: ['dishId'],
      },
    ],
  }
);

export default CollectionDish;

