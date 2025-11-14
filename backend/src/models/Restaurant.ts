import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface RestaurantAttributes {
  id: string;  // Обязательное поле
  googlePlaceId?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisineType: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  photos?: string[];
  averageRating?: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания - id опционален, т.к. генерируется автоматически
export interface RestaurantCreationAttributes extends Optional<RestaurantAttributes, 'id' | 'googlePlaceId' | 'phone' | 'website' | 'openingHours' | 'photos' | 'averageRating' | 'reviewCount' | 'createdAt' | 'updatedAt'> {}

class Restaurant extends Model<RestaurantAttributes, RestaurantCreationAttributes> implements RestaurantAttributes {
  public id!: string;
  public googlePlaceId?: string;
  public name!: string;
  public address!: string;
  public latitude!: number;
  public longitude!: number;
  public cuisineType!: string;
  public phone?: string;
  public website?: string;
  public openingHours?: string;
  public photos?: string[];
  public averageRating?: number;
  public reviewCount!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Restaurant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    googlePlaceId: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    cuisineType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    website: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    openingHours: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photos: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
    },
    averageRating: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'restaurants',
    timestamps: true,
    indexes: [
      {
        fields: ['latitude', 'longitude'],
      },
      {
        fields: ['cuisineType'],
      },
    ],
  }
);

export default Restaurant;

