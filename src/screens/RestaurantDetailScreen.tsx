import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { DishCard, Loading, Button } from '../components';
import { Theme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchRestaurantById } from '../store/slices/restaurantSlice';
import { fetchRestaurantMenu } from '../store/slices/dishSlice';
import { formatDistance, formatRating } from '../utils/formatters';

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

  useEffect(() => {
    dispatch(fetchRestaurantById(restaurantId));
    dispatch(fetchRestaurantMenu(restaurantId));
  }, [restaurantId]);

  const handleDishPress = (dishId: string) => {
    navigation.navigate('DishDetail', { dishId });
  };

  const handleAddDish = () => {
    navigation.navigate('AddDish', { restaurantId });
  };

  if (restaurantLoading || !currentRestaurant) {
    return <Loading fullScreen text="Загрузка ресторана..." />;
  }

  return (
    <ScrollView style={styles.container}>
      {currentRestaurant.photos && currentRestaurant.photos.length > 0 ? (
        <Image
          source={{ uri: currentRestaurant.photos[0] }}
          style={styles.headerImage}
        />
      ) : (
        <View style={[styles.headerImage, styles.headerImagePlaceholder]}>
          <Ionicons name="restaurant" size={64} color={Theme.colors.textLight} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{currentRestaurant.name}</Text>
          
          {currentRestaurant.averageRating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color={Theme.colors.warning} />
              <Text style={styles.rating}>
                {formatRating(currentRestaurant.averageRating)}
              </Text>
              {currentRestaurant.reviewCount !== undefined && (
                <Text style={styles.reviewCount}>
                  ({currentRestaurant.reviewCount})
                </Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color={Theme.colors.textSecondary} />
            <Text style={styles.infoText}>{currentRestaurant.address}</Text>
          </View>
          
          {currentRestaurant.distance && (
            <View style={styles.infoRow}>
              <Ionicons name="walk" size={16} color={Theme.colors.textSecondary} />
              <Text style={styles.infoText}>
                {formatDistance(currentRestaurant.distance)}
              </Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Ionicons name="restaurant" size={16} color={Theme.colors.textSecondary} />
            <Text style={styles.infoText}>{currentRestaurant.cuisineType}</Text>
          </View>
          
          {currentRestaurant.phone && (
            <TouchableOpacity style={styles.infoRow}>
              <Ionicons name="call" size={16} color={Theme.colors.primary} />
              <Text style={[styles.infoText, { color: Theme.colors.primary }]}>
                {currentRestaurant.phone}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Меню</Text>
          <Button
            title="Добавить блюдо"
            onPress={handleAddDish}
            size="small"
            variant="outline"
          />
        </View>

        {dishesLoading ? (
          <Loading text="Загрузка меню..." />
        ) : dishes.length > 0 ? (
          dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onPress={() => handleDishPress(dish.id)}
            />
          ))
        ) : (
          <View style={styles.emptyMenu}>
            <Ionicons name="fast-food-outline" size={48} color={Theme.colors.textLight} />
            <Text style={styles.emptyText}>
              Меню пока пусто
            </Text>
            <Text style={styles.emptySubtext}>
              Будьте первым, кто добавит блюдо!
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
    height: 250,
  },
  headerImagePlaceholder: {
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Theme.spacing.md,
  },
  header: {
    marginBottom: Theme.spacing.md,
  },
  name: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Theme.colors.text,
  },
  reviewCount: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
  },
  infoContainer: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  menuTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.text,
  },
  emptyMenu: {
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

export default RestaurantDetailScreen;

