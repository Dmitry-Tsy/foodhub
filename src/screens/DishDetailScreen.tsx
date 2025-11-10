import React, { useEffect } from 'react';
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
import { RootStackParamList } from '../types';
import { ReviewItem, Loading, Button } from '../components';
import { Theme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchDishById } from '../store/slices/dishSlice';
import { fetchDishReviews } from '../store/slices/reviewSlice';
import { formatRating, formatPrice } from '../utils/formatters';
import { getRatingColor } from '../constants/colors';

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
  const { user } = useAppSelector((state) => state.auth);

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadDishData();
  }, [dishId]);

  const loadDishData = () => {
    dispatch(fetchDishById(dishId));
    dispatch(fetchDishReviews({ dishId, page: 1 }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDishData();
    setRefreshing(false);
  };

  const handleAddReview = () => {
    if (currentDish) {
      navigation.navigate('AddReview', {
        dishId: currentDish.id,
        restaurantId: currentDish.restaurantId,
      });
    }
  };

  const handleAuthorPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  if (dishLoading || !currentDish) {
    return <Loading fullScreen text="Загрузка блюда..." />;
  }

  const ratingColor = getRatingColor(currentDish.averageRating);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[Theme.colors.primary]}
        />
      }
    >
      {currentDish.photo ? (
        <Image source={{ uri: currentDish.photo }} style={styles.headerImage} />
      ) : (
        <View style={[styles.headerImage, styles.headerImagePlaceholder]}>
          <Ionicons name="fast-food" size={64} color={Theme.colors.textLight} />
        </View>
      )}

      <View style={styles.ratingBadge}>
        <Text style={[styles.ratingText, { color: ratingColor }]}>
          {formatRating(currentDish.averageRating)}
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
            <Ionicons name="star" size={24} color={Theme.colors.warning} />
            <Text style={styles.statValue}>
              {formatRating(currentDish.averageRating)}
            </Text>
            <Text style={styles.statLabel}>Рейтинг</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Ionicons name="chatbubbles" size={24} color={Theme.colors.secondary} />
            <Text style={styles.statValue}>{currentDish.reviewCount}</Text>
            <Text style={styles.statLabel}>Отзывов</Text>
          </View>
        </View>

        <Button
          title="Написать отзыв"
          onPress={handleAddReview}
          icon="create-outline"
          style={styles.addReviewButton}
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
            <Ionicons name="chatbubbles-outline" size={48} color={Theme.colors.textLight} />
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
    backgroundColor: Theme.colors.background,
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  headerImagePlaceholder: {
    backgroundColor: Theme.colors.surface,
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
    backgroundColor: Theme.colors.background,
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
    color: Theme.colors.text,
    marginRight: Theme.spacing.md,
  },
  price: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.semibold,
    color: Theme.colors.primary,
  },
  description: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: Theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
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
    color: Theme.colors.text,
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Theme.colors.border,
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
    color: Theme.colors.text,
  },
  emptyReviews: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
  emptySubtext: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
  },
});

export default DishDetailScreen;

