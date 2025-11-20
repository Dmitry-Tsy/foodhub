import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Collection } from '../types';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchUserCollections, addDishToCollection } from '../store/slices/collectionSlice';

interface AddToCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  dishId: string;
  onSuccess?: () => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  visible,
  onClose,
  dishId,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { collections, isLoading } = useAppSelector((state) => state.collections);
  const { colors } = useTheme();
  const [addingToCollectionId, setAddingToCollectionId] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      dispatch(fetchUserCollections());
    }
  }, [visible, dispatch]);

  const handleAddToCollection = async (collectionId: string) => {
    setAddingToCollectionId(collectionId);
    try {
      await dispatch(addDishToCollection({ collectionId, dishId })).unwrap();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error adding dish to collection:', error);
      // Alert можно показать через родительский компонент
    } finally {
      setAddingToCollectionId(null);
    }
  };

  const renderCollection = ({ item }: { item: Collection }) => {
    const isAdding = addingToCollectionId === item.id;

    return (
      <TouchableOpacity
        style={[styles.collectionItem, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}
        onPress={() => handleAddToCollection(item.id)}
        disabled={isAdding}
        activeOpacity={0.7}
      >
        <View style={styles.collectionItemContent}>
          {item.coverPhoto ? (
            <Image source={{ uri: item.coverPhoto }} style={styles.collectionImage} />
          ) : (
            <View style={[styles.collectionImage, styles.collectionImagePlaceholder, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name="albums" size={24} color={colors.textLight} />
            </View>
          )}
          <View style={styles.collectionInfo}>
            <Text style={[styles.collectionName, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.collectionMeta, { color: colors.textSecondary }]}>
              {item.dishCount} {item.dishCount === 1 ? 'блюдо' : 'блюд'}
              {!item.isPublic && ' • Приватная'}
            </Text>
          </View>
        </View>
        {isAdding ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <LinearGradient
            colors={['#FF6B35', '#FF8F6B', '#FFB020']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Text style={styles.headerTitle}>Добавить в коллекцию</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={Colors.textInverse} />
            </TouchableOpacity>
          </LinearGradient>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Загрузка коллекций...
              </Text>
            </View>
          ) : collections.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="albums-outline" size={64} color={colors.textLight} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                У вас нет коллекций
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Создайте коллекцию, чтобы добавлять в неё блюда
              </Text>
            </View>
          ) : (
            <FlatList
              data={collections}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderCollection({ item })}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    maxHeight: '80%',
    ...Theme.shadows.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
  },
  headerTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textInverse,
  },
  closeButton: {
    padding: Theme.spacing.xs,
  },
  loadingContainer: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
  },
  emptyContainer: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
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
  listContent: {
    padding: Theme.spacing.md,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.sm,
    borderBottomWidth: 1,
    ...Theme.shadows.sm,
  },
  collectionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  collectionImage: {
    width: 50,
    height: 50,
    borderRadius: Theme.borderRadius.md,
  },
  collectionImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    marginBottom: 2,
  },
  collectionMeta: {
    fontSize: Theme.fontSize.sm,
  },
});

