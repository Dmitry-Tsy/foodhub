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
import { fetchRestaurantMenu, clearMenu } from '../store/slices/dishSlice';
import { formatDistance, formatRating } from '../utils/formatters';
import { exitGuestMode } from '../store/slices/authSlice';
import { toggleRestaurantFavorite } from '../store/slices/favoritesSlice';
import { getOrCreateRestaurantInDB } from '../services/restaurantService';

type Props = NativeStackScreenProps<RootStackParamList, 'RestaurantDetail'>;

const RestaurantDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  console.log('📍 RestaurantDetailScreen: 1. Компонент начал рендериться');
  
  const { restaurantId } = route.params;
  console.log('📍 RestaurantDetailScreen: 2. restaurantId:', restaurantId);
  
  const dispatch = useAppDispatch();
  console.log('📍 RestaurantDetailScreen: 3. dispatch получен');
  
  const { currentRestaurant, isLoading: restaurantLoading } = useAppSelector(
    (state) => state.restaurants
  );
  console.log('📍 RestaurantDetailScreen: 4. restaurants state получен', {
    hasRestaurant: !!currentRestaurant,
    isLoading: restaurantLoading,
    restaurantName: currentRestaurant?.name,
  });
  
  const { dishes, isLoading: dishesLoading } = useAppSelector(
    (state) => state.dishes
  );
  console.log('📍 RestaurantDetailScreen: 5. dishes state получен', {
    dishesCount: Array.isArray(dishes) ? dishes.length : 0,
    isLoading: dishesLoading,
  });
  
  const { isGuest, user } = useAppSelector((state) => state.auth);
  const { restaurantIds } = useAppSelector((state) => state.favorites);

  console.log('📍 RestaurantDetailScreen: 6. auth и favorites получены', {
    isGuest,
    hasUser: !!user,
  });

  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const scrollY = useState(new Animated.Value(0))[0];
  
  const isFavorite = restaurantIds.includes(restaurantId);
  
  console.log('📍 RestaurantDetailScreen: 7. State инициализирован');

  useEffect(() => {
    console.log('📍 RestaurantDetailScreen: 8. useEffect - монтирование компонента');
    
    // Очищаем меню предыдущего ресторана при переходе к новому
    dispatch(clearMenu());
    
    // Загружаем ресторан по Google Places ID (для отображения)
    try {
      console.log('📍 RestaurantDetailScreen: 9. Вызываю fetchRestaurantById...');
      dispatch(fetchRestaurantById(restaurantId));
      console.log('📍 RestaurantDetailScreen: 10. fetchRestaurantById вызван');
    } catch (error: any) {
      console.error('❌ RestaurantDetailScreen: Ошибка при вызове fetchRestaurantById:', error);
    }
    
    // Загружаем меню - нужно конвертировать Google Places ID в UUID для запроса к БД
    const loadMenu = async () => {
      console.log('📍 RestaurantDetailScreen: 11. Начинаю загрузку меню...');
      
      try {
        let dbRestaurantId = restaurantId;
        
        // Если restaurantId похож на Google Places ID (начинается с ChIJ)
        if (restaurantId.startsWith('ChIJ')) {
          console.log('📍 RestaurantDetailScreen: 12. Конвертация Google Places ID в UUID...');
          
          // Сначала загружаем ресторан если его нет
          let restaurant = currentRestaurant;
          if (!restaurant) {
            console.log('📍 RestaurantDetailScreen: 13. Ресторана нет в state, загружаем...');
            try {
              restaurant = await dispatch(fetchRestaurantById(restaurantId)).unwrap();
              console.log('📍 RestaurantDetailScreen: 14. Ресторан загружен для конвертации:', restaurant?.name);
            } catch (err: any) {
              console.error('❌ RestaurantDetailScreen: Ошибка загрузки ресторана для конвертации:', err);
              // Пропускаем конвертацию, попробуем загрузить меню с исходным ID
              console.log('📍 RestaurantDetailScreen: 15. Загружаю меню с исходным ID (ошибка конвертации)');
              dispatch(fetchRestaurantMenu(restaurantId));
              return;
            }
          } else {
            console.log('📍 RestaurantDetailScreen: 14. Ресторан уже в state:', restaurant.name);
          }
          
          if (restaurant) {
            try {
              console.log('📍 RestaurantDetailScreen: 15. Вызываю getOrCreateRestaurantInDB...');
              dbRestaurantId = await getOrCreateRestaurantInDB(restaurant);
              console.log('📍 RestaurantDetailScreen: 16. Получен UUID из БД для меню:', dbRestaurantId);
            } catch (err: any) {
              console.error('❌ RestaurantDetailScreen: Ошибка конвертации в UUID:', err);
              // Пропускаем конвертацию, попробуем загрузить меню с исходным ID
              console.log('📍 RestaurantDetailScreen: 17. Загружаю меню с исходным ID (ошибка UUID)');
              dispatch(fetchRestaurantMenu(restaurantId));
              return;
            }
          }
        } else {
          console.log('📍 RestaurantDetailScreen: 12. restaurantId не похож на Google Places ID, используем как есть');
        }
        
        console.log('📍 RestaurantDetailScreen: 17. Загружаю меню с ID:', dbRestaurantId);
        dispatch(fetchRestaurantMenu(dbRestaurantId));
        console.log('📍 RestaurantDetailScreen: 18. fetchRestaurantMenu вызван');
      } catch (error: any) {
        console.error('❌ RestaurantDetailScreen: Критическая ошибка в loadMenu:', error);
        // Попробуем загрузить с исходным ID (может быть уже UUID)
        try {
          console.log('📍 RestaurantDetailScreen: 19. Fallback - загружаю меню с исходным ID');
          dispatch(fetchRestaurantMenu(restaurantId));
        } catch (err: any) {
          console.error('❌ RestaurantDetailScreen: Не удалось загрузить меню:', err);
        }
      }
    };
    
    loadMenu();
    
    return () => {
      console.log('📍 RestaurantDetailScreen: useEffect cleanup - размонтирование');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Дополнительный useEffect для повторной загрузки если ресторан не найден
  useEffect(() => {
    if (!restaurantLoading && !currentRestaurant) {
      console.warn('⚠️ RestaurantDetailScreen: currentRestaurant is null, загружаем повторно...');
      dispatch(fetchRestaurantById(restaurantId));
    }
  }, [restaurantId, currentRestaurant, restaurantLoading, dispatch]);

  console.log('📍 RestaurantDetailScreen: 19. Проверка условий рендера', {
    restaurantLoading,
    hasCurrentRestaurant: !!currentRestaurant,
  });

  // Защита от крашей: показываем loading если загружается или нет данных
  if (restaurantLoading || !currentRestaurant) {
    console.log('📍 RestaurantDetailScreen: 20. Показываю loading экран');
    return <Loading fullScreen text="Загрузка ресторана..." />;
  }
  
  console.log('📍 RestaurantDetailScreen: 21. Начинаю рендер основного контента');
  
  // Вспомогательные функции для рендера (разбиение для безопасности)
  const renderHeader = () => {
    try {
      console.log('📍 RestaurantDetailScreen: 22. Рендер header');
      return (
        <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
          <View style={styles.headerGradient}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {currentRestaurant?.name || 'Ресторан'}
            </Text>
          </View>
        </Animated.View>
      );
    } catch (e: any) {
      console.error('❌ RestaurantDetailScreen: Ошибка renderHeader:', e);
      return null;
    }
  };

  const renderHero = () => {
    try {
      console.log('📍 RestaurantDetailScreen: 23. Рендер hero секции');
      return (
        <View style={styles.heroContainer}>
          <Animated.View style={{ transform: [{ scale: imageScale }] }}>
            {currentRestaurant?.photos && currentRestaurant.photos.length > 0 ? (
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
              <Text style={styles.heroTitle}>{currentRestaurant?.name || 'Ресторан'}</Text>
              {currentRestaurant?.averageRating && (
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={18} color={Colors.gold} />
                  <Text style={styles.ratingText}>
                    {formatRating(currentRestaurant.averageRating ?? 0)}
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
      );
    } catch (e: any) {
      console.error('❌ RestaurantDetailScreen: Ошибка renderHero:', e);
      return (
        <View style={styles.heroContainer}>
          <View style={[styles.heroImage, styles.heroPlaceholder]}>
            <Ionicons name="restaurant" size={80} color={Colors.textLight} />
          </View>
        </View>
      );
    }
  };

  const renderQuickActions = () => {
    try {
      console.log('📍 RestaurantDetailScreen: 24. Рендер quick actions');
      return (
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
      );
    } catch (e: any) {
      console.error('❌ RestaurantDetailScreen: Ошибка renderQuickActions:', e);
      return null;
    }
  };

  const renderInfoCard = () => {
    try {
      console.log('📍 RestaurantDetailScreen: 25. Рендер info card');
      if (!currentRestaurant) return null;
      
      return (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{currentRestaurant.address || 'Адрес не указан'}</Text>
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
            <Text style={styles.infoText}>{currentRestaurant.cuisineType || 'Не указано'}</Text>
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
      );
    } catch (e: any) {
      console.error('❌ RestaurantDetailScreen: Ошибка renderInfoCard:', e);
      return null;
    }
  };

  const renderMenu = () => {
    try {
      console.log('📍 RestaurantDetailScreen: 26. Рендер меню', {
        dishesCount: Array.isArray(dishes) ? dishes.length : 0,
        dishesLoading,
      });
      
      // Фильтруем блюда - показываем только те, что принадлежат текущему ресторану
      // Безопасная фильтрация: сначала фильтруем null/undefined
      const safeDishes = Array.isArray(dishes) 
        ? dishes.filter(d => {
            if (!d || !d.restaurantId) return false;
            // Фильтруем по restaurantId блюда
            // Если это Google Places ID, нужно сравнивать с UUID из БД
            // Но обычно backend уже фильтрует правильно, так что дополнительная проверка на всякий случай
            return d.restaurantId && d.restaurantId.length > 0;
          })
        : [];
      
      console.log('📍 RestaurantDetailScreen: 27. Отфильтровано блюд:', safeDishes.length);
      
      return (
        <>
          <View style={styles.menuHeader}>
            <View>
              <Text style={styles.sectionTitle}>Меню</Text>
              <Text style={styles.sectionSubtitle}>
                {safeDishes.length > 0 ? `${safeDishes.length} блюд` : 'Пока нет блюд'}
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
          ) : safeDishes.length > 0 ? (
            <View style={styles.dishesGrid}>
              {safeDishes.map((dish) => (
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
        </>
      );
    } catch (e: any) {
      console.error('❌ RestaurantDetailScreen: Ошибка renderMenu:', e);
      return (
        <View style={styles.emptyMenu}>
          <Text style={styles.emptyTitle}>Ошибка загрузки меню</Text>
        </View>
      );
    }
  };
  
  // Безопасный рендер с глобальной защитой
  try {
    console.log('📍 RestaurantDetailScreen: 27. Начинаю основной рендер JSX');
    
    return (
      <View style={styles.container}>
        {(() => {
          try {
            return renderHeader();
          } catch (e: any) {
            console.error('❌ RestaurantDetailScreen: Ошибка renderHeader в JSX:', e);
            return null;
          }
        })()}

        <ScrollView
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {(() => {
            try {
              return renderHero();
            } catch (e: any) {
              console.error('❌ RestaurantDetailScreen: Ошибка renderHero в JSX:', e);
              return (
                <View style={styles.heroContainer}>
                  <View style={[styles.heroImage, styles.heroPlaceholder]}>
                    <Ionicons name="restaurant" size={80} color={Colors.textLight} />
                  </View>
                </View>
              );
            }
          })()}

          <View style={styles.content}>
            {(() => {
              try {
                return renderQuickActions();
              } catch (e: any) {
                console.error('❌ RestaurantDetailScreen: Ошибка renderQuickActions в JSX:', e);
                return null;
              }
            })()}

            {(() => {
              try {
                return renderInfoCard();
              } catch (e: any) {
                console.error('❌ RestaurantDetailScreen: Ошибка renderInfoCard в JSX:', e);
                return null;
              }
            })()}

            {(() => {
              try {
                return renderMenu();
              } catch (e: any) {
                console.error('❌ RestaurantDetailScreen: Ошибка renderMenu в JSX:', e);
                return (
                  <View style={styles.emptyMenu}>
                    <Text style={styles.emptyTitle}>Ошибка загрузки меню</Text>
                  </View>
                );
              }
            })()}
          </View>
        </ScrollView>
      </View>
    );
  } catch (error: any) {
    console.error('❌ КРИТИЧЕСКАЯ ошибка рендера RestaurantDetailScreen:', error);
    // Возвращаем минимальный UI чтобы не крашилось
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="alert-circle" size={64} color={Colors.error} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, color: Colors.text }}>
            Ошибка загрузки ресторана
          </Text>
          <Text style={{ fontSize: 14, marginTop: 8, color: Colors.textSecondary, textAlign: 'center' }}>
            {error?.message || 'Неизвестная ошибка'}
          </Text>
          <TouchableOpacity
            style={{ marginTop: 20, padding: 12, backgroundColor: Colors.primary, borderRadius: 8 }}
            onPress={() => {
              dispatch(fetchRestaurantById(restaurantId));
            }}
          >
            <Text style={{ color: Colors.textInverse, fontWeight: 'bold' }}>Попробовать снова</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
