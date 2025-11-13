import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface TasteProfileAttributes {
  id: string;  // Обязательное поле
  userId: string;
  favoriteCuisines: string[];
  favoriteIngredients: string[];
  excludedIngredients: string[];
  spicyLevel: 'none' | 'mild' | 'medium' | 'hot' | 'extreme';
  dietaryRestrictions: string[];
  preferredPriceRangeMin: number;
  preferredPriceRangeMax: number;
  tastePreferences: {
    sweet: number;
    salty: number;
    sour: number;
    bitter: number;
    umami: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания - id опционален, т.к. генерируется автоматически
export interface TasteProfileCreationAttributes extends Optional<TasteProfileAttributes, 'id' | 'favoriteCuisines' | 'favoriteIngredients' | 'excludedIngredients' | 'spicyLevel' | 'dietaryRestrictions' | 'preferredPriceRangeMin' | 'preferredPriceRangeMax' | 'tastePreferences' | 'createdAt' | 'updatedAt'> {}

class TasteProfile extends Model<TasteProfileAttributes, TasteProfileCreationAttributes> implements TasteProfileAttributes {
  public id!: string;
  public userId!: string;
  public favoriteCuisines!: string[];
  public favoriteIngredients!: string[];
  public excludedIngredients!: string[];
  public spicyLevel!: 'none' | 'mild' | 'medium' | 'hot' | 'extreme';
  public dietaryRestrictions!: string[];
  public preferredPriceRangeMin!: number;
  public preferredPriceRangeMax!: number;
  public tastePreferences!: {
    sweet: number;
    salty: number;
    sour: number;
    bitter: number;
    umami: number;
  };
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TasteProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    favoriteCuisines: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    favoriteIngredients: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    excludedIngredients: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    spicyLevel: {
      type: DataTypes.ENUM('none', 'mild', 'medium', 'hot', 'extreme'),
      defaultValue: 'medium',
    },
    dietaryRestrictions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    preferredPriceRangeMin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    preferredPriceRangeMax: {
      type: DataTypes.INTEGER,
      defaultValue: 5000,
    },
    tastePreferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        sweet: 5,
        salty: 5,
        sour: 5,
        bitter: 5,
        umami: 5,
      },
    },
  },
  {
    sequelize,
    tableName: 'taste_profiles',
    timestamps: true,
  }
);

export default TasteProfile;

