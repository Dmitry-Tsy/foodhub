import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Achievement, UserAchievement } from '../types/profile';
import { AchievementBadge, Loading } from '../components';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { ACHIEVEMENTS, getUserAchievements, checkAchievements } from '../services/achievementService';
import { useAppSelector } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Achievements'>;

const AchievementsScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || 'guest';

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const achievements = await getUserAchievements(userId);
      setUserAchievements(achievements);
      
      // Проверяем новые достижения
      const stats = {
        reviewsCount: 0,
        cuisinesTried: 0,
        photosUploaded: 0,
        trustScore: user?.trustScore || 0,
        dishesAdded: 0,
        followersCount: user?.followersCount || 0,
      };
      
      await checkAchievements(userId, stats);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementsByCategory = (category: Achievement['category']) => {
    return ACHIEVEMENTS.filter(a => a.category === category);
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievementId === achievementId && ua.progress >= 100);
  };

  const getFilteredAchievements = () => {
    if (filter === 'unlocked') {
      return ACHIEVEMENTS.filter(a => isUnlocked(a.id));
    }
    if (filter === 'locked') {
      return ACHIEVEMENTS.filter(a => !isUnlocked(a.id));
    }
    return ACHIEVEMENTS;
  };

  const unlockedCount = userAchievements.filter(ua => ua.progress >= 100).length;
  const totalPoints = ACHIEVEMENTS
    .filter(a => isUnlocked(a.id))
    .reduce((sum, a) => sum + (a.reward?.points || 0), 0);

  if (loading) {
    return <Loading fullScreen text="Загрузка достижений..." />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Stats Header */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{unlockedCount}/{ACHIEVEMENTS.length}</Text>
          <Text style={styles.statLabel}>Разблокировано</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Очков</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Прогресс</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {[
          { key: 'all', label: 'Все', icon: 'grid' },
          { key: 'unlocked', label: 'Получено', icon: 'checkmark-circle' },
          { key: 'locked', label: 'Закрыто', icon: 'lock-closed' },
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterButton, filter === f.key && styles.filterButtonActive]}
            onPress={() => setFilter(f.key as any)}
          >
            <Ionicons
              name={f.icon as any}
              size={20}
              color={filter === f.key ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.filterText,
                filter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Achievements by Category */}
      {['critic', 'explorer', 'photographer', 'contributor', 'social'].map(category => {
        const categoryAchievements = getAchievementsByCategory(category as any);
        const filtered = categoryAchievements.filter(a => 
          filter === 'all' || 
          (filter === 'unlocked' && isUnlocked(a.id)) ||
          (filter === 'locked' && !isUnlocked(a.id))
        );

        if (filtered.length === 0) return null;

        const categoryNames: Record<string, string> = {
          critic: '🍽️ Критик',
          explorer: '🗺️ Исследователь',
          photographer: '📸 Фотограф',
          contributor: '✍️ Создатель контента',
          social: '👥 Социальная активность',
        };

        return (
          <View key={category} style={styles.category}>
            <Text style={styles.categoryTitle}>{categoryNames[category]}</Text>
            <View style={styles.achievementsGrid}>
              {filtered.map(achievement => (
                <TouchableOpacity
                  key={achievement.id}
                  onPress={() => {
                    // TODO: Show achievement detail modal
                  }}
                >
                  <AchievementBadge
                    achievement={achievement}
                    userAchievement={userAchievements.find(ua => ua.achievementId === achievement.id)}
                    size="large"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}

      {getFilteredAchievements().length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="trophy-outline" size={64} color={Colors.textLight} />
          <Text style={styles.emptyText}>
            {filter === 'unlocked' 
              ? 'Пока нет разблокированных достижений'
              : 'Нет достижений в этой категории'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    margin: Theme.spacing.md,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    ...Theme.shadows.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  filters: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: `${Colors.primary}10`,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.primary,
    fontWeight: Theme.fontWeight.semibold,
  },
  category: {
    padding: Theme.spacing.md,
    backgroundColor: Colors.surface,
    marginBottom: Theme.spacing.sm,
  },
  categoryTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
});

export default AchievementsScreen;
