import React, { useState } from 'react';
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
import { RootStackParamList } from '../types';
import { Button, Input, RatingSlider, ImageUploader } from '../components';
import { Theme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../store';
import { addReview } from '../store/slices/reviewSlice';
import { validateReview } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddReview'>;

const AddReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { dishId, restaurantId } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.reviews);

  const [rating, setRating] = useState(5.0);
  const [comment, setComment] = useState('');
  const [foodPairing, setFoodPairing] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validate
    const validation = validateReview(rating, comment);
    if (!validation.isValid) {
      setError(validation.message || 'Ошибка валидации');
      return;
    }

    setError('');

    try {
      await dispatch(
        addReview({
          dishId,
          authorId: user?.id,
          rating,
          comment: comment.trim() || undefined,
          foodPairing: foodPairing.trim() || undefined,
          photos,
        })
      ).unwrap();

      Alert.alert('Успех', 'Отзыв успешно добавлен!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Ошибка', error || 'Не удалось добавить отзыв');
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Оценка блюда</Text>
          <RatingSlider value={rating} onValueChange={setRating} />
        </View>

        <View style={styles.section}>
          <Input
            label="Комментарий (необязательно)"
            placeholder="Поделитесь своими впечатлениями о блюде..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={styles.commentInput}
          />
        </View>

        <View style={styles.section}>
          <Input
            label="Фудпейринг (необязательно)"
            placeholder="Какой напиток подойдет к этому блюду?"
            value={foodPairing}
            onChangeText={setFoodPairing}
            icon="wine-outline"
          />
        </View>

        <View style={styles.section}>
          <ImageUploader
            maxImages={5}
            images={photos}
            onImagesChange={setPhotos}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Опубликовать отзыв"
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
    backgroundColor: Theme.colors.background,
  },
  content: {
    padding: Theme.spacing.md,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  commentInput: {
    height: 120,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: Theme.fontSize.md,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  submitButton: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
});

export default AddReviewScreen;

