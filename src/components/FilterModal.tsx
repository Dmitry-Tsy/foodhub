import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { Button } from './Button';

export type SortOption = 
  | 'rating' 
  | 'price' 
  | 'date' 
  | 'popularity' 
  | 'distance' 
  | 'name';

export type FilterOption = {
  category?: string[];
  rating?: { min: number; max: number };
  price?: { min: number; max: number };
  ingredients?: { include: string[]; exclude: string[] };
};

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOption, sortBy: SortOption, sortOrder: 'asc' | 'desc') => void;
  type: 'dishes' | 'restaurants'; // Тип фильтров
  currentFilters?: FilterOption;
  currentSort?: SortOption;
  currentSortOrder?: 'asc' | 'desc';
}

const DISH_CATEGORIES = [
  'Закуски',
  'Салаты',
  'Супы',
  'Основные блюда',
  'Паста',
  'Пицца',
  'Бургеры',
  'Рыба и морепродукты',
  'Мясо и птица',
  'Вегетарианские',
  'Веганские',
  'Десерты',
  'Напитки',
  'Другое',
];

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'rating', label: 'По рейтингу', icon: 'star' },
  { value: 'price', label: 'По цене', icon: 'cash' },
  { value: 'date', label: 'По дате добавления', icon: 'time' },
  { value: 'popularity', label: 'По популярности', icon: 'flame' },
  { value: 'distance', label: 'По расстоянию', icon: 'location' },
  { value: 'name', label: 'По названию', icon: 'text' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  type,
  currentFilters = {},
  currentSort = 'rating',
  currentSortOrder = 'desc',
}) => {
  const [filters, setFilters] = useState<FilterOption>(currentFilters);
  const [sortBy, setSortBy] = useState<SortOption>(currentSort);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(currentSortOrder);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentFilters.category || []
  );
  const [minRating, setMinRating] = useState<number>(currentFilters.rating?.min || 0);
  const [maxRating, setMaxRating] = useState<number>(currentFilters.rating?.max || 10);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleApply = () => {
    const newFilters: FilterOption = {
      category: selectedCategories.length > 0 ? selectedCategories : undefined,
      rating: minRating > 0 || maxRating < 10 
        ? { min: minRating, max: maxRating }
        : undefined,
    };
    
    setFilters(newFilters);
    onApply(newFilters, sortBy, sortOrder);
    onClose();
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setMinRating(0);
    setMaxRating(10);
    setSortBy('rating');
    setSortOrder('desc');
    onApply({}, 'rating', 'desc');
    onClose();
  };

  const selectedCount = selectedCategories.length + (minRating > 0 || maxRating < 10 ? 1 : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={[Colors.surface, Colors.background]}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text style={styles.title}>
                Фильтры {selectedCount > 0 && `(${selectedCount})`}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {type === 'dishes' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Категории</Text>
                <View style={styles.categoriesGrid}>
                  {DISH_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        selectedCategories.includes(category) && styles.categoryChipSelected,
                      ]}
                      onPress={() => handleCategoryToggle(category)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategories.includes(category) && styles.categoryTextSelected,
                        ]}
                      >
                        {category}
                      </Text>
                      {selectedCategories.includes(category) && (
                        <Ionicons name="checkmark" size={16} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Рейтинг</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingRange}>
                  <Text style={styles.ratingLabel}>От: {minRating.toFixed(1)}</Text>
                  <Text style={styles.ratingLabel}>До: {maxRating.toFixed(1)}</Text>
                </View>
                <Slider
                  style={styles.ratingSlider}
                  minimumValue={0}
                  maximumValue={10}
                  step={0.5}
                  value={maxRating}
                  onValueChange={setMaxRating}
                  minimumTrackTintColor={Colors.primary}
                  maximumTrackTintColor={Colors.border}
                  thumbTintColor={Colors.primary}
                />
                <Slider
                  style={styles.ratingSlider}
                  minimumValue={0}
                  maximumValue={maxRating}
                  step={0.5}
                  value={minRating}
                  onValueChange={setMinRating}
                  minimumTrackTintColor={Colors.secondary}
                  maximumTrackTintColor={Colors.border}
                  thumbTintColor={Colors.secondary}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Сортировка</Text>
              <View style={styles.sortOptions}>
                {SORT_OPTIONS.filter(opt => 
                  type === 'dishes' || opt.value !== 'distance'
                ).map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      sortBy === option.value && styles.sortOptionSelected,
                    ]}
                    onPress={() => setSortBy(option.value)}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={sortBy === option.value ? Colors.primary : Colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.sortOptionText,
                        sortBy === option.value && styles.sortOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {sortBy === option.value && (
                      <TouchableOpacity
                        style={styles.sortOrderButton}
                        onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      >
                        <Ionicons
                          name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                          size={18}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Сбросить"
              onPress={handleReset}
              variant="outline"
              size="medium"
              style={styles.resetButton}
            />
            <Button
              title="Применить"
              onPress={handleApply}
              variant="primary"
              size="medium"
              style={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    maxHeight: '90%',
    ...Theme.shadows.xl,
  },
  header: {
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
  },
  closeButton: {
    padding: Theme.spacing.xs,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Theme.spacing.xs,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.fontWeight.medium,
  },
  categoryTextSelected: {
    color: Colors.primary,
    fontWeight: Theme.fontWeight.semibold,
  },
  ratingContainer: {
    backgroundColor: Colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.sm,
  },
  ratingRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xs,
  },
  ratingLabel: {
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    fontWeight: Theme.fontWeight.medium,
  },
  ratingSlider: {
    width: '100%',
    height: 40,
  },
  sortOptions: {
    gap: Theme.spacing.sm,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Theme.spacing.sm,
  },
  sortOptionSelected: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  sortOptionText: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    fontWeight: Theme.fontWeight.medium,
  },
  sortOptionTextSelected: {
    color: Colors.primary,
    fontWeight: Theme.fontWeight.semibold,
  },
  sortOrderButton: {
    padding: Theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    padding: Theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Theme.spacing.md,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});

