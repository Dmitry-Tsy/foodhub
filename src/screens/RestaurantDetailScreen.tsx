import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { DishCard, Loading, Button, GuestPrompt } from '../components';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchRestaurantById } from '../store/slices/restaurantSlice';
import { fetchRestaurantMenu } from '../store/slices/dishSlice';
import { formatDistance, formatRating } from '../utils/formatters';
import { exitGuestMode } from '../store/slices/authSlice';
import { toggleRestaurantFavorite } from '../store/slices/favoritesSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'RestaurantDetail'>;

const RestaurantDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const dispatch = useAppDispatch();
  
  const { currentRestaurant, isLoading: restaurantLoading } = useAppSelector(
    (state) => state.restaurants
  );
  const { dishes, isLoading: dishesLoading } = useAppSelector(
    (state) => state.dishes
  );
  const { isGuest, user } = useAppSelector((state) => state.auth);
  const { restaurantIds } = useAppSelector((state) => state.favorites);

  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const scrollY = useState(new Animated.Value(0))[0];
  
  const isFavorite = restaurantIds.includes(restaurantId);

  useEffect(() => {
    console.log('📍 Загрузка ресторана и меню:', restaurantId);
    dispatch(fetchRestaurantById(restaurantId));
    dispatch(fetchRestaurantMenu(restaurantId));
  }, [restaurantId]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });

  const handleDishPress = (dishId: string) => {
    navigation.navigate('DishDetail', { dishId });
  };

  const handleAddDish = () => {
    if (isGuest) {
      setShowGuestPrompt(true);
      return;
    }
    navigation.navigate('AddDish', { restaurantId });
  };

  const handleGuestLogin = () => {
    setShowGuestPrompt(false);
    dispatch(exitGuestMode());
  };

  const handleShare = async () => {
    if (!currentRestaurant) return;
    try {
      await Share.share({
        message: `Посмотри ресторан "${currentRestaurant.name}" в FoodHub! ${currentRestaurant.address}`,
        title: currentRestaurant.name,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCall = () => {
    if (currentRestaurant?.phone) {
      Linking.openURL(`tel:${currentRestaurant.phone}`);
    }
  };

  const handleNavigate = () => {
    if (currentRestaurant) {
      const { latitude, longitude } = currentRestaurant.location;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const toggleFavorite = () => {
    if (isGuest) {
      setShowGuestPrompt(true);
      return;
    }
    dispatch(toggleRestaurantFavorite(restaurantId));
  };

  if (restaurantLoading || !currentRestaurant) {
    return <Loading fullScreen text="Загрузка ресторана..." />;
  }

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <View style={styles.headerGradient}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentRestaurant.name}
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Image with Gradient Overlay */}
        <View style={styles.heroContainer}>
          <Animated.View style={{ transform: [{ scale: imageScale }] }}>
            {currentRestaurant.photos && currentRestaurant.photos.length > 0 ? (
              <Image
                source={{ uri: currentRestaurant.photos[0] }}
                style={styles.heroImage}
              />
            ) : (
              <View style={[styles.heroImage, styles.heroPlaceholder]}>
                <Ionicons name="restaurant" size={80} color={Colors.textLight} />
              </View>
            )}
          </Animated.View>
          
          <View style={styles.heroGradient} />

          {/* Hero Info Overlay */}
          <View style={styles.heroInfo}>
            <View style={styles.heroTopRow}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={Colors.textInverse} />
              </TouchableOpacity>
              <View style={styles.heroActions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                  <Ionicons name="share-social" size={22} color={Colors.textInverse} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
                  <Ionicons 
                    name={isFavorite ? "heart" : "heart-outline"} 
                    size={22} 
                    color={isFavorite ? Colors.error : Colors.textInverse} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.heroBottom}>
              <Text style={styles.heroTitle}>{currentRestaurant.name}</Text>
              {currentRestaurant.averageRating && (
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={18} color={Colors.gold} />
                  <Text style={styles.ratingText}>
                    {formatRating(currentRestaurant.averageRating)}
                  </Text>
                  {currentRestaurant.reviewCount !== undefined && (
                    <Text style={styles.reviewCountText}>
                      ({currentRestaurant.reviewCount})
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleCall}>
              <View style={[styles.quickActionGradient, { backgroundColor: Colors.success }]}>
                <Ionicons name="call" size={24} color={Colors.textInverse} />
                <Text style={styles.quickActionText}>Позвонить</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard} onPress={handleNavigate}>
              <View style={[styles.quickActionGradient, { backgroundColor: Colors.info }]}>
                <Ionicons name="navigate" size={24} color={Colors.textInverse} />
                <Text style={styles.quickActionText}>Маршрут</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard} onPress={handleShare}>
              <View style={[styles.quickActionGradient, { backgroundColor: Colors.accent }]}>
                <Ionicons name="share-social" size={24} color={Colors.textInverse} />
                <Text style={styles.quickActionText}>Поделиться</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>{currentRestaurant.address}</Text>
            </View>
            
            {currentRestaurant.distance && (
              <View style={styles.infoRow}>
                <Ionicons name="walk" size={20} color={Colors.secondary} />
                <Text style={styles.infoText}>
                  {formatDistance(currentRestaurant.distance)}
                </Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Ionicons name="restaurant" size={20} color={Colors.accent} />
              <Text style={styles.infoText}>{currentRestaurant.cuisineType}</Text>
            </View>
            
            {currentRestaurant.phone && (
              <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
                <Ionicons name="call" size={20} color={Colors.success} />
                <Text style={[styles.infoText, { color: Colors.success }]}>
                  {currentRestaurant.phone}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Menu Section */}
          <View style={styles.menuHeader}>
            <View>
              <Text style={styles.sectionTitle}>Меню</Text>
              <Text style={styles.sectionSubtitle}>
                {dishes.length > 0 ? `${dishes.length} блюд` : 'Пока нет блюд'}
              </Text>
            </View>
            
            <TouchableOpacity onPress={handleAddDish}>
              <View style={[styles.addButton, { backgroundColor: Colors.primary }]}>
                <Ionicons name="add" size={24} color={Colors.textInverse} />
                <Text style={styles.addButtonText}>Добавить</Text>
              </View>
            </TouchableOpacity>
          </View>

          <GuestPrompt
            visible={showGuestPrompt}
            onClose={() => setShowGuestPrompt(false)}
            onLogin={handleGuestLogin}
            title="Требуется авторизация"
            message="Чтобы добавлять блюда и использовать другие функции, необходимо войти в систему"
          />

          {dishesLoading ? (
            <Loading text="Загрузка меню..." />
          ) : dishes.length > 0 ? (
            <View style={styles.dishesGrid}>
              {dishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onPress={() => handleDishPress(dish.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyMenu}>
              <View style={styles.emptyGradient}>
                <Ionicons name="fast-food-outline" size={64} color={Colors.textLight} />
                <Text style={styles.emptyTitle}>
                  Меню пока не заполнено
                </Text>
                <Text style={styles.emptySubtext}>
                  {isGuest 
                    ? 'Войдите чтобы добавить первое блюдо в меню'
                    : 'Будьте первым! Добавьте блюда и помогите другим'}
                </Text>
                {!isGuest && (
                  <TouchableOpacity onPress={handleAddDish} style={styles.emptyButton}>
                    <View style={styles.emptyButtonGradient}>
                      <Ionicons name="add-circle" size={20} color={Colors.textInverse} />
                      <Text style={styles.emptyButtonText}>Добавить первое блюдо</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 90,
  },
  headerGradient: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: Theme.spacing.md,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textInverse,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 350,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 350,
  },
  heroPlaceholder: {
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    paddingTop: 40,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glassDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroActions: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glassDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBottom: {
    gap: Theme.spacing.sm,
  },
  heroTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textInverse,
    textShadowColor: Colors.shadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.glassDark,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    alignSelf: 'flex-start',
    gap: 4,
  },
  ratingText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textInverse,
  },
  reviewCountText: {
    fontSize: Theme.fontSize.md,
    color: Colors.textLight,
  },
  content: {
    padding: Theme.spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.lg,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  quickActionGradient: {
    padding: Theme.spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  quickActionText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textInverse,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    gap: Theme.spacing.sm,
    ...Theme.shadows.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Colors.text,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    gap: 4,
  },
  addButtonText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textInverse,
  },
  dishesGrid: {
    gap: Theme.spacing.md,
  },
  emptyMenu: {
    marginTop: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  emptyGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
    paddingHorizontal: Theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
  emptySubtext: {
    fontSize: Theme.fontSize.md,
    color: Colors.textLight,
    marginTop: Theme.spacing.xs,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.round,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  emptyButtonText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textInverse,
  },
});

export default RestaurantDetailScreen;
