import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Restaurant } from '../types';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { formatDistance, formatRating } from '../utils/formatters';
import { scaleIn } from '../utils/animations';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scaleIn(scaleAnim, 300).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: scaleAnim }}>
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.imageWrapper}>
          {restaurant.photos && restaurant.photos.length > 0 ? (
            <>
              <Image source={{ uri: restaurant.photos[0] }} style={styles.image} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.2)']}
                style={styles.imageGradient}
              />
            </>
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="restaurant" size={32} color={Colors.textLight} />
            </View>
          )}
          {restaurant.averageRating && (
            <View style={styles.ratingBadgeOverlay}>
              <LinearGradient
                colors={[Colors.warning, Colors.warning + 'DD']}
                style={styles.ratingBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="star" size={12} color={Colors.textInverse} />
                <Text style={styles.ratingText}>
                  {formatRating(restaurant.averageRating ?? 0)}
                </Text>
              </LinearGradient>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={2}>
              {restaurant.name}
            </Text>
          </View>
          
          {restaurant.cuisineType && (
            <View style={styles.cuisineContainer}>
              <Ionicons name="restaurant-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.cuisine} numberOfLines={1}>
                {restaurant.cuisineType}
              </Text>
            </View>
          )}
          
          <View style={styles.footer}>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color={Colors.primary} />
              <Text style={styles.distance}>
                {restaurant.distance ? formatDistance(restaurant.distance) : 'Неизвестно'}
              </Text>
            </View>
            
            {restaurant.reviewCount !== undefined && (
              <View style={styles.reviewContainer}>
                <Ionicons name="chatbubble-ellipses" size={14} color={Colors.textSecondary} />
                <Text style={styles.reviewCount}>
                  {restaurant.reviewCount}
                </Text>
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
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
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
    height: 40,
  },
  imagePlaceholder: {
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadgeOverlay: {
    position: 'absolute',
    top: Theme.spacing.xs,
    right: Theme.spacing.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs / 2,
    borderRadius: Theme.borderRadius.md,
    gap: 2,
    ...Theme.shadows.sm,
  },
  ratingText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textInverse,
  },
  content: {
    flex: 1,
    marginLeft: Theme.spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: Theme.spacing.xs,
  },
  name: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    lineHeight: 22,
  },
  cuisineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
    gap: 4,
  },
  cuisine: {
    flex: 1,
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Theme.fontWeight.medium,
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCount: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Theme.fontWeight.medium,
  },
});

