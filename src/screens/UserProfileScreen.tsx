import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Button, Loading } from '../components';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchUserProfile,
  followUser,
  unfollowUser,
  rateTrust,
} from '../store/slices/userSlice';
import { formatCount } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'UserProfile'>;

const UserProfileScreen: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const dispatch = useAppDispatch();
  const { currentProfile, isLoading } = useAppSelector((state) => state.users);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [isFollowing, setIsFollowing] = useState(false);
  const [showTrustRating, setShowTrustRating] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile(userId));
  }, [userId]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(userId)).unwrap();
        setIsFollowing(false);
      } else {
        await dispatch(followUser(userId)).unwrap();
        setIsFollowing(true);
      }
    } catch (error: any) {
      Alert.alert('Ошибка', error);
    }
  };

  const handleTrustRate = async (rating: number) => {
    try {
      await dispatch(rateTrust({ userId, rating })).unwrap();
      setShowTrustRating(false);
      Alert.alert('Спасибо!', 'Ваша оценка доверия учтена');
    } catch (error: any) {
      Alert.alert('Ошибка', error);
    }
  };

  if (isLoading || !currentProfile) {
    return <Loading fullScreen text="Загрузка профиля..." />;
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {currentProfile.avatar ? (
          <Image source={{ uri: currentProfile.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={48} color={Colors.textLight} />
          </View>
        )}

        <Text style={styles.username}>{currentProfile.username}</Text>
        {currentProfile.bio && (
          <Text style={styles.bio}>{currentProfile.bio}</Text>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatCount(currentProfile.followersCount)}
            </Text>
            <Text style={styles.statLabel}>Подписчики</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatCount(currentProfile.followingCount)}
            </Text>
            <Text style={styles.statLabel}>Подписки</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.trust }]}>
              {(currentProfile?.trustScore ?? 0).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Доверие</Text>
          </View>
        </View>

        {!isOwnProfile && (
          <View style={styles.actionsContainer}>
            <Button
              title={isFollowing ? 'Отписаться' : 'Подписаться'}
              onPress={handleFollow}
              variant={isFollowing ? 'outline' : 'primary'}
              style={styles.actionButton}
            />
            
            <TouchableOpacity
              style={styles.trustButton}
              onPress={() => setShowTrustRating(!showTrustRating)}
            >
              <Ionicons name="shield-checkmark" size={24} color={Colors.trust} />
            </TouchableOpacity>
          </View>
        )}

        {showTrustRating && (
          <View style={styles.trustRatingContainer}>
            <Text style={styles.trustRatingTitle}>
              Оцените доверие к этому пользователю
            </Text>
            <View style={styles.trustRatingButtons}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={styles.trustRatingButton}
                  onPress={() => handleTrustRate(rating)}
                >
                  <Text style={styles.trustRatingButtonText}>{rating}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Отзывы</Text>
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={48} color={Colors.textLight} />
          <Text style={styles.emptyText}>Отзывов пока нет</Text>
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
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Colors.surface,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.round,
    marginBottom: Theme.spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  bio: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
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
  actionsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: Theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  trustButton: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.trust,
  },
  trustRatingContainer: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginTop: Theme.spacing.md,
  },
  trustRatingTitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  trustRatingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trustRatingButton: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: Colors.trust,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustRatingButtonText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.background,
  },
  contentContainer: {
    padding: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
});

export default UserProfileScreen;

