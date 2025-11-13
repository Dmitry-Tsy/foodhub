import { TasteProfile, Recommendation, Pairing } from '../types/profile';
import { Dish, Restaurant } from '../types';
import { simulateDelay } from './mockData';

// Простой AI-движок для рекомендаций (rule-based)

export const generateRecommendations = async (
  profile: TasteProfile,
  allDishes: Dish[],
  allRestaurants: Restaurant[]
): Promise<Recommendation[]> => {
  console.log('🤖 Генерация персональных рекомендаций...');
  await simulateDelay();

  const recommendations: Recommendation[] = [];

  // Рекомендации по кухням
  for (const restaurant of allRestaurants) {
    if (profile.favoriteCuisines.includes(restaurant.cuisineType)) {
      recommendations.push({
        type: 'restaurant',
        itemId: restaurant.id,
        score: 85 + Math.random() * 15,
        reason: `Вы любите ${restaurant.cuisineType.toLowerCase()} кухню`,
        tags: [restaurant.cuisineType, 'любимая кухня'],
      });
    }
  }

  // Рекомендации по блюдам
  for (const dish of allDishes) {
    let score = 50;
    const reasons: string[] = [];
    const tags: string[] = [];

    // Проверка ингредиентов
    const description = (dish.description || '').toLowerCase();
    
    profile.favoriteIngredients.forEach(ingredient => {
      if (description.includes(ingredient.toLowerCase())) {
        score += 15;
        reasons.push(`содержит ${ingredient.toLowerCase()}`);
        tags.push(ingredient);
      }
    });

    // Исключенные ингредиенты
    const hasExcluded = profile.excludedIngredients.some(ingredient =>
      description.includes(ingredient.toLowerCase())
    );
    if (hasExcluded) {
      continue; // Пропускаем блюда с аллергенами
    }

    // Ценовой диапазон
    if (dish.price) {
      const [minPrice, maxPrice] = profile.preferredPriceRange;
      if (dish.price >= minPrice && dish.price <= maxPrice) {
        score += 10;
      } else {
        score -= 20;
      }
    }

    // Рейтинг блюда
    if (dish.averageRating > 8) {
      score += 15;
      reasons.push('высокий рейтинг');
    }

    if (score >= 65) {
      recommendations.push({
        type: 'dish',
        itemId: dish.id,
        score: Math.min(100, score),
        reason: reasons.length > 0 
          ? `Вам понравится, потому что ${reasons.join(', ')}`
          : 'На основе вашего вкусового профиля',
        tags,
      });
    }
  }

  // Сортируем по score
  recommendations.sort((a, b) => b.score - a.score);

  console.log(`✅ Создано ${recommendations.length} рекомендаций`);
  return recommendations.slice(0, 20); // Топ 20
};

