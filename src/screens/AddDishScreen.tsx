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
import { Button, Input, ImageUploader, CategoryPicker, IngredientInput } from '../components';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { useAppDispatch, useAppSelector } from '../store';
import { addDish, fetchRestaurantMenu, clearMenu } from '../store/slices/dishSlice';
import { checkDuplicateDish } from '../utils/duplicateChecker';
import { getOrCreateRestaurantInDB } from '../services/restaurantService';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDish'>;

const AddDishScreen: React.FC<Props> = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { dishes, isLoading, currentRestaurantId } = useAppSelector((state) => state.dishes);
  const { currentRestaurant } = useAppSelector((state) => state.restaurants);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load existing dishes for duplicate checking
    // Сначала конвертируем Google Places ID в UUID если нужно
    const loadMenu = async () => {
      try {
        // Очищаем меню перед загрузкой нового
        dispatch(clearMenu());
        
        let dbRestaurantId = restaurantId;
        
        // Если restaurantId похож на Google Places ID (начинается с ChIJ)
        if (restaurantId.startsWith('ChIJ') && currentRestaurant) {
          console.log('🔄 Конвертация Google Places ID в UUID для загрузки меню...');
          dbRestaurantId = await getOrCreateRestaurantInDB(currentRestaurant);
          console.log('✅ Получен UUID из БД для меню:', dbRestaurantId);
        }
        
        console.log('📥 Загружаю меню для проверки дубликатов:', dbRestaurantId);
        await dispatch(fetchRestaurantMenu(dbRestaurantId));
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

      // КРИТИЧНО: Используем currentRestaurantId из Redux - это UUID который использовался при загрузке меню
      if (!currentRestaurantId) {
        console.warn('⚠️ checkForDuplicates: currentRestaurantId не установлен, пропускаем проверку');
        // Попробуем получить UUID
        let dbRestaurantId = restaurantId;
        try {
          if (restaurantId.startsWith('ChIJ') && currentRestaurant) {
            dbRestaurantId = await getOrCreateRestaurantInDB(currentRestaurant);
            console.log('✅ Получен UUID для проверки дубликатов:', dbRestaurantId);
          }
        } catch (error) {
          console.error('❌ Ошибка получения UUID для проверки дубликатов:', error);
          return;
        }
        
        // Если меню еще не загружено, загружаем его
        if (!Array.isArray(dishes) || dishes.length === 0) {
          console.log('📥 Загружаю меню для проверки дубликатов...');
          await dispatch(fetchRestaurantMenu(dbRestaurantId));
          // Ждем немного чтобы Redux обновился
          await new Promise(resolve => setTimeout(resolve, 100));
          // Повторно получаем dishes из Redux после обновления
          // Нужно использовать свежие данные - но это сложно в useCallback
          // Поэтому просто пропускаем проверку если меню не загружено
        }
      }

      // Используем currentRestaurantId - это UUID текущего ресторана
      const targetRestaurantId = currentRestaurantId;
      
      if (!targetRestaurantId) {
        console.warn('⚠️ checkForDuplicates: нет targetRestaurantId, пропускаем проверку');
        return;
      }

      // Фильтруем блюда ТОЛЬКО по UUID текущего ресторана
      const restaurantDishes = Array.isArray(dishes)
        ? dishes.filter((dish) => {
            if (!dish || !dish.restaurantId) {
              console.warn('⚠️ Блюдо без restaurantId:', dish);
              return false;
            }
            // Строгое сравнение - только UUID из currentRestaurantId
            const matches = dish.restaurantId === targetRestaurantId;
            
            if (!matches && dish.restaurantId) {
              console.warn('⚠️ Блюдо не принадлежит текущему ресторану:', {
                dishName: dish.name,
                dishRestaurantId: dish.restaurantId,
                targetRestaurantId,
                isGooglePlacesId: dish.restaurantId.startsWith('ChIJ'),
              });
            }
            
            return matches;
          })
        : [];

      console.log('🔍 Проверка дубликатов:', {
        dishName,
        targetRestaurantId,
        currentRestaurantId,
        allDishesCount: Array.isArray(dishes) ? dishes.length : 0,
        restaurantDishesCount: restaurantDishes.length,
        restaurantDishes: restaurantDishes.map(d => ({ name: d.name, restaurantId: d.restaurantId })),
        allDishes: Array.isArray(dishes) ? dishes.map(d => ({ name: d.name, restaurantId: d.restaurantId })) : [],
      });

      if (restaurantDishes.length === 0) {
        console.log('⚠️ Меню пустое или не загружено, пропускаем проверку дубликатов');
        setDuplicateWarning('');
        return;
      }

      const result = await checkDuplicateDish(dishName, restaurantDishes);
      if (result.isDuplicate) {
        setDuplicateWarning(
          `Блюдо "${result.similarDish}" уже есть в меню этого ресторана`
        );
      } else {
        setDuplicateWarning('');
      }
    },
    [dishes, restaurantId, currentRestaurant, currentRestaurantId, dispatch]
  );

  const handleNameChange = (text: string) => {
    setName(text);
    
    // Очищаем предыдущий таймаут
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounce duplicate check - ждем 800ms чтобы дать время загрузиться меню если оно еще не загружено
    debounceTimeoutRef.current = setTimeout(() => {
      // Проверяем что меню загружено или загружаем его
      if (!currentRestaurantId && restaurantId.startsWith('ChIJ') && currentRestaurant) {
        // Меню еще не загружено, загружаем его асинхронно
        (async () => {
          try {
            const dbRestaurantId = await getOrCreateRestaurantInDB(currentRestaurant);
            await dispatch(fetchRestaurantMenu(dbRestaurantId));
            // После загрузки проверяем дубликаты
            setTimeout(() => checkForDuplicates(text), 200);
          } catch (error) {
            console.error('❌ Ошибка загрузки меню для проверки дубликатов:', error);
          }
        })();
      } else {
        checkForDuplicates(text);
      }
    }, 800);
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
          ingredients: ingredients.length > 0 ? ingredients : undefined,
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

        <CategoryPicker
          label="Категория"
          value={category}
          onValueChange={setCategory}
          error={errors.category}
        />

        <IngredientInput
          label="Ингредиенты"
          value={ingredients}
          onChange={setIngredients}
          dishName={name}
          error={errors.ingredients}
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

