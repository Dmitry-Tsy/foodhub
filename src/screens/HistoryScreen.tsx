import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { DishCard, RestaurantCard, Loading, Button } from '../components';
import { Theme } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store';
import { HistoryItem } from '../store/slices/historySlice';
import { clearHistory, removeFromHistory } from '../store/slices/historySlice';
import { formatRelativeTime } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items: historyItems } = useAppSelector((state) => state.history);
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // История хранится в Redux, так что просто обновляем UI
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Очистить историю',
      'Вы уверены, что хотите очистить всю историю просмотров?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: () => dispatch(clearHistory()),
        },
      ]
    );
  };

  const handleRemoveItem = (item: HistoryItem) => {
    dispatch(removeFromHistory({ type: item.type, id: item.id }));
  };

  const handleItemPress = (item: HistoryItem) => {
    if (item.type === 'dish') {
      navigation.navigate('DishDetail', { dishId: item.id });
    } else {
      navigation.navigate('RestaurantDetail', { restaurantId: item.id });
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    return (
      <TouchableOpacity
        style={[styles.historyItem, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.historyItemContent}>
          {item.type === 'dish' ? (
            <DishCard dish={item.item as any} onPress={() => handleItemPress(item)} />
          ) : (
            <RestaurantCard restaurant={item.item as any} onPress={() => handleItemPress(item)} />
          )}
        </View>
        <View style={styles.historyItemMeta}>
          <Text style={[styles.historyItemTime, { color: colors.textSecondary }]}>
            {formatRelativeTime(item.viewedAt)}
          </Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (historyItems.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color={colors.textLight} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            История просмотров пуста
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Просмотренные блюда и рестораны будут сохранены здесь
          </Text>
        </View>
      </View>
    );
  }

  // Группируем по датам
  const groupedItems: { date: string; items: HistoryItem[] }[] = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  historyItems.forEach((item) => {
    const itemDate = new Date(item.viewedAt);
    let dateLabel = '';

    if (itemDate.toDateString() === today.toDateString()) {
      dateLabel = 'Сегодня';
    } else if (itemDate.toDateString() === yesterday.toDateString()) {
      dateLabel = 'Вчера';
    } else {
      dateLabel = itemDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: itemDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }

    const groupIndex = groupedItems.findIndex((group) => group.date === dateLabel);
    if (groupIndex > -1) {
      groupedItems[groupIndex].items.push(item);
    } else {
      groupedItems.push({ date: dateLabel, items: [item] });
    }
  });

  // Преобразуем в плоский массив для FlatList с заголовками
  const flatData: Array<{ type: 'header' | 'item'; date?: string; item?: HistoryItem }> = [];
  groupedItems.forEach((group) => {
    flatData.push({ type: 'header', date: group.date });
    group.items.forEach((item) => {
      flatData.push({ type: 'item', item });
    });
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>История просмотров</Text>
        {historyItems.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={flatData}
        keyExtractor={(item, index) => `${item.type}-${item.date || item.item?.id || index}`}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
                <Text style={[styles.sectionHeaderText, { color: colors.textSecondary }]}>
                  {item.date}
                </Text>
              </View>
            );
          }
          return renderHistoryItem({ item: item.item! });
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    paddingTop: 50, // Adjust for status bar
  },
  backButton: {
    marginRight: Theme.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
  },
  clearButton: {
    padding: Theme.spacing.xs,
  },
  listContent: {
    padding: Theme.spacing.md,
  },
  sectionHeader: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
  },
  sectionHeaderText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  historyItem: {
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    borderBottomWidth: 1,
    ...Theme.shadows.sm,
  },
  historyItemContent: {
    padding: Theme.spacing.sm,
  },
  historyItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  historyItemTime: {
    fontSize: Theme.fontSize.sm,
  },
  removeButton: {
    padding: Theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: Theme.fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HistoryScreen;

