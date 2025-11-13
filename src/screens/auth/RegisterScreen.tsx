import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, RegisterData } from '../../types';
import { Button, Input } from '../../components';
import { Theme } from '../../constants/theme';
import { Colors } from '../../constants/colors';
import { useAppDispatch, useAppSelector } from '../../store';
import { register } from '../../store/slices/authSlice';
import { validateRegisterForm } from '../../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    // Validate form
    const validation = validateRegisterForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors({});
    
    try {
      await dispatch(register(formData)).unwrap();
      // Navigation will happen automatically through AppNavigator
    } catch (error: any) {
      Alert.alert('Ошибка регистрации', error || 'Не удалось создать аккаунт');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Создать аккаунт</Text>
            <Text style={styles.subtitle}>
              Присоединяйтесь к сообществу гурманов
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Имя пользователя"
              placeholder="Введите имя пользователя"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              autoCapitalize="none"
              icon="person-outline"
              error={errors.username}
            />
            
            <Input
              label="Email"
              placeholder="Введите ваш email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              error={errors.email}
            />
            
            <Input
              label="Пароль"
              placeholder="Минимум 6 символов"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              isPassword
              icon="lock-closed-outline"
              error={errors.password}
            />
            
            <Input
              label="Подтвердите пароль"
              placeholder="Введите пароль еще раз"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              isPassword
              icon="lock-closed-outline"
              error={errors.confirmPassword}
            />
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <Button
              title="Зарегистрироваться"
              onPress={handleRegister}
              loading={isLoading}
              size="large"
              style={styles.registerButton}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Уже есть аккаунт? </Text>
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Login')}
            >
              Войти
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Theme.spacing.xl,
  },
  header: {
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.fontSize.xxxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: Theme.spacing.xl,
  },
  errorText: {
    color: Colors.error,
    fontSize: Theme.fontSize.md,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  registerButton: {
    marginTop: Theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: Theme.fontSize.md,
    color: Colors.primary,
    fontWeight: Theme.fontWeight.semibold,
  },
});

export default RegisterScreen;

