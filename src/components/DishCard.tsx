import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Dish } from '../types';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { formatRating, formatPrice } from '../utils/formatters';
import { getRatingColor } from '../constants/colors';
import { scaleIn } from '../utils/animations';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleDishFavorite } from '../store/slices/favoritesSlice';

interface DishCardProps {
  dish: Dish;
  onPress: () => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onPress }) => {
  const dispatch = useAppDispatch();
  const { dishIds } = useAppSelector((state) => state.favorites);
  const isFavorite = dishIds.includes(dish.id);

  // Безопасная обработка рейтинга
  const safeRating = dish?.averageRating ?? 0;
  const ratingColor = getRatingColor(safeRating);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Защита от null/undefined dish
  if (!dish) {
    console.warn('⚠️ DishCard: dish is null or undefined');
    return null;
  }

  useEffect(() => {
    scaleIn(scaleAnim, 300).start();
  }, []);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    dispatch(toggleDishFavorite(dish.id));
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: scaleAnim }}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={onPress} 
        activeOpacity={0.85}
      >
        <View style={styles.imageContainer}>
          {dish.photo ? (
            <>
              <Image source={{ uri: dish.photo }} style={styles.image} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={styles.imageGradient}
              />
            </>
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="fast-food" size={40} color={Colors.textLight} />
            </View>
          )}
          
          <View style={styles.overlay}>
            <View style={styles.badgesRow}>
              <LinearGradient
                colors={[ratingColor, ratingColor + 'DD']}
                style={styles.ratingBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="star" size={14} color={Colors.textInverse} />
                <Text style={styles.ratingText}>{formatRating(safeRating)}</Text>
              </LinearGradient>
              
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavoritePress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? Colors.error : Colors.textInverse}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={2}>
              {dish.name}
            </Text>
            {dish.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{dish.category}</Text>
              </View>
            )}
          </View>
          
          {dish.description && (
            <Text style={styles.description} numberOfLines={2}>
              {dish.description}
            </Text>
          )}
          
          {dish.ingredients && dish.ingredients.length > 0 && (
            <View style={styles.ingredientsContainer}>
              {dish.ingredients.slice(0, 3).map((ing, idx) => (
                <View key={idx} style={styles.ingredientTag}>
                  <Text style={styles.ingredientText}>{ing}</Text>
                </View>
              ))}
              {dish.ingredients.length > 3 && (
                <Text style={styles.moreIngredients}>+{dish.ingredients.length - 3}</Text>
              )}
            </View>
          )}
          
          <View style={styles.footer}>
            <View style={styles.reviewContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.reviewCount}>
                {dish.reviewCount} {dish.reviewCount === 1 ? 'отзыв' : 'отзывов'}
              </Text>
            </View>
            
            {dish.price && (
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{formatPrice(dish.price)}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.xl,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.shadows.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  imagePlaceholder: {
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: Theme.spacing.md,
    right: Theme.spacing.md,
    flexDirection: 'row',
    gap: Theme.spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Theme.spacing.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    gap: 4,
    ...Theme.shadows.lg,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  ratingText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textInverse,
  },
  content: {
    padding: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.xs,
    gap: Theme.spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    lineHeight: 24,
  },
  categoryBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  categoryText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.primary,
  },
  description: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
    lineHeight: 20,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
  },
  ingredientTag: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs / 2,
    borderRadius: Theme.borderRadius.sm,
  },
  ingredientText: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
  },
  moreIngredients: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textLight,
    alignSelf: 'center',
    marginLeft: Theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCount: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.fontWeight.medium,
  },
  priceContainer: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  price: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary,
  },
});

