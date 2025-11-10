import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import * as imageService from '../services/imageService';

interface ImageUploaderProps {
  maxImages?: number;
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  maxImages = 5,
  images,
  onImagesChange,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAddImage = () => {
    Alert.alert(
      'Добавить фото',
      'Выберите источник',
      [
        {
          text: 'Камера',
          onPress: handleTakePhoto,
        },
        {
          text: 'Галерея',
          onPress: handlePickFromGallery,
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
      ]
    );
  };

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      const photoUri = await imageService.takePhoto();
      if (photoUri) {
        const uploadedUrl = await imageService.uploadImage(photoUri);
        onImagesChange([...images, uploadedUrl]);
      }
    } catch (error: any) {
      Alert.alert('Ошибка', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      setLoading(true);
      const remaining = maxImages - images.length;
      const photoUris = await imageService.pickMultipleImages(remaining);
      if (photoUris.length > 0) {
        const uploadedUrls = await imageService.uploadMultipleImages(photoUris);
        onImagesChange([...images, ...uploadedUrls]);
      }
    } catch (error: any) {
      Alert.alert('Ошибка', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Фотографии ({images.length}/{maxImages})
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.imagesContainer}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Ionicons name="close-circle" size={24} color={Theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
          
          {canAddMore && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddImage}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Theme.colors.primary} />
              ) : (
                <>
                  <Ionicons name="camera" size={32} color={Theme.colors.primary} />
                  <Text style={styles.addButtonText}>Добавить</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: Theme.spacing.sm,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.round,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
  },
  addButtonText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.primary,
    marginTop: Theme.spacing.xs,
  },
});

