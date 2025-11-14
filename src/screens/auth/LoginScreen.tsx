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
  Image,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, LoginCredentials } from '../../types';
import { Button, Input } from '../../components';
import { Theme } from '../../constants/theme';
import { Colors } from '../../constants/colors';
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
      Alert.alert('Ошибка входа', error || 'Не удалось войти. Проверьте подключение к серверу.');
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
          showsVerticalScrollIndicator={false}
        >
          {/* Логотип */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>FoodHub</Text>
            <Text style={styles.tagline}>Социальная сеть для гурманов</Text>
          </View>
          
          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={styles.title}>С возвращением!</Text>
            <Text style={styles.subtitle}>
              Войдите, чтобы продолжить делиться впечатлениями
            </Text>
          </View>
          
          {/* Форма */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Input
                label="Email"
                placeholder="your@email.com"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail-outline"
                error={errors.email}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Input
                label="Пароль"
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                isPassword
                icon="lock-closed-outline"
                error={errors.password}
              />
            </View>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
                <Text style={styles.errorHint}>
                  Проверьте подключение к интернету
                </Text>
              </View>
            )}
            
            <Button
              title="Войти"
              onPress={handleLogin}
              loading={isLoading}
              size="large"
              style={styles.loginButton}
            />
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => Alert.alert('Восстановление пароля', 'Функция в разработке')}
            >
              <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
            </TouchableOpacity>
          </View>
          
          {/* Футер */}
          <View style={styles.footer}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>или</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <View style={styles.registerPrompt}>
              <Text style={styles.footerText}>Нет аккаунта? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>Зарегистрироваться</Text>
              </TouchableOpacity>
            </View>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: Theme.spacing.md,
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  header: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    marginBottom: Theme.spacing.xl,
  },
  inputWrapper: {
    marginBottom: Theme.spacing.md,
  },
  errorContainer: {
    backgroundColor: `${Colors.error}15`,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  errorHint: {
    color: Colors.textSecondary,
    fontSize: Theme.fontSize.sm,
    fontStyle: 'italic',
  },
  loginButton: {
    marginTop: Theme.spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: Theme.spacing.md,
    padding: Theme.spacing.sm,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Theme.spacing.md,
    color: Colors.textSecondary,
    fontSize: Theme.fontSize.sm,
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  footerText: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: Theme.fontSize.md,
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;
