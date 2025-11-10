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
import { RootStackParamList, LoginCredentials } from '../../types';
import { Button, Input } from '../../components';
import { Theme } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { login, clearError } from '../../store/slices/authSlice';
import { validateLoginForm } from '../../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    // Validate form
    const validation = validateLoginForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors({});
    
    try {
      await dispatch(login(formData)).unwrap();
      // Navigation will happen automatically through AppNavigator
    } catch (error: any) {
      Alert.alert('Ошибка входа', error || 'Не удалось войти');
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
            <Text style={styles.title}>С возвращением!</Text>
            <Text style={styles.subtitle}>
              Войдите, чтобы продолжить
            </Text>
          </View>
          
          <View style={styles.form}>
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
              placeholder="Введите пароль"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              isPassword
              icon="lock-closed-outline"
              error={errors.password}
            />
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <Button
              title="Войти"
              onPress={handleLogin}
              loading={isLoading}
              size="large"
              style={styles.loginButton}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Нет аккаунта? </Text>
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Register')}
            >
              Зарегистрироваться
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
    backgroundColor: Theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Theme.spacing.xl,
  },
  header: {
    marginTop: Theme.spacing.xxl,
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.fontSize.xxxl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
  },
  form: {
    marginBottom: Theme.spacing.xl,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: Theme.fontSize.md,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  loginButton: {
    marginTop: Theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
  },
  footerLink: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.primary,
    fontWeight: Theme.fontWeight.semibold,
  },
});

export default LoginScreen;

