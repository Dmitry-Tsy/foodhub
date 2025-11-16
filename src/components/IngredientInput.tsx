import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { getIngredientSuggestions, getAllIngredients } from '../utils/ingredientSuggestions';

interface IngredientInputProps {
  label?: string;
  value: string[];
  onChange: (ingredients: string[]) => void;
  dishName?: string;
  error?: string;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  label,
  value = [],
  onChange,
  dishName = '',
  error,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  // Получаем умные рекомендации на основе названия блюда
  const smartSuggestions = useMemo(() => {
    if (dishName && dishName.length > 2) {
      return getIngredientSuggestions(dishName);
    }
    return [];
  }, [dishName]);

  // Получаем все доступные ингредиенты для автокомплита
  const allIngredients = useMemo(() => getAllIngredients(), []);

  // Фильтруем ингредиенты для автокомплита
  const filteredIngredients = useMemo(() => {
    if (!inputValue || inputValue.length < 1) {
      return [];
    }
    
    const lowerInput = inputValue.toLowerCase();
    return allIngredients
      .filter(
        (ingredient) =>
          ingredient.toLowerCase().includes(lowerInput) &&
          !value.includes(ingredient)
      )
      .slice(0, 5);
  }, [inputValue, allIngredients, value]);

  const handleAddIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    onChange(value.filter((item) => item !== ingredient));
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setShowSuggestions(text.length > 0);
  };

  const handleInputBlur = () => {
    // Задержка чтобы onClick успел сработать
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleAddSmartSuggestion = () => {
    if (smartSuggestions.length > 0) {
      const newIngredients = smartSuggestions.filter(
        (ing) => !value.includes(ing)
      );
      if (newIngredients.length > 0) {
        onChange([...value, ...newIngredients]);
      }
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Умные рекомендации */}
      {smartSuggestions.length > 0 && (
        <TouchableOpacity
          style={styles.smartSuggestionButton}
          onPress={handleAddSmartSuggestion}
        >
          <Ionicons name="bulb" size={16} color={Colors.warning} />
          <Text style={styles.smartSuggestionText}>
            Добавить рекомендуемые ингредиенты ({smartSuggestions.length})
          </Text>
        </TouchableOpacity>
      )}

      {/* Поле ввода */}
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        <TextInput
          style={styles.input}
          placeholder="Введите ингредиент..."
          placeholderTextColor={Colors.textLight}
          value={inputValue}
          onChangeText={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setShowSuggestions(inputValue.length > 0)}
        />
        {showAllSuggestions ? (
          <TouchableOpacity
            onPress={() => setShowAllSuggestions(false)}
            style={styles.toggleButton}
          >
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setShowAllSuggestions(true)}
            style={styles.toggleButton}
          >
            <Ionicons name="list" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Автокомплит */}
      {showSuggestions && filteredIngredients.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredIngredients}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleAddIngredient(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          />
        </View>
      )}

      {/* Модальное окно со всеми ингредиентами */}
      {showAllSuggestions && (
        <View style={styles.allSuggestionsContainer}>
          <View style={styles.allSuggestionsHeader}>
            <Text style={styles.allSuggestionsTitle}>
              Все доступные ингредиенты
            </Text>
            <TouchableOpacity
              onPress={() => setShowAllSuggestions(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={allIngredients}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.allSuggestionItem,
                  value.includes(item) && styles.allSuggestionItemSelected,
                ]}
                onPress={() => {
                  if (value.includes(item)) {
                    handleRemoveIngredient(item);
                  } else {
                    handleAddIngredient(item);
                  }
                }}
              >
                <Text
                  style={[
                    styles.allSuggestionText,
                    value.includes(item) && styles.allSuggestionTextSelected,
                  ]}
                >
                  {item}
                </Text>
                {value.includes(item) && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            )}
            style={styles.allSuggestionsList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          />
        </View>
      )}

      {/* Добавленные ингредиенты */}
      {value.length > 0 && (
        <View style={styles.tagsContainer}>
          {value.map((ingredient, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{ingredient}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveIngredient(ingredient)}
                style={styles.tagRemove}
              >
                <Ionicons name="close-circle" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
    position: 'relative',
    zIndex: 1,
  },
  label: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  smartSuggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
  smartSuggestionText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.warning,
    fontWeight: Theme.fontWeight.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Theme.spacing.md,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    paddingVertical: Theme.spacing.md,
  },
  toggleButton: {
    padding: Theme.spacing.xs,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Theme.spacing.xs,
    maxHeight: 200,
    zIndex: 10,
    ...Theme.shadows.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  suggestionText: {
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    flex: 1,
  },
  allSuggestionsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Theme.spacing.sm,
    maxHeight: 300,
    ...Theme.shadows.md,
  },
  allSuggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  allSuggestionsTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
  },
  closeButton: {
    padding: Theme.spacing.xs,
  },
  allSuggestionsList: {
    maxHeight: 250,
  },
  allSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  allSuggestionItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  allSuggestionText: {
    fontSize: Theme.fontSize.md,
    color: Colors.text,
  },
  allSuggestionTextSelected: {
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.primary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.xs,
  },
  tagText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.primary,
  },
  tagRemove: {
    padding: 0,
  },
  error: {
    fontSize: Theme.fontSize.sm,
    color: Colors.error,
    marginTop: Theme.spacing.xs,
  },
});

