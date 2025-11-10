import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, RootStackParamList, FeedItem } from '../../types';
import { ReviewItem, Loading } from '../../components';
import { Theme } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchFeed, refreshFeed } from '../../store/slices/feedSlice';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Feed'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: NavigationProp;
}

const FeedScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, isLoading, isRefreshing, hasMore, page } = useAppSelector(
    (state) => state.feed
  );

  useEffect(() => {
    dispatch(fetchFeed({ page: 1 }));
  }, []);

  const handleRefresh = () => {
    dispatch(refreshFeed());
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      dispatch(fetchFeed({ page: page + 1 }));
    }
  };

  const handleAuthorPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handleDishPress = (dishId: string) => {
    navigation.navigate('DishDetail', { dishId });
  };

  const renderFeedItem = ({ item }: { item: FeedItem }) => {
    if (item.type === 'review' && item.review) {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => item.review?.dishId && handleDishPress(item.review.dishId)}
        >
          <ReviewItem
            review={item.review}
            author={item.user}
            onAuthorPress={() => item.user?.id && handleAuthorPress(item.user.id)}
          />
        </TouchableOpacity>
      );
    }

    if (item.type === 'dish_added' && item.dish) {
      return (
        <View style={styles.feedCard}>
          <View style={styles.feedHeader}>
            <Ionicons name="restaurant" size={24} color={Theme.colors.primary} />
            <Text style={styles.feedText}>
              <Text style={styles.feedUsername}>{item.user?.username}</Text>
              {' добавил(а) новое блюдо '}
              <Text style={styles.feedDishName}>{item.dish.name}</Text>
            </Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {isLoading && !isRefreshing && items.length === 0 ? (
        <Loading text="Загрузка ленты..." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderFeedItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[Theme.colors.primary]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="newspaper-outline" size={64} color={Theme.colors.textLight} />
              <Text style={styles.emptyText}>
                Лента пуста
              </Text>
              <Text style={styles.emptySubtext}>
                Подпишитесь на пользователей, чтобы видеть их отзывы
              </Text>
            </View>
          }
          ListFooterComponent={
            isLoading && items.length > 0 ? (
              <Loading text="Загрузка..." />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  listContent: {
    padding: Theme.spacing.md,
  },
  feedCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  feedText: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    lineHeight: 20,
  },
  feedUsername: {
    fontWeight: Theme.fontWeight.semibold,
    color: Theme.colors.primary,
  },
  feedDishName: {
    fontWeight: Theme.fontWeight.semibold,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
    textAlign: 'center',
  },
});

export default FeedScreen;

