import User from './User';
import Restaurant from './Restaurant';
import Dish from './Dish';
import DishReview from './DishReview';
import TasteProfile from './TasteProfile';
import Follow from './Follow';
import Favorite from './Favorite';
import UserAchievement from './UserAchievement';

// Определение связей между моделями

// User → Dishes (добавленные блюда)
User.hasMany(Dish, {
  foreignKey: 'addedBy',
  as: 'addedDishes',
});
Dish.belongsTo(User, {
  foreignKey: 'addedBy',
  as: 'author',
});

// User → Reviews
User.hasMany(DishReview, {
  foreignKey: 'authorId',
  as: 'reviews',
});
DishReview.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

// Restaurant → Dishes
Restaurant.hasMany(Dish, {
  foreignKey: 'restaurantId',
  as: 'dishes',
});
Dish.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
  as: 'restaurant',
});

// Dish → Reviews
Dish.hasMany(DishReview, {
  foreignKey: 'dishId',
  as: 'reviews',
});
DishReview.belongsTo(Dish, {
  foreignKey: 'dishId',
  as: 'dish',
});

// User → TasteProfile (one-to-one)
User.hasOne(TasteProfile, {
  foreignKey: 'userId',
  as: 'tasteProfile',
});
TasteProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// User → Follows (подписки)
User.belongsToMany(User, {
  through: Follow,
  as: 'following',
  foreignKey: 'followerId',
  otherKey: 'followingId',
});

User.belongsToMany(User, {
  through: Follow,
  as: 'followers',
  foreignKey: 'followingId',
  otherKey: 'followerId',
});

// User → Favorites (избранные рестораны)
User.belongsToMany(Restaurant, {
  through: Favorite,
  as: 'favoriteRestaurants',
  foreignKey: 'userId',
  otherKey: 'restaurantId',
});

Restaurant.belongsToMany(User, {
  through: Favorite,
  as: 'favoritedBy',
  foreignKey: 'restaurantId',
  otherKey: 'userId',
});

// User → Achievements
User.hasMany(UserAchievement, {
  foreignKey: 'userId',
  as: 'achievements',
});
UserAchievement.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export {
  User,
  Restaurant,
  Dish,
  DishReview,
  TasteProfile,
  Follow,
  Favorite,
  UserAchievement,
};

