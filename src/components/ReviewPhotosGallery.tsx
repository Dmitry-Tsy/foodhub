import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { ReviewPhoto } from '../types';
import { ratePhoto, getPhotoStats } from '../services/photoRatingService';
import { useAppSelector } from '../store';

interface ReviewPhotosGalleryProps {
  photos: string[];
  reviewId: string;
  dishId: string;
  compact?: boolean; // Показывать компактную версию (первые 3 фото)
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ReviewPhotosGallery: React.FC<ReviewPhotosGalleryProps> = ({
  photos,
  reviewId,
  dishId,
  compact = false,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [photoRatings, setPhotoRatings] = useState<Record<string, ReviewPhoto>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Загружаем статистику по всем фото
  useEffect(() => {
    const loadPhotoStats = async () => {
      const stats: Record<string, ReviewPhoto> = {};
      
      for (const photoUrl of photos) {
        try {
          const response = await getPhotoStats(photoUrl, reviewId);
          stats[photoUrl] = {
            url: photoUrl,
            rating: response.rating,
            voteCount: response.voteCount,
            score: response.score,
          };
        } catch (error) {
          console.error('❌ Ошибка загрузки статистики фото:', error);
          stats[photoUrl] = {
            url: photoUrl,
            rating: 0,
            voteCount: 0,
            score: 0,
          };
        }
      }
      
      setPhotoRatings(stats);
    };

    if (photos.length > 0) {
      loadPhotoStats();
    }
  }, [photos, reviewId]);

  const handleRatePhoto = async (photoUrl: string) => {
    if (!user) {
      // TODO: показать сообщение о необходимости авторизации
      Alert.alert('Требуется авторизация', 'Для оценки фото необходимо войти в систему');
      return;
    }

    if (loading[photoUrl]) return;

    setLoading((prev) => ({ ...prev, [photoUrl]: true }));

    try {
      const response = await ratePhoto(photoUrl, reviewId);
      
      // Обновляем статистику
      const stats = await getPhotoStats(photoUrl, reviewId);
      setPhotoRatings((prev) => ({
        ...prev,
        [photoUrl]: {
          url: photoUrl,
          rating: stats.rating,
          voteCount: stats.voteCount,
          score: stats.score,
        },
      }));
    } catch (error) {
      console.error('❌ Ошибка оценки фото:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [photoUrl]: false }));
    }
  };

  const displayPhotos = compact ? photos.slice(0, 3) : photos;
  const hasMorePhotos = compact && photos.length > 3;

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        {displayPhotos.map((photoUrl, index) => {
          const stats = photoRatings[photoUrl];
          const isLiked = stats && (stats.voteCount ?? 0) > 0; // Упрощенная проверка - можно улучшить

          return (
            <TouchableOpacity
              key={index}
              style={styles.photoWrapper}
              onPress={() => {
                setSelectedPhoto(photoUrl);
                setModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <Image source={{ uri: photoUrl }} style={styles.photo} />
              
              {/* Overlay с кнопкой лайка */}
              <TouchableOpacity
                style={styles.likeButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleRatePhoto(photoUrl);
                }}
                disabled={loading[photoUrl] || !user}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isLiked ? Colors.error : Colors.textInverse}
                />
                {stats && (stats.voteCount ?? 0) > 0 && (
                  <Text style={styles.likeCount}>{stats.voteCount ?? 0}</Text>
                )}
              </TouchableOpacity>
              
              {hasMorePhotos && index === 2 && (
                <View style={styles.moreOverlay}>
                  <Text style={styles.moreText}>+{photos.length - 3}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Модальное окно для просмотра фото */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={32} color={Colors.textInverse} />
          </TouchableOpacity>
          
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modalScrollView}
          >
            {photos.map((photoUrl, index) => {
              const stats = photoRatings[photoUrl];
              const isLiked = stats && (stats.voteCount ?? 0) > 0;

              return (
                <View key={`${photoUrl}-${index}`} style={styles.modalPhotoContainer}>
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.modalPhoto}
                    resizeMode="contain"
                  />
                  
                  <View style={styles.modalControls}>
                    <TouchableOpacity
                      style={styles.modalLikeButton}
                      onPress={() => handleRatePhoto(photoUrl)}
                      disabled={loading[photoUrl] || !user}
                    >
                      <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={28}
                        color={isLiked ? Colors.error : Colors.textInverse}
                      />
                      {stats && (stats.voteCount ?? 0) > 0 && (
                        <Text style={styles.modalLikeCount}>
                          {stats.voteCount ?? 0}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
  photoWrapper: {
    position: 'relative',
    width: (SCREEN_WIDTH - Theme.spacing.lg * 2 - Theme.spacing.xs * 2) / 3,
    aspectRatio: 1,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface,
  },
  likeButton: {
    position: 'absolute',
    bottom: Theme.spacing.xs,
    right: Theme.spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: Theme.borderRadius.round,
    padding: Theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  likeCount: {
    color: Colors.textInverse,
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
  },
  moreOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: Colors.textInverse,
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Theme.spacing.xl,
    right: Theme.spacing.lg,
    zIndex: 10,
    padding: Theme.spacing.sm,
  },
  modalScrollView: {
    alignItems: 'center',
  },
  modalPhotoContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalPhoto: {
    width: SCREEN_WIDTH,
    height: '80%',
  },
  modalControls: {
    position: 'absolute',
    bottom: Theme.spacing.xl,
    alignSelf: 'center',
  },
  modalLikeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: Theme.borderRadius.round,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  modalLikeCount: {
    color: Colors.textInverse,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
  },
});

