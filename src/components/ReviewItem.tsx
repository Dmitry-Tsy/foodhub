import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DishReview, User } from '../types';
import { Theme } from '../constants/theme';
import { formatRelativeTime, formatRating } from '../utils/formatters';
import { getRatingColor } from '../constants/colors';

interface ReviewItemProps {
  review: DishReview;
  author?: User;
  onAuthorPress?: () => void;
  onHelpfulPress?: () => void;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  author,
  onAuthorPress,
  onHelpfulPress,
}) => {
  const ratingColor = getRatingColor(review.rating);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={onAuthorPress}
        disabled={!onAuthorPress}
        activeOpacity={0.7}
      >
        {author?.avatar ? (
          <Image source={{ uri: author.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={24} color={Theme.colors.textLight} />
          </View>
        )}
        
        <View style={styles.authorInfo}>
          <Text style={styles.username}>{author?.username || 'Пользователь'}</Text>
          <View style={styles.metaRow}>
            <View style={styles.trustBadge}>
              <Ionicons name="shield-checkmark" size={12} color={Theme.colors.trust} />
              <Text style={styles.trustScore}>
                {author?.trustScore.toFixed(1) || '0.0'}
              </Text>
            </View>
            <Text style={styles.date}>{formatRelativeTime(review.createdAt)}</Text>
          </View>
        </View>
        
        <View style={[styles.ratingBadge, { borderColor: ratingColor }]}>
          <Text style={[styles.ratingText, { color: ratingColor }]}>
            {formatRating(review.rating)}
          </Text>
        </View>
      </TouchableOpacity>
      
      {review.comment && (
        <Text style={styles.comment}>{review.comment}</Text>
      )}
      
      {review.foodPairing && (
        <View style={styles.pairingContainer}>
          <Ionicons name="wine" size={16} color={Theme.colors.secondary} />
          <Text style={styles.pairingText}>Рекомендует: {review.foodPairing}</Text>
        </View>
      )}
      
      {review.photos && review.photos.length > 0 && (
        <View style={styles.photoContainer}>
          {review.photos.slice(0, 3).map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.photo} />
          ))}
        </View>
      )}
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.helpfulButton}
          onPress={onHelpfulPress}
          activeOpacity={0.7}
        >
          <Ionicons name="thumbs-up-outline" size={16} color={Theme.colors.textSecondary} />
          <Text style={styles.helpfulText}>
            Полезно ({review.helpfulCount || 0})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.round,
  },
  avatarPlaceholder: {
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
  username: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Theme.colors.text,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  trustScore: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.trust,
    marginLeft: 2,
  },
  date: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
  },
  ratingBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
  },
  ratingText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
  },
  comment: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    lineHeight: 20,
    marginBottom: Theme.spacing.sm,
  },
  pairingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
  },
  pairingText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.xs,
    fontStyle: 'italic',
  },
  photoContainer: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.sm,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderLight,
    paddingTop: Theme.spacing.sm,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
});

