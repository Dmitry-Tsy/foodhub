import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Button, Input, ImageUploader } from '../components';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchCollectionById, updateCollection } from '../store/slices/collectionSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'EditCollection'>;

const EditCollectionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { collectionId } = route.params;
  const dispatch = useAppDispatch();
  const { currentCollection, isLoading } = useAppSelector((state) => state.collections);
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [coverPhoto, setCoverPhoto] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  useEffect(() => {
    if (currentCollection) {
      setName(currentCollection.name);
      setDescription(currentCollection.description || '');
      setIsPublic(currentCollection.isPublic);
      setCoverPhoto(currentCollection.coverPhoto ? [currentCollection.coverPhoto] : []);
    }
  }, [currentCollection]);

  const loadCollection = async () => {
    await dispatch(fetchCollectionById(collectionId));
  };

  const validate = () => {
    const newErrors: { name?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Название обязательно';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Название должно содержать минимум 2 символа';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Название слишком длинное (максимум 100 символов)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        updateCollection({
          collectionId,
          data: {
            name: name.trim(),
            description: description.trim() || undefined,
            isPublic,
            coverPhoto: coverPhoto[0] || undefined,
          },
        })
      ).unwrap();

      Alert.alert('Успешно', 'Коллекция обновлена!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось обновить коллекцию');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !currentCollection) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Редактировать коллекцию</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>
            Обложка коллекции
          </Text>
          <ImageUploader
            images={coverPhoto}
            onImagesChange={setCoverPhoto}
            maxImages={1}
            aspectRatio={16 / 9}
          />
        </View>

        <View style={styles.section}>
          <Input
            label="Название коллекции *"
            placeholder="Например: Мои любимые десерты"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors({ ...errors, name: undefined });
              }
            }}
            error={errors.name}
          />
        </View>

        <View style={styles.section}>
          <Input
            label="Описание"
            placeholder="Расскажите о коллекции (необязательно)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.section, styles.publicSection, { backgroundColor: colors.surface }]}>
          <View style={styles.publicSectionContent}>
            <View style={styles.publicSectionLeft}>
              <Ionicons
                name={isPublic ? 'globe-outline' : 'lock-closed-outline'}
                size={24}
                color={colors.primary}
              />
              <View style={styles.publicSectionText}>
                <Text style={[styles.publicSectionTitle, { color: colors.text }]}>
                  Публичная коллекция
                </Text>
                <Text style={[styles.publicSectionSubtitle, { color: colors.textSecondary }]}>
                  {isPublic
                    ? 'Другие пользователи смогут видеть эту коллекцию'
                    : 'Только вы можете видеть эту коллекцию'}
                </Text>
              </View>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Colors.textInverse}
            />
          </View>
        </View>

        <Button
          title={isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          onPress={handleSubmit}
          loading={isSubmitting}
          style={styles.submitButton}
        />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Theme.spacing.md,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  label: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    marginBottom: Theme.spacing.sm,
  },
  publicSection: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  publicSectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  publicSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  publicSectionText: {
    flex: 1,
  },
  publicSectionTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    marginBottom: 2,
  },
  publicSectionSubtitle: {
    fontSize: Theme.fontSize.sm,
    lineHeight: 18,
  },
  submitButton: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Theme.spacing.xl,
    fontSize: Theme.fontSize.md,
  },
});

export default EditCollectionScreen;

