import React, { useEffect, useState } from 'react';
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
import { RootStackParamList, DishReview } from '../types';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { formatRelativeTime, formatRating } from '../utils/formatters';
import { getRatingColor } from '../constants/colors';
import { Loading } from '../components';
import { ReviewPhotosGallery } from '../components/ReviewPhotosGallery';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchDishReviews } from '../store/slices/reviewSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'ReviewDetail'>;

const ReviewDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { reviewId, dishId } = route.params;
  const dispatch = useAppDispatch();
  
  const { reviews } = useAppSelector((state) => state.reviews);
  const review = reviews.find((r) => r.id === reviewId);

  useEffect(() => {
    // Загружаем отзывы если их нет или нужный отзыв не найден
    if (!review) {
      dispatch(fetchDishReviews({ dishId, page: 1 }));
    }
  }, [reviewId, dishId, review, dispatch]);

  if (!review) {
    return (
      <View style={styles.container}>
        <Loading text="Загрузка отзыва..." />
      </View>
    );
  }

  const safeRating = review.rating ?? 0;
  const ratingColor = getRatingColor(safeRating);
  const author = review.author;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Отзыв</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Author info */}
      <View style={styles.authorSection}>
        {author?.avatar ? (
          <Image source={{ uri: author.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={32} color={Colors.textLight} />
          </View>
        )}
        
        <View style={styles.authorInfo}>
          <Text style={styles.username}>{author?.username || 'Пользователь'}</Text>
          <View style={styles.metaRow}>
            <View style={styles.trustBadge}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.trust} />
              <Text style={styles.trustScore}>
                {(author?.trustScore ?? 0).toFixed(1)}
              </Text>
            </View>
            <Text style={styles.date}>
              {formatRelativeTime(review.createdAt)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.ratingBadge, { borderColor: ratingColor }]}>
          <Text style={[styles.ratingText, { color: ratingColor }]}>
            {formatRating(safeRating)}
          </Text>
        </View>
      </View>

      {/* Comment */}
      {review.comment && (
        <View style={styles.commentSection}>
          <Text style={styles.commentText}>{review.comment}</Text>
        </View>
      )}

      {/* Food pairing */}
      {review.foodPairing && (
        <View style={styles.pairingSection}>
          <Ionicons name="wine" size={20} color={Colors.secondary} />
          <Text style={styles.pairingText}>
            Рекомендует: {review.foodPairing}
          </Text>
        </View>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>Фотографии</Text>
          <ReviewPhotosGallery
            photos={review.photos}
            reviewId={review.id}
            dishId={review.dishId}
            compact={false}
          />
        </View>
      )}

      {/* Helpful count */}
      <View style={styles.footer}>
        <View style={styles.helpfulSection}>
          <Ionicons name="thumbs-up" size={18} color={Colors.textSecondary} />
          <Text style={styles.helpfulText}>
            Полезно ({review.helpfulCount || 0})
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  headerTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.round,
    marginRight: Theme.spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  username: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
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
    fontSize: Theme.fontSize.sm,
    color: Colors.trust,
    marginLeft: 4,
  },
  date: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  ratingBadge: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
  },
  ratingText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
  },
  commentSection: {
    padding: Theme.spacing.lg,
    backgroundColor: Colors.surface,
  },
  commentText: {
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    lineHeight: 24,
  },
  pairingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Colors.surfaceAlt,
    marginTop: Theme.spacing.xs,
  },
  pairingText: {
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    marginLeft: Theme.spacing.sm,
    fontStyle: 'italic',
  },
  photosSection: {
    padding: Theme.spacing.lg,
    backgroundColor: Colors.surface,
    marginTop: Theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  footer: {
    padding: Theme.spacing.lg,
    backgroundColor: Colors.surface,
    marginTop: Theme.spacing.xs,
  },
  helpfulSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginLeft: Theme.spacing.sm,
  },
});

export default ReviewDetailScreen;

