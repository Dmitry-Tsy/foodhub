import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant } from '../types';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { formatDistance, formatRating } from '../utils/formatters';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {restaurant.photos && restaurant.photos.length > 0 ? (
        <Image source={{ uri: restaurant.photos[0] }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="restaurant" size={40} color={Colors.textLight} />
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          {restaurant.averageRating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={Colors.warning} />
              <Text style={styles.ratingText}>
                {formatRating(restaurant.averageRating ?? 0)}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.cuisine} numberOfLines={1}>
          {restaurant.cuisineType}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.distance}>
              {restaurant.distance ? formatDistance(restaurant.distance) : 'Неизвестно'}
            </Text>
          </View>
          
          {restaurant.reviewCount !== undefined && (
            <Text style={styles.reviewCount}>
              {restaurant.reviewCount} отзывов
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Theme.borderRadius.md,
  },
  imagePlaceholder: {
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: Theme.spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginRight: Theme.spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  ratingText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginLeft: 4,
  },
  cuisine: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginVertical: Theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
});

