import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
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
import { getDishPhotoRatings } from '../services/photoRatingService';
import { formatRating, formatPrice } from '../utils/formatters';
import { getRatingColor } from '../constants/colors';
import { exitGuestMode } from '../store/slices/authSlice';
import { suggestPairings } from '../services/recommendationService';
import { ReviewPhoto } from '../types';
import { addToHistory } from '../store/slices/historySlice';

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
  const [reviewPhotos, setReviewPhotos] = useState<ReviewPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  useEffect(() => {
    loadDishData();
  }, [dishId]);

  useEffect(() => {
    if (currentDish) {
      // Добавляем блюдо в историю просмотров
      dispatch(addToHistory({ type: 'dish', item: currentDish }));
      loadPairings();
      loadReviewPhotos();
    }
  }, [currentDish, dispatch]);
  
  // Загружаем фото из отзывов и выбираем лучшую для главной фотографии
  const loadReviewPhotos = async () => {
    if (!currentDish) return;
    
    setLoadingPhotos(true);
    try {
      const response = await getDishPhotoRatings(currentDish.id);
      setReviewPhotos(response.photos || []);
    } catch (error) {
      console.error('❌ Ошибка загрузки фото из отзывов:', error);
    } finally {
      setLoadingPhotos(false);
    }
  };
  
  // Выбираем лучшую фотографию для блюда
  // Главная фотография = фото с наибольшим score (rating * voteCount)
  const getBestPhoto = (): string | null => {
    if (reviewPhotos.length === 0) {
      return currentDish?.photo || null;
    }
    
           // Сортируем по score (rating * voteCount)
           const sortedPhotos = [...reviewPhotos].sort((a, b) => (b.score || 0) - (a.score || 0));
           const bestPhoto = sortedPhotos[0];
           
           // Если есть фото с лайками, используем его
           if (bestPhoto && (bestPhoto.score ?? 0) > 0) {
      return bestPhoto.url;
    }
    
    // Иначе используем оригинальное фото блюда, если есть
    return currentDish?.photo || null;
  };
  
  const mainPhoto = getBestPhoto();
  // Фото для галереи под блюдом (исключаем главное фото)
  const galleryPhotos = reviewPhotos
    .filter((photo) => photo.url !== mainPhoto)
    .map((photo) => photo.url)
    .slice(0, 6); // Показываем максимум 6 фото

  const loadDishData = () => {
    dispatch(fetchDishById(dishId));
    dispatch(fetchDishReviews({ dishId, page: 1 }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDishData();
    if (currentDish) {
      await loadReviewPhotos();
    }
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
      {mainPhoto ? (
        <Image source={{ uri: mainPhoto }} style={styles.headerImage} />
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

        {/* Фото из отзывов под описанием блюда */}
        {galleryPhotos.length > 0 && (
          <View style={styles.photosSection}>
            <Text style={styles.photosSectionTitle}>Фото блюда из отзывов</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosScrollContainer}
            >
              {galleryPhotos.map((photoUrl, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    // Находим отзыв с этим фото и открываем его детальный просмотр
                    const reviewWithPhoto = reviews.find((r) =>
                      r.photos?.includes(photoUrl)
                    );
                    if (reviewWithPhoto) {
                      navigation.navigate('ReviewDetail', {
                        reviewId: reviewWithPhoto.id,
                        dishId: reviewWithPhoto.dishId,
                      });
                    }
                  }}
                >
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.reviewPhoto}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
          reviews.map((review) => {
            // Безопасная проверка review
            if (!review || !review.id) {
              console.warn('⚠️ DishDetailScreen: пропущен невалидный review');
              return null;
            }
            
            return (
              <ReviewItem
                key={review.id}
                review={review}
                author={review.author || undefined}
                onAuthorPress={() => review.authorId && handleAuthorPress(review.authorId)}
                onPress={() => {
                  navigation.navigate('ReviewDetail', {
                    reviewId: review.id,
                    dishId: review.dishId,
                  });
                }}
              />
            );
          }).filter(Boolean)
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
  photosSection: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  photosSectionTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  photosScrollContainer: {
    paddingRight: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  reviewPhoto: {
    width: 120,
    height: 120,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
    backgroundColor: Colors.surface,
  },
});

export default DishDetailScreen;

