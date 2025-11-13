import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Button, Input, ImageUploader } from '../components';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { useAppDispatch, useAppSelector } from '../store';
import { addDish, fetchRestaurantMenu } from '../store/slices/dishSlice';
import { checkDuplicateDish } from '../utils/duplicateChecker';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDish'>;

const AddDishScreen: React.FC<Props> = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { dishes, isLoading } = useAppSelector((state) => state.dishes);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState<string[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load existing dishes for duplicate checking
    dispatch(fetchRestaurantMenu(restaurantId));
  }, [restaurantId]);

  const checkForDuplicates = useCallback(
    async (dishName: string) => {
      if (dishName.length < 3) {
        setDuplicateWarning('');
        return;
      }

      const result = await checkDuplicateDish(dishName, dishes);
      if (result.isDuplicate) {
        setDuplicateWarning(
          `Похожее блюдо уже есть: "${result.similarDish}" (${result.similarity}% схожести)`
        );
      } else {
        setDuplicateWarning('');
      }
    },
    [dishes]
  );

  const handleNameChange = (text: string) => {
    setName(text);
    // Debounce duplicate check
    const timeoutId = setTimeout(() => {
      checkForDuplicates(text);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Название обязательно';
    }

    if (price && isNaN(Number(price))) {
      newErrors.price = 'Цена должна быть числом';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (duplicateWarning) {
      Alert.alert(
        'Возможно дубликат',
        'Похожее блюдо уже существует. Вы уверены, что хотите добавить новое?',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Добавить', onPress: submitDish },
        ]
      );
    } else {
      submitDish();
    }
  };

  const submitDish = async () => {
    try {
      await dispatch(
        addDish({
          name: name.trim(),
          description: description.trim() || undefined,
          restaurantId,
          addedBy: user?.id,
          price: price ? Number(price) : undefined,
          category: category.trim() || undefined,
          photo: photo[0],
        })
      ).unwrap();

      Alert.alert('Успех', 'Блюдо успешно добавлено!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Ошибка', error || 'Не удалось добавить блюдо');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Название блюда *"
          placeholder="Введите название"
          value={name}
          onChangeText={handleNameChange}
          error={errors.name}
        />

        {duplicateWarning && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={20} color={Colors.warning} />
            <Text style={styles.warningText}>{duplicateWarning}</Text>
          </View>
        )}

        <Input
          label="Описание"
          placeholder="Краткое описание блюда..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={styles.descriptionInput}
        />

        <Input
          label="Цена (₽)"
          placeholder="Введите цену"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          error={errors.price}
        />

        <Input
          label="Категория"
          placeholder="Например: Основные блюда, Десерты"
          value={category}
          onChangeText={setCategory}
        />

        <ImageUploader
          maxImages={1}
          images={photo}
          onImagesChange={setPhoto}
        />

        <Button
          title="Добавить блюдо"
          onPress={handleSubmit}
          loading={isLoading}
          size="large"
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Theme.spacing.md,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}20`,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  warningText: {
    flex: 1,
    fontSize: Theme.fontSize.sm,
    color: Colors.text,
    lineHeight: 18,
  },
  descriptionInput: {
    height: 80,
  },
  submitButton: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
});

export default AddDishScreen;

