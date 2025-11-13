import { Achievement, UserAchievement } from '../types/profile';
import { simulateDelay } from './mockData';

// Система достижений
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'food_critic',
    name: 'Гастрономический критик',
    description: 'Написать 30 отзывов о блюдах',
    icon: 'newspaper',
    category: 'critic',
    condition: { type: 'reviews_count', target: 30 },
    reward: { points: 100, badge: '🍽️' },
  },
  {
    id: 'adventurer',
    name: 'Искатель приключений',
    description: 'Попробовать блюда из 10 разных кухонь',
    icon: 'compass',
    category: 'explorer',
    condition: { type: 'cuisines_tried', target: 10 },
    reward: { points: 150, badge: '🗺️' },
  },
  {
    id: 'photographer',
    name: 'Фуд-фотограф',
    description: 'Загрузить 50 фотографий блюд',
    icon: 'camera',
    category: 'photographer',
    condition: { type: 'photos_uploaded', target: 50 },
    reward: { points: 75, badge: '📸' },
  },
  {
    id: 'trusted_expert',
    name: 'Доверенный эксперт',
    description: 'Достичь рейтинга доверия выше 4.5',
    icon: 'shield-checkmark',
    category: 'critic',
    condition: { type: 'trust_score', target: 45 }, // *10 для целых чисел
    reward: { points: 200, badge: '⭐' },
  },
  {
    id: 'first_step',
    name: 'Первые шаги',
    description: 'Написать первый отзыв',
    icon: 'walk',
    category: 'critic',
    condition: { type: 'reviews_count', target: 1 },
    reward: { points: 10, badge: '🎯' },
  },
  {
    id: 'menu_builder',
    name: 'Строитель меню',
    description: 'Добавить 20 блюд в меню ресторанов',
    icon: 'restaurant',
    category: 'contributor',
    condition: { type: 'dishes_added', target: 20 },
    reward: { points: 120, badge: '🍴' },
  },
  {
    id: 'influencer',
    name: 'Гастро-инфлюенсер',
    description: 'Набрать 100 подписчиков',
    icon: 'people',
    category: 'social',
    condition: { type: 'followers_count', target: 100 },
    reward: { points: 250, badge: '👑' },
  },
  {
    id: 'explorer_5',
    name: 'Путешественник',
    description: 'Попробовать 5 разных кухонь',
    icon: 'airplane',
    category: 'explorer',
    condition: { type: 'cuisines_tried', target: 5 },
    reward: { points: 50, badge: '✈️' },
  },
];

let userAchievements: UserAchievement[] = [];

export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  await simulateDelay();
  return userAchievements.filter(ua => ua.userId === userId);
};

export const checkAchievements = async (
  userId: string,
  stats: {
    reviewsCount: number;
    cuisinesTried: number;
    photosUploaded: number;
    trustScore: number;
    dishesAdded: number;
    followersCount: number;
  }
): Promise<UserAchievement[]> => {
  console.log('🏆 Проверка достижений для пользователя:', userId);
  await simulateDelay();

  const newAchievements: UserAchievement[] = [];
  const userAchievementIds = userAchievements
    .filter(ua => ua.userId === userId)
    .map(ua => ua.achievementId);

  for (const achievement of ACHIEVEMENTS) {
    // Пропускаем уже полученные
    if (userAchievementIds.includes(achievement.id)) {
      continue;
    }

    const { type, target } = achievement.condition;
    let current = 0;

    switch (type) {
      case 'reviews_count':
        current = stats.reviewsCount;
        break;
      case 'cuisines_tried':
        current = stats.cuisinesTried;
        break;
      case 'photos_uploaded':
        current = stats.photosUploaded;
        break;
      case 'trust_score':
        current = Math.round(stats.trustScore * 10);
        break;
      case 'dishes_added':
        current = stats.dishesAdded;
        break;
      case 'followers_count':
        current = stats.followersCount;
        break;
    }

    const progress = Math.min(100, Math.round((current / target) * 100));

    if (current >= target) {
      // Достижение разблокировано!
      const newAchievement: UserAchievement = {
        achievementId: achievement.id,
        userId,
        unlockedAt: new Date().toISOString(),
        progress: 100,
      };
      userAchievements.push(newAchievement);
      newAchievements.push(newAchievement);
      console.log('🎊 Новое достижение разблокировано:', achievement.name);
    }
  }

  return newAchievements;
};

export const getAchievementProgress = async (
  userId: string,
  achievementId: string
): Promise<number> => {
  await simulateDelay();
  const userAchievement = userAchievements.find(
    ua => ua.userId === userId && ua.achievementId === achievementId
  );
  return userAchievement?.progress || 0;
};

