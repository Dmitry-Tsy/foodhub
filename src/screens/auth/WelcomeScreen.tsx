import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components';
import { Theme } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🍽️</Text>
          <Text style={styles.title}>FoodHub</Text>
          <Text style={styles.subtitle}>
            Оценивайте блюда, делитесь впечатлениями и находите лучшие рестораны
          </Text>
        </View>
        
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustration}>
            🍕 🍣 🍜{'\n'}
            🍔 ⭐ 🍰{'\n'}
            🥗 🍷 ☕
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Войти"
            onPress={() => navigation.navigate('Login')}
            size="large"
            style={styles.button}
          />
          
          <Button
            title="Создать аккаунт"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            size="large"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.xl,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Theme.spacing.xxl,
  },
  logo: {
    fontSize: 80,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xxxl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.md,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    fontSize: 48,
    textAlign: 'center',
    lineHeight: 60,
  },
  buttonContainer: {
    gap: Theme.spacing.md,
  },
  button: {
    width: '100%',
  },
});

export default WelcomeScreen;

