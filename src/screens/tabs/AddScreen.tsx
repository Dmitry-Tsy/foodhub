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
import { Theme } from '../../constants/theme';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Add'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: NavigationProp;
}

const AddScreen: React.FC<Props> = ({ navigation }) => {
  const quickActions = [
    {
      id: 'review',
      title: 'Добавить отзыв',
      description: 'Поделитесь мнением о блюде',
      icon: 'star-outline' as const,
      color: Theme.colors.warning,
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
      color: Theme.colors.primary,
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
      color: Theme.colors.secondary,
      action: () => {
        navigation.navigate('Search');
      },
    },
  ];

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
              color={Theme.colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={24} color={Theme.colors.info} />
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
    backgroundColor: Theme.colors.background,
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
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
  },
  actionsContainer: {
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
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
    color: Theme.colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: `${Theme.colors.info}15`,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text,
    lineHeight: 20,
  },
});

export default AddScreen;

