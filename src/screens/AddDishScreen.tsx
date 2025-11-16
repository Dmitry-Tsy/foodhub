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
import { getOrCreateRestaurantInDB } from '../services/restaurantService';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDish'>;

const AddDishScreen: React.FC<Props> = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { dishes, isLoading } = useAppSelector((state) => state.dishes);
  const { currentRestaurant } = useAppSelector((state) => state.restaurants);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState<string[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load existing dishes for duplicate checking
    // Сначала конвертируем Google Places ID в UUID если нужно
    const loadMenu = async () => {
      try {
        let dbRestaurantId = restaurantId;
        
        // Если restaurantId похож на Google Places ID (начинается с ChIJ)
        if (restaurantId.startsWith('ChIJ') && currentRestaurant) {
          console.log('🔄 Конвертация Google Places ID в UUID для загрузки меню...');
          dbRestaurantId = await getOrCreateRestaurantInDB(currentRestaurant);
          console.log('✅ Получен UUID из БД для меню:', dbRestaurantId);
        }
        
        dispatch(fetchRestaurantMenu(dbRestaurantId));
      } catch (error: any) {
        console.error('❌ Ошибка конвертации restaurantId для меню:', error);
        // Попробуем загрузить с исходным ID (может быть уже UUID)
        dispatch(fetchRestaurantMenu(restaurantId));
      }
    };
    
    loadMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, currentRestaurant]);

  const checkForDuplicates = useCallback(
    async (dishName: string) => {
      if (dishName.length < 3) {
        setDuplicateWarning('');
        return;
      }

      // Получаем UUID ресторана для проверки уникальности
      let dbRestaurantId = restaurantId;
      try {
        if (restaurantId.startsWith('ChIJ') && currentRestaurant) {
          dbRestaurantId = await getOrCreateRestaurantInDB(currentRestaurant);
        }
      } catch (error) {
        console.error('❌ Ошибка получения UUID для проверки дубликатов:', error);
      }

      // Фильтруем блюда только текущего ресторана для проверки уникальности
      const restaurantDishes = Array.isArray(dishes)
        ? dishes.filter((dish) => dish && dish.restaurantId === dbRestaurantId)
        : [];

      console.log('🔍 Проверка дубликатов:', {
        dishName,
        restaurantId: dbRestaurantId,
        dishesCount: restaurantDishes.length,
      });

      const result = await checkDuplicateDish(dishName, restaurantDishes);
      if (result.isDuplicate) {
        setDuplicateWarning(
          `Похожее блюдо уже есть: "${result.similarDish}" (${result.similarity}% схожести)`
        );
      } else {
        setDuplicateWarning('');
      }
    },
    [dishes, restaurantId, currentRestaurant]
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
      // Сначала получаем/создаем ресторан в БД чтобы получить UUID
      let dbRestaurantId = restaurantId;
      
      // Если restaurantId похож на Google Places ID (начинается с ChIJ)
      if (restaurantId.startsWith('ChIJ') && currentRestaurant) {
        console.log('🔄 Конвертация Google Places ID в UUID...');
        dbRestaurantId = await getOrCreateRestaurantInDB(currentRestaurant);
        console.log('✅ Получен UUID из БД:', dbRestaurantId);
      }

      // Проверяем что dbRestaurantId валидный UUID
      if (!dbRestaurantId || dbRestaurantId.length < 30) {
        throw new Error('Неверный ID ресторана. Попробуйте снова.');
      }

      console.log('➕ Добавление блюда:', {
        name: name.trim(),
        restaurantId: dbRestaurantId,
        price,
      });

      const newDish = await dispatch(
        addDish({
          name: name.trim(),
          description: description.trim() || undefined,
          restaurantId: dbRestaurantId, // Используем UUID из БД
          // addedBy берется из токена на backend автоматически
          price: price ? Number(price) : undefined,
          category: category.trim() || undefined,
          photo: photo[0],
        })
      ).unwrap();

      console.log('✅ Блюдо добавлено:', {
        dishId: newDish.id,
        dishName: newDish.name,
        restaurantId: newDish.restaurantId,
      });

      // Перезагружаем меню ресторана чтобы убедиться что показываются только правильные блюда
      console.log('🔄 Перезагрузка меню ресторана после добавления блюда...');
      await dispatch(fetchRestaurantMenu(dbRestaurantId));

      Alert.alert('Успех', 'Блюдо успешно добавлено!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('❌ Ошибка добавления блюда:', error);
      const errorMessage = error?.response?.data?.error || error?.message || error || 'Не удалось добавить блюдо';
      Alert.alert('Ошибка', errorMessage);
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

