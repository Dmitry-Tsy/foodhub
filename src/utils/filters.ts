import { Dish, Restaurant } from '../types';
import { FilterOption, SortOption } from '../components/FilterModal';

// Фильтрация блюд
export const filterDishes = (
  dishes: Dish[],
  filters: FilterOption
): Dish[] => {
  let filtered = [...dishes];

  // Фильтр по категориям
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter((dish) =>
      dish.category && filters.category!.includes(dish.category)
    );
  }

  // Фильтр по рейтингу
  if (filters.rating) {
    const { min, max } = filters.rating;
    filtered = filtered.filter(
      (dish) => dish.averageRating >= min && dish.averageRating <= max
    );
  }

  // Фильтр по цене
  if (filters.price) {
    const { min, max } = filters.price;
    filtered = filtered.filter((dish) => {
      if (!dish.price) return false;
      return dish.price >= min && dish.price <= max;
    });
  }

  // Фильтр по ингредиентам (исключить)
  if (filters.ingredients?.exclude && filters.ingredients.exclude.length > 0) {
    filtered = filtered.filter((dish) => {
      if (!dish.ingredients || dish.ingredients.length === 0) return true;
      return !filters.ingredients!.exclude.some((excluded) =>
        dish.ingredients!.some((ing) =>
          ing.toLowerCase().includes(excluded.toLowerCase())
        )
      );
    });
  }

  // Фильтр по ингредиентам (включить)
  if (filters.ingredients?.include && filters.ingredients.include.length > 0) {
    filtered = filtered.filter((dish) => {
      if (!dish.ingredients || dish.ingredients.length === 0) return false;
      return filters.ingredients!.include.some((included) =>
        dish.ingredients!.some((ing) =>
          ing.toLowerCase().includes(included.toLowerCase())
        )
      );
    });
  }

  return filtered;
};

// Фильтрация ресторанов
export const filterRestaurants = (
  restaurants: Restaurant[],
  filters: FilterOption
): Restaurant[] => {
  let filtered = [...restaurants];

  // Фильтр по рейтингу
  if (filters.rating) {
    const { min, max } = filters.rating;
    filtered = filtered.filter(
      (restaurant) =>
        restaurant.averageRating &&
        restaurant.averageRating >= min &&
        restaurant.averageRating <= max
    );
  }

  return filtered;
};

// Сортировка блюд
export const sortDishes = (
  dishes: Dish[],
  sortBy: SortOption,
  sortOrder: 'asc' | 'desc'
): Dish[] => {
  const sorted = [...dishes];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'rating':
        comparison = (a.averageRating || 0) - (b.averageRating || 0);
        break;
      case 'price':
        comparison = (a.price || 0) - (b.price || 0);
        break;
      case 'date':
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'popularity':
        comparison = (a.reviewCount || 0) - (b.reviewCount || 0);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name, 'ru');
        break;
      default:
        return 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

// Сортировка ресторанов
export const sortRestaurants = (
  restaurants: Restaurant[],
  sortBy: SortOption,
  sortOrder: 'asc' | 'desc'
): Restaurant[] => {
  const sorted = [...restaurants];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'rating':
        comparison =
          (a.averageRating || 0) - (b.averageRating || 0);
        break;
      case 'distance':
        comparison = (a.distance || 0) - (b.distance || 0);
        break;
      case 'popularity':
        comparison = (a.reviewCount || 0) - (b.reviewCount || 0);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name, 'ru');
        break;
      default:
        return 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

