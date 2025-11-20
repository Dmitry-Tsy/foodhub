import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types';
import { DishCard, Loading, Button } from '../components';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchCollectionById,
  deleteCollection,
  removeDishFromCollection,
} from '../store/slices/collectionSlice';
import { formatRelativeTime } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'CollectionDetail'>;

const CollectionDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { collectionId } = route.params;
  const dispatch = useAppDispatch();
  const { currentCollection, isLoading } = useAppSelector((state) => state.collections);
  const { user } = useAppSelector((state) => state.auth);
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  const loadCollection = async () => {
    await dispatch(fetchCollectionById(collectionId));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCollection();
    setRefreshing(false);
  };

  const handleEdit = () => {
    if (currentCollection) {
      navigation.navigate('EditCollection', { collectionId: currentCollection.id });
    }
  };

  const handleDelete = () => {
    if (!currentCollection) return;

    Alert.alert(
      'Удалить коллекцию',
      `Вы уверены, что хотите удалить коллекцию "${currentCollection.name}"? Это действие нельзя отменить.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteCollection(collectionId));
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleRemoveDish = (dishId: string, dishName: string) => {
    Alert.alert(
      'Удалить блюдо',
      `Удалить "${dishName}" из коллекции?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await dispatch(removeDishFromCollection({ collectionId, dishId }));
            // Перезагружаем коллекцию для обновления списка блюд
            await loadCollection();
          },
        },
      ]
    );
  };

  const handleDishPress = (dishId: string) => {
    navigation.navigate('DishDetail', { dishId });
  };

  const isOwner = user?.id === currentCollection?.userId;

  if (isLoading || !currentCollection) {
    return <Loading fullScreen text="Загрузка коллекции..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header Image */}
        <View style={styles.headerImageContainer}>
          {currentCollection.coverPhoto ? (
            <>
              <Image
                source={{ uri: currentCollection.coverPhoto }}
                style={styles.headerImage}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                style={styles.headerGradient}
              />
            </>
          ) : (
            <View
              style={[
                styles.headerImage,
                styles.headerImagePlaceholder,
                { backgroundColor: colors.surfaceAlt },
              ]}
            >
              <Ionicons name="albums" size={64} color={colors.textLight} />
            </View>
          )}

          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.headerButton, { backgroundColor: colors.overlay }]}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.textInverse} />
            </TouchableOpacity>
            {isOwner && (
              <View style={styles.headerRightButtons}>
                <TouchableOpacity
                  onPress={handleEdit}
                  style={[styles.headerButton, { backgroundColor: colors.overlay }]}
                >
                  <Ionicons name="create-outline" size={24} color={Colors.textInverse} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  style={[styles.headerButton, { backgroundColor: colors.error + 'DD' }]}
                >
                  <Ionicons name="trash-outline" size={24} color={Colors.textInverse} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Collection Info Overlay */}
          <View style={styles.headerInfo}>
            <Text style={styles.collectionName}>{currentCollection.name}</Text>
            {currentCollection.description && (
              <Text style={styles.collectionDescription} numberOfLines={2}>
                {currentCollection.description}
              </Text>
            )}
            <View style={styles.headerMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="restaurant" size={16} color={Colors.textInverse} />
                <Text style={styles.metaText}>
                  {currentCollection.dishCount} {currentCollection.dishCount === 1 ? 'блюдо' : 'блюд'}
                </Text>
              </View>
              {currentCollection.user && (
                <View style={styles.metaItem}>
                  <Ionicons name="person" size={16} color={Colors.textInverse} />
                  <Text style={styles.metaText}>{currentCollection.user.username}</Text>
                </View>
              )}
              {!currentCollection.isPublic && (
                <View style={styles.metaItem}>
                  <Ionicons name="lock-closed" size={16} color={Colors.textInverse} />
                  <Text style={styles.metaText}>Приватная</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Dishes List */}
        <View style={styles.content}>
          {currentCollection.dishes && currentCollection.dishes.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Блюда в коллекции</Text>
              </View>
              {currentCollection.dishes.map((dish) => (
                <View key={dish.id} style={styles.dishWrapper}>
                  <DishCard dish={dish} onPress={() => handleDishPress(dish.id)} />
                  {isOwner && (
                    <TouchableOpacity
                      style={[styles.removeDishButton, { backgroundColor: colors.error }]}
                      onPress={() => handleRemoveDish(dish.id, dish.name)}
                    >
                      <Ionicons name="close" size={20} color={Colors.textInverse} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={64} color={colors.textLight} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Коллекция пуста
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                {isOwner
                  ? 'Добавьте блюда в эту коллекцию'
                  : 'В этой коллекции пока нет блюд'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerImageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    zIndex: 1,
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  headerInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Theme.spacing.lg,
  },
  collectionName: {
    fontSize: Theme.fontSize.xxxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textInverse,
    marginBottom: Theme.spacing.xs,
  },
  collectionDescription: {
    fontSize: Theme.fontSize.md,
    color: Colors.textInverse,
    opacity: 0.9,
    marginBottom: Theme.spacing.md,
    lineHeight: 20,
  },
  headerMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textInverse,
    opacity: 0.9,
  },
  content: {
    padding: Theme.spacing.md,
  },
  sectionHeader: {
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
  },
  dishWrapper: {
    position: 'relative',
    marginBottom: Theme.spacing.md,
  },
  removeDishButton: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    ...Theme.shadows.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
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

export default CollectionDetailScreen;

