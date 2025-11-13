import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Recommendation } from '../types/profile';
import { DishCard, RestaurantCard, Loading } from '../components';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { generateRecommendations } from '../services/recommendationService';
import { getTasteProfile } from '../services/tasteProfileService';
import { useAppSelector } from '../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Recommendations'>;

const RecommendationsScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  
  const { user } = useAppSelector((state) => state.auth);
  const { restaurants } = useAppSelector((state) => state.restaurants);
  const { dishes } = useAppSelector((state) => state.dishes);
  
  const userId = user?.id || 'guest';

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const profile = await getTasteProfile(userId);
      
      if (!profile) {
        setHasProfile(false);
        setLoading(false);
        return;
      }

      setHasProfile(true);
      const recs = await generateRecommendations(profile, dishes, restaurants);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationPress = (rec: Recommendation) => {
    if (rec.type === 'dish') {
      navigation.navigate('DishDetail', { dishId: rec.itemId });
    } else if (rec.type === 'restaurant') {
      navigation.navigate('RestaurantDetail', { restaurantId: rec.itemId });
    }
  };

  if (loading) {
    return <Loading fullScreen text="Анализируем ваши предпочтения..." />;
  }

  if (!hasProfile) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="bulb-outline" size={80} color={Colors.primary} />
        <Text style={styles.emptyTitle}>Создайте вкусовой профиль</Text>
        <Text style={styles.emptySubtext}>
          Расскажите о своих предпочтениях, и мы подберем идеальные блюда и рестораны специально для вас!
        </Text>
        <TouchableOpacity
          style={styles.createProfileButton}
          onPress={() => navigation.navigate('TasteProfile')}
        >
          <Ionicons name="create" size={24} color={Colors.textInverse} />
          <Text style={styles.createProfileText}>Настроить профиль</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="sparkles" size={32} color={Colors.secondary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Подобрано для вас</Text>
          <Text style={styles.headerSubtitle}>
            {recommendations.length} рекомендаций на основе вашего профиля
          </Text>
        </View>
      </View>

      <FlatList
        data={recommendations}
        keyExtractor={(item) => `${item.type}_${item.itemId}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recommendationCard}
            onPress={() => handleRecommendationPress(item)}
          >
            <View style={styles.recHeader}>
              <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(item.score) }]}>
                <Text style={styles.scoreText}>{Math.round(item.score)}%</Text>
              </View>
              <View style={styles.recType}>
                <Ionicons
                  name={item.type === 'dish' ? 'restaurant' : 'location'}
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text style={styles.recTypeText}>
                  {item.type === 'dish' ? 'Блюдо' : 'Ресторан'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.recReason}>{item.reason}</Text>
            
            {item.tags.length > 0 && (
              <View style={styles.tags}>
                {item.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.recFooter}>
              <Text style={styles.tapHint}>Нажмите чтобы открыть →</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>
              Пока нет подходящих рекомендаций
            </Text>
            <Text style={styles.emptySubtext}>
              Попробуйте обновить вкусовой профиль или дождитесь появления новых блюд
            </Text>
          </View>
        }
      />
    </View>
  );
};

const getScoreColor = (score: number): string => {
  if (score >= 85) return Colors.success;
  if (score >= 70) return Colors.warning;
  return Colors.info;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Colors.surface,
    gap: Theme.spacing.md,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: `${Colors.secondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  list: {
    padding: Theme.spacing.md,
  },
  recommendationCard: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    ...Theme.shadows.md,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
  },
  scoreBadge: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
  },
  scoreText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textInverse,
  },
  recType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recTypeText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  recReason: {
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: Theme.spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.sm,
  },
  tag: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  tagText: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
  },
  recFooter: {
    alignItems: 'flex-end',
  },
  tapHint: {
    fontSize: Theme.fontSize.xs,
    color: Colors.secondary,
    fontWeight: Theme.fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textLight,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  createProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.round,
    marginTop: Theme.spacing.xl,
  },
  createProfileText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textInverse,
  },
});

export default RecommendationsScreen;
