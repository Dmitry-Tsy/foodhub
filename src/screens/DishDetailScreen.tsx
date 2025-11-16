import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Pairing } from '../types';
import { ReviewItem, Loading, Button, GuestPrompt, PairingCard } from '../components';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchDishById } from '../store/slices/dishSlice';
import { fetchDishReviews } from '../store/slices/reviewSlice';
import { formatRating, formatPrice } from '../utils/formatters';
import { getRatingColor } from '../constants/colors';
import { exitGuestMode } from '../store/slices/authSlice';
import { suggestPairings } from '../services/recommendationService';

type Props = NativeStackScreenProps<RootStackParamList, 'DishDetail'>;

const DishDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { dishId } = route.params;
  const dispatch = useAppDispatch();
  
  const { currentDish, isLoading: dishLoading } = useAppSelector(
    (state) => state.dishes
  );
  const { reviews, isLoading: reviewsLoading } = useAppSelector(
    (state) => state.reviews
  );
  const { user, isGuest } = useAppSelector((state) => state.auth);

  const [refreshing, setRefreshing] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [loadingPairings, setLoadingPairings] = useState(false);

  useEffect(() => {
    loadDishData();
  }, [dishId]);

  useEffect(() => {
    if (currentDish) {
      loadPairings();
    }
  }, [currentDish]);

  const loadDishData = () => {
    dispatch(fetchDishById(dishId));
    dispatch(fetchDishReviews({ dishId, page: 1 }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDishData();
    setRefreshing(false);
  };

  const loadPairings = async () => {
    if (!currentDish) return;
    setLoadingPairings(true);
    try {
      const suggestions = await suggestPairings(currentDish);
      setPairings(suggestions);
    } catch (error) {
      console.error('Error loading pairings:', error);
    } finally {
      setLoadingPairings(false);
    }
  };

  const handlePairingVote = (pairing: Pairing, positive: boolean) => {
    console.log('Pairing vote:', pairing.drink, positive ? '👍' : '👎');
    // TODO: Send vote to backend
  };

  const handleAddReview = () => {
    if (isGuest) {
      setShowGuestPrompt(true);
      return;
    }
    
    if (currentDish) {
      navigation.navigate('AddReview', {
        dishId: currentDish.id,
        restaurantId: currentDish.restaurantId,
      });
    }
  };

  const handleGuestLogin = () => {
    setShowGuestPrompt(false);
    dispatch(exitGuestMode());
  };

  const handleAuthorPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  if (dishLoading || !currentDish) {
    return <Loading fullScreen text="Загрузка блюда..." />;
  }

  // Безопасная обработка рейтинга
  const safeRating = currentDish?.averageRating ?? 0;
  const ratingColor = getRatingColor(safeRating);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[Colors.primary]}
        />
      }
    >
      {currentDish.photo ? (
        <Image source={{ uri: currentDish.photo }} style={styles.headerImage} />
      ) : (
        <View style={[styles.headerImage, styles.headerImagePlaceholder]}>
          <Ionicons name="fast-food" size={64} color={Colors.textLight} />
        </View>
      )}

      <View style={styles.ratingBadge}>
        <Text style={[styles.ratingText, { color: ratingColor }]}>
          {formatRating(safeRating)}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{currentDish.name}</Text>
          
          {currentDish.price && (
            <Text style={styles.price}>{formatPrice(currentDish.price)}</Text>
          )}
        </View>

        {currentDish.description && (
          <Text style={styles.description}>{currentDish.description}</Text>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={24} color={Colors.warning} />
            <Text style={styles.statValue}>
              {formatRating(safeRating)}
            </Text>
            <Text style={styles.statLabel}>Рейтинг</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Ionicons name="chatbubbles" size={24} color={Colors.secondary} />
            <Text style={styles.statValue}>{currentDish.reviewCount}</Text>
            <Text style={styles.statLabel}>Отзывов</Text>
          </View>
        </View>

        <Button
          title={isGuest ? "Войдите чтобы написать отзыв" : "Написать отзыв"}
          onPress={handleAddReview}
          style={styles.addReviewButton}
        />

        <GuestPrompt
          visible={showGuestPrompt}
          onClose={() => setShowGuestPrompt(false)}
          onLogin={handleGuestLogin}
          title="Требуется авторизация"
          message="Чтобы оставлять отзывы, необходимо войти в систему или создать аккаунт"
        />

        <View style={styles.reviewsHeader}>
          <Text style={styles.reviewsTitle}>
            Отзывы ({currentDish.reviewCount})
          </Text>
        </View>

        {reviewsLoading ? (
          <Loading text="Загрузка отзывов..." />
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              author={review.author}
              onAuthorPress={() => review.authorId && handleAuthorPress(review.authorId)}
            />
          ))
        ) : (
          <View style={styles.emptyReviews}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>
              Отзывов пока нет
            </Text>
            <Text style={styles.emptySubtext}>
              Будьте первым, кто оставит отзыв!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  headerImagePlaceholder: {
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 250,
    right: Theme.spacing.md,
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.lg,
  },
  ratingText: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
  },
  content: {
    padding: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.md,
  },
  name: {
    flex: 1,
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginRight: Theme.spacing.md,
  },
  price: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.primary,
  },
  description: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Theme.spacing.md,
  },
  addReviewButton: {
    marginBottom: Theme.spacing.xl,
  },
  reviewsHeader: {
    marginBottom: Theme.spacing.md,
  },
  reviewsTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
  },
  emptyReviews: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
  emptySubtext: {
    fontSize: Theme.fontSize.md,
    color: Colors.textLight,
    marginTop: Theme.spacing.xs,
  },
});

export default DishDetailScreen;