// AI-сомелье - подбор напитков
export const suggestPairings = async (dish: Dish): Promise<Pairing[]> => {
  console.log('🍷 AI-сомелье подбирает напитки для:', dish.name);
  await simulateDelay();

  const pairings: Pairing[] = [];
  const description = (dish.description || '' + dish.name).toLowerCase();
  const category = (dish.category || '').toLowerCase();

  // Правила подбора напитков
  const rules: Array<{
    keywords: string[];
    drink: string;
    drinkType: Pairing['drinkType'];
    reason: string;
  }> = [
    {
      keywords: ['стейк', 'говядина', 'мясо', 'баранина'],
      drink: 'Каберне Совиньон или Мальбек',
      drinkType: 'wine',
      reason: 'Танины красного вина отлично дополняют жирное мясо',
    },
    {
      keywords: ['рыба', 'морепродукты', 'креветки', 'лосось'],
      drink: 'Белое сухое вино (Шардоне или Совиньон Блан)',
      drinkType: 'wine',
      reason: 'Легкость белого вина подчеркивает деликатность морепродуктов',
    },
    {
      keywords: ['паста', 'спагетти', 'лазанья', 'карбонара'],
      drink: 'Кьянти или Пино Гриджио',
      drinkType: 'wine',
      reason: 'Классическое сочетание для итальянской кухни',
    },
    {
      keywords: ['суши', 'роллы', 'сашими'],
      drink: 'Холодный саке или Рислинг',
      drinkType: 'sake',
      reason: 'Саке создан для японской кухни, подчеркивает вкус риса',
    },
    {
      keywords: ['рамен', 'удон', 'соба'],
      drink: 'Японское пиво (Asahi, Sapporo) или зеленый чай',
      drinkType: 'beer',
      reason: 'Легкое пиво освежает между ложками насыщенного бульона',
    },
    {
      keywords: ['острый', 'чили', 'перец', 'острое'],
      drink: 'Германский Рислинг (сладкий) или IPA',
      drinkType: 'beer',
      reason: 'Сладость вина или горечь IPA балансирует остроту',
    },
    {
      keywords: ['десерт', 'торт', 'пирожное', 'шоколад'],
      drink: 'Портвейн или кофе эспрессо',
      drinkType: 'other',
      reason: 'Сладкое вино дополняет десерт, кофе контрастирует',
    },
    {
      keywords: ['бургер', 'гамбургер', 'burger'],
      drink: 'Крафтовое пиво или кола',
      drinkType: 'beer',
      reason: 'Классика американской кухни',
    },
    {
      keywords: ['пицца'],
      drink: 'Итальянское пиво (Peroni) или Кьянти',
      drinkType: 'beer',
      reason: 'Традиционное сочетание для пиццы',
    },
    {
      keywords: ['салат', 'овощи', 'зелень'],
      drink: 'Просекко или легкое белое вино',
      drinkType: 'wine',
      reason: 'Легкое игристое отлично подходит к свежим овощам',
    },
  ];

  // Применяем правила
  for (const rule of rules) {
    const matches = rule.keywords.some(keyword => 
      description.includes(keyword) || category.includes(keyword)
    );

    if (matches) {
      pairings.push({
        dishId: dish.id,
        drink: rule.drink,
        drinkType: rule.drinkType,
        confidence: 75 + Math.random() * 20,
        reason: rule.reason,
        addedBy: 'ai',
        votes: 0,
      });
    }
  }

  // Если ничего не подошло, универсальные рекомендации
  if (pairings.length === 0) {
    pairings.push(
      {
        dishId: dish.id,
        drink: 'Минеральная вода или свежевыжатый сок',
        drinkType: 'other',
        confidence: 60,
        reason: 'Универсальное сочетание для любого блюда',
        addedBy: 'ai',
        votes: 0,
      },
      {
        dishId: dish.id,
        drink: 'Белое сухое вино',
        drinkType: 'wine',
        confidence: 55,
        reason: 'Безопасный выбор для большинства блюд',
        addedBy: 'ai',
        votes: 0,
      }
    );
  }

  console.log(`🍷 Подобрано ${pairings.length} напитков`);
  return pairings;
};

// Поиск по ингредиентам
export const searchByIngredients = async (
  includedIngredients: string[],
  excludedIngredients: string[],
  allDishes: Dish[]
): Promise<Dish[]> => {
  console.log('🔍 Поиск по ингредиентам:', { includedIngredients, excludedIngredients });
  await simulateDelay();

  return allDishes.filter(dish => {
    const description = (dish.description || '' + dish.name).toLowerCase();

    // Проверяем наличие требуемых ингредиентов
    const hasIncluded = includedIngredients.length === 0 || 
      includedIngredients.some(ing => description.includes(ing.toLowerCase()));

    // Проверяем отсутствие исключенных ингредиентов
    const hasExcluded = excludedIngredients.some(ing => 
      description.includes(ing.toLowerCase())
    );

    return hasIncluded && !hasExcluded;
  });
};

