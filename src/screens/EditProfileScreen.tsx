import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Button, Input } from '../components';
import { Theme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../store';
import { updateUser } from '../store/slices/authSlice';
import * as imageService from '../services/imageService';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleChangeAvatar = async () => {
    try {
      const uri = await imageService.pickImageFromGallery();
      if (uri) {
        const uploadedUrl = await imageService.uploadImage(uri);
        setAvatar(uploadedUrl);
      }
    } catch (error: any) {
      Alert.alert('Ошибка', error.message);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert('Ошибка', 'Имя пользователя не может быть пустым');
      return;
    }

    setLoading(true);
    try {
      dispatch(
        updateUser({
          username: username.trim(),
          bio: bio.trim() || undefined,
          avatar: avatar || undefined,
        })
      );

      Alert.alert('Успех', 'Профиль обновлен!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Ошибка', error);
    } finally {
      setLoading(false);
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
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleChangeAvatar} activeOpacity={0.7}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={48} color={Theme.colors.textLight} />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color={Theme.colors.background} />
            </View>
          </TouchableOpacity>
        </View>

        <Input
          label="Имя пользователя"
          placeholder="Введите имя пользователя"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          icon="person-outline"
        />

        <Input
          label="О себе"
          placeholder="Расскажите о себе..."
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.bioInput}
        />

        <Button
          title="Сохранить изменения"
          onPress={handleSave}
          loading={loading}
          size="large"
          style={styles.saveButton}
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
  avatarSection: {
    alignItems: 'center',
    marginVertical: Theme.spacing.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: Theme.borderRadius.round,
  },
  avatarPlaceholder: {
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioInput: {
    height: 100,
  },
  saveButton: {
    marginTop: Theme.spacing.xl,
  },
});

export default EditProfileScreen;

