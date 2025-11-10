import * as ImagePicker from 'expo-image-picker';

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting media library permission:', error);
    return false;
  }
};

export const pickImageFromGallery = async (): Promise<string | null> => {
  const hasPermission = await requestMediaLibraryPermission();
  
  if (!hasPermission) {
    throw new Error('Доступ к галерее не предоставлен');
  }
  
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image from gallery:', error);
    throw new Error('Не удалось выбрать изображение');
  }
};

export const takePhoto = async (): Promise<string | null> => {
  const hasPermission = await requestCameraPermission();
  
  if (!hasPermission) {
    throw new Error('Доступ к камере не предоставлен');
  }
  
  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    throw new Error('Не удалось сделать фото');
  }
};

export const pickMultipleImages = async (maxImages: number = 5): Promise<string[]> => {
  const hasPermission = await requestMediaLibraryPermission();
  
  if (!hasPermission) {
    throw new Error('Доступ к галерее не предоставлен');
  }
  
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages,
    });
    
    if (!result.canceled && result.assets.length > 0) {
      return result.assets.map(asset => asset.uri);
    }
    
    return [];
  } catch (error) {
    console.error('Error picking multiple images:', error);
    throw new Error('Не удалось выбрать изображения');
  }
};

// Mock функция загрузки на сервер (замените на реальную интеграцию с Cloudinary или другим сервисом)
export const uploadImage = async (uri: string): Promise<string> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // В реальном приложении здесь будет загрузка на Cloudinary или другой сервис
  // Пока возвращаем локальный URI
  return uri;
};

export const uploadMultipleImages = async (uris: string[]): Promise<string[]> => {
  // Upload all images in parallel
  const uploadPromises = uris.map(uri => uploadImage(uri));
  return Promise.all(uploadPromises);
};

