import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components';
import { Theme } from '../../constants/theme';
import { Colors } from '../../constants/colors';
import { useAppDispatch } from '../../store';
import { continueAsGuest } from '../../store/slices/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const handleGuestMode = () => {
    dispatch(continueAsGuest());
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>FoodHub</Text>
          <Text style={styles.subtitle}>
            Оценивайте блюда, делитесь впечатлениями и находите лучшие рестораны
          </Text>
        </View>
        
        {/* Spacer для центрирования */}
        <View style={styles.spacer} />
        
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
          
          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestMode}
            activeOpacity={0.7}
          >
            <Text style={styles.guestButtonText}>
              Продолжить как гость
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xxxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Theme.spacing.md,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    gap: Theme.spacing.md,
  },
  button: {
    width: '100%',
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
  },
  guestButtonText: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;

