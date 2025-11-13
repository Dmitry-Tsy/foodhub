import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, RootStackParamList } from '../../types';
import { Button } from '../../components';
import { Theme } from '../../constants/theme';
import { Colors } from '../../constants/colors';
import { useAppDispatch, useAppSelector } from '../../store';
import { exitGuestMode } from '../../store/slices/authSlice';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Add'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: NavigationProp;
}

const AddScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isGuest } = useAppSelector((state) => state.auth);
  const quickActions = [
    {
      id: 'review',
      title: 'Добавить отзыв',
      description: 'Поделитесь мнением о блюде',
      icon: 'star-outline' as const,
      color: Colors.warning,
      action: () => {
        // В реальном приложении здесь будет выбор ресторана/блюда
        // Для примера перейдем на экран поиска
        navigation.navigate('Search');
      },
    },
    {
      id: 'dish',
      title: 'Добавить блюдо',
      description: 'Внесите новое блюдо в меню',
      icon: 'restaurant-outline' as const,
      color: Colors.primary,
      action: () => {
        // В реальном приложении здесь будет выбор ресторана
        navigation.navigate('Search');
      },
    },
    {
      id: 'restaurant',
      title: 'Найти ресторан',
      description: 'Найдите место, чтобы оставить отзыв',
      icon: 'location-outline' as const,
      color: Colors.secondary,
      action: () => {
        navigation.navigate('Search');
      },
    },
  ];

  // Режим гостя - показываем приглашение
  if (isGuest) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.guestContainer}>
          <View style={styles.guestIconContainer}>
            <Ionicons name="create-outline" size={60} color={Colors.primary} />
          </View>
          
          <Text style={styles.guestTitle}>Создание контента</Text>
          <Text style={styles.guestSubtitle}>
            Войдите в систему чтобы добавлять отзывы, фотографии и новые блюда
          </Text>
          
          <Button
            title="Войти"
            onPress={() => dispatch(exitGuestMode())}
            size="large"
            style={styles.loginButton}
          />
          
          <TouchableOpacity onPress={() => dispatch(exitGuestMode())}>
            <Text style={styles.registerText}>
              Нет аккаунта? <Text style={styles.registerLink}>Зарегистрироваться</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Что хотите добавить?</Text>
        <Text style={styles.subtitle}>
          Выберите действие для создания контента
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={action.action}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${action.color}20` }]}>
              <Ionicons name={action.icon} size={32} color={action.color} />
            </View>
            
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </View>
            
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={24} color={Colors.info} />
        <Text style={styles.infoText}>
          Ваши отзывы помогают другим гурманам находить лучшие блюда и рестораны!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Theme.spacing.md,
  },
  header: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: `${Colors.info}15`,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Theme.fontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  guestIconContainer: {
    width: 120,
    height: 120,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  guestTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  guestSubtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    lineHeight: 22,
  },
  loginButton: {
    width: '100%',
    marginBottom: Theme.spacing.md,
  },
  registerText: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
  },
  registerLink: {
    color: Colors.primary,
    fontWeight: Theme.fontWeight.semibold,
  },
});

export default AddScreen;

