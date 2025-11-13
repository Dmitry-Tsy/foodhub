import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, DietType } from '../types';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { Button, Loading } from '../components';
import {
  POPULAR_CUISINES,
  POPULAR_INGREDIENTS,
  COMMON_ALLERGENS,
  createTasteProfile,
  updateTasteProfile,
  getTasteProfile,
} from '../services/tasteProfileService';

type Props = NativeStackScreenProps<RootStackParamList, 'TasteProfile'>;

const TasteProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Selections
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  const [favoriteIngredients, setFavoriteIngredients] = useState<string[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietType[]>([]);
  const [spicyLevel, setSpicyLevel] = useState<'none' | 'mild' | 'medium' | 'hot' | 'extreme'>('medium');
  
  const userId = 'current-user'; // TODO: Get from auth

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getTasteProfile(userId);
      if (profile) {
        setFavoriteCuisines(profile.favoriteCuisines);
        setFavoriteIngredients(profile.favoriteIngredients);
        setExcludedIngredients(profile.excludedIngredients);
        setDietaryRestrictions(profile.dietaryRestrictions);
        setSpicyLevel(profile.spicyLevel);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const profileData = {
        favoriteCuisines,
        favoriteIngredients,
        excludedIngredients,
        dietaryRestrictions,
        spicyLevel,
        preferredPriceRange: [0, 5000] as [number, number],
        tastePreferences: {
          sweet: 5,
          salty: 5,
          sour: 5,
          bitter: 5,
          umami: 5,
        },
      };

      const existing = await getTasteProfile(userId);
      if (existing) {
        await updateTasteProfile(userId, profileData);
      } else {
        await createTasteProfile(userId, profileData);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSelection = (item: string, list: string[], setter: (items: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Загрузка профиля..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="restaurant" size={48} color={Colors.primary} />
        <Text style={styles.title}>Вкусовой профиль</Text>
        <Text style={styles.subtitle}>
          Расскажите о своих предпочтениях, и мы подберем идеальные блюда!
        </Text>
      </View>

      {/* Любимые кухни */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="globe" size={20} /> Любимые кухни
        </Text>
        <View style={styles.chipsContainer}>
          {POPULAR_CUISINES.map(cuisine => (
            <TouchableOpacity
              key={cuisine}
              style={[
                styles.chip,
                favoriteCuisines.includes(cuisine) && styles.chipSelected,
              ]}
              onPress={() => toggleSelection(cuisine, favoriteCuisines, setFavoriteCuisines)}
            >
              <Text
                style={[
                  styles.chipText,
                  favoriteCuisines.includes(cuisine) && styles.chipTextSelected,
                ]}
              >
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Любимые ингредиенты */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="nutrition" size={20} /> Любимые ингредиенты
        </Text>
        <View style={styles.chipsContainer}>
          {POPULAR_INGREDIENTS.map(ingredient => (
            <TouchableOpacity
              key={ingredient}
              style={[
                styles.chip,
                favoriteIngredients.includes(ingredient) && styles.chipSelected,
              ]}
              onPress={() => toggleSelection(ingredient, favoriteIngredients, setFavoriteIngredients)}
            >
              <Text
                style={[
                  styles.chipText,
                  favoriteIngredients.includes(ingredient) && styles.chipTextSelected,
                ]}
              >
                {ingredient}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Аллергии */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="warning" size={20} color={Colors.error} /> Аллергии и исключения
        </Text>
        <View style={styles.chipsContainer}>
          {COMMON_ALLERGENS.map(allergen => (
            <TouchableOpacity
              key={allergen}
              style={[
                styles.chip,
                styles.chipDanger,
                excludedIngredients.includes(allergen) && styles.chipDangerSelected,
              ]}
              onPress={() => toggleSelection(allergen, excludedIngredients, setExcludedIngredients)}
            >
              <Text
                style={[
                  styles.chipText,
                  excludedIngredients.includes(allergen) && styles.chipTextSelectedDanger,
                ]}
              >
                {allergen}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Уровень остроты */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="flame" size={20} color={Colors.error} /> Уровень остроты
        </Text>
        <View style={styles.spicyLevels}>
          {[
            { value: 'none', label: 'Не острое', icon: '😋' },
            { value: 'mild', label: 'Слабо', icon: '🌶️' },
            { value: 'medium', label: 'Средне', icon: '🌶️🌶️' },
            { value: 'hot', label: 'Остро', icon: '🌶️🌶️🌶️' },
            { value: 'extreme', label: 'Экстрим', icon: '🔥' },
          ].map(level => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.spicyLevel,
                spicyLevel === level.value && styles.spicyLevelSelected,
              ]}
              onPress={() => setSpicyLevel(level.value as any)}
            >
              <Text style={styles.spicyIcon}>{level.icon}</Text>
              <Text style={styles.spicyLabel}>{level.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={saving ? 'Сохранение...' : 'Сохранить профиль'}
          onPress={handleSave}
          disabled={saving}
        />
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
    padding: Theme.spacing.xl,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginTop: Theme.spacing.md,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  section: {
    padding: Theme.spacing.md,
    backgroundColor: Colors.surface,
    marginTop: Theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: `${Colors.primary}20`,
    borderColor: Colors.primary,
  },
  chipDanger: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.border,
  },
  chipDangerSelected: {
    backgroundColor: `${Colors.error}20`,
    borderColor: Colors.error,
  },
  chipText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text,
  },
  chipTextSelected: {
    color: Colors.primary,
    fontWeight: Theme.fontWeight.semibold,
  },
  chipTextSelectedDanger: {
    color: Colors.error,
    fontWeight: Theme.fontWeight.semibold,
  },
  spicyLevels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.spacing.xs,
  },
  spicyLevel: {
    flex: 1,
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  spicyLevelSelected: {
    backgroundColor: `${Colors.error}10`,
    borderColor: Colors.error,
  },
  spicyIcon: {
    fontSize: 24,
    marginBottom: Theme.spacing.xs,
  },
  spicyLabel: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: Theme.spacing.md,
  },
});

export default TasteProfileScreen;

