import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dish } from '../types';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { formatRating, formatPrice } from '../utils/formatters';
import { getRatingColor } from '../constants/colors';

interface DishCardProps {
  dish: Dish;
  onPress: () => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onPress }) => {
  // Безопасная обработка рейтинга
  const safeRating = dish?.averageRating ?? 0;
  const ratingColor = getRatingColor(safeRating);

  // Защита от null/undefined dish
  if (!dish) {
    console.warn('⚠️ DishCard: dish is null or undefined');
    return null;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {dish.photo ? (
        <Image source={{ uri: dish.photo }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="fast-food" size={40} color={Colors.textLight} />
        </View>
      )}
      
      <View style={styles.overlay}>
        <View style={[styles.ratingBadge, { backgroundColor: ratingColor }]}>
          <Text style={styles.ratingText}>{formatRating(dish.averageRating)}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {dish.name}
        </Text>
        
        {dish.description && (
          <Text style={styles.description} numberOfLines={2}>
            {dish.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          <View style={styles.reviewContainer}>
            <Ionicons name="chatbubble-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.reviewCount}>
              {dish.reviewCount} {dish.reviewCount === 1 ? 'отзыв' : 'отзывов'}
            </Text>
          </View>
          
          {dish.price && (
            <Text style={styles.price}>{formatPrice(dish.price)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  image: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: Theme.spacing.md,
    right: Theme.spacing.md,
  },
  ratingBadge: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    ...Theme.shadows.lg,
  },
  ratingText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.background,
  },
  content: {
    padding: Theme.spacing.md,
  },
  name: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  description: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  price: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.primary,
  },
});

