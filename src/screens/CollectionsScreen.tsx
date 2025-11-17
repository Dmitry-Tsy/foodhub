import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { CollectionCard, Loading } from '../components';
import { Theme } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchUserCollections } from '../store/slices/collectionSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Collections'>;

const CollectionsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { collections, isLoading } = useAppSelector((state) => state.collections);
  const { user } = useAppSelector((state) => state.auth);
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    await dispatch(fetchUserCollections());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCollections();
    setRefreshing(false);
  };

  const handleCollectionPress = (collectionId: string) => {
    navigation.navigate('CollectionDetail', { collectionId });
  };

  const handleCreateCollection = () => {
    navigation.navigate('CreateCollection');
  };

  if (isLoading && collections.length === 0) {
    return <Loading fullScreen text="Загрузка коллекций..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Мои коллекции</Text>
        <TouchableOpacity onPress={handleCreateCollection} style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {collections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="albums-outline" size={64} color={colors.textLight} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            У вас пока нет коллекций
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Создайте первую коллекцию и добавляйте в неё любимые блюда
          </Text>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={handleCreateCollection}
          >
            <Ionicons name="add-circle" size={20} color={Colors.textInverse} />
            <Text style={styles.createButtonText}>Создать коллекцию</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CollectionCard
              collection={item}
              onPress={() => handleCollectionPress(item.id)}
            />
          )}
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
      )}
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
    paddingTop: 50,
  },
  backButton: {
    marginRight: Theme.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
  },
  addButton: {
    padding: Theme.spacing.xs,
  },
  listContent: {
    padding: Theme.spacing.md,
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
    marginBottom: Theme.spacing.xl,
    lineHeight: 22,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.sm,
    ...Theme.shadows.md,
  },
  createButtonText: {
    color: Colors.textInverse,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
  },
});

export default CollectionsScreen;

