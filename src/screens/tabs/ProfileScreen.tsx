import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
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
import { logout, exitGuestMode } from '../../store/slices/authSlice';
import { formatCount } from '../../utils/formatters';
import logger from '../../services/logger';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: NavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, isGuest } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    logger.info('PROFILE', 'Попытка выхода');
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: () => {
            logger.info('PROFILE', 'Выход подтвержден');
            dispatch(logout());
          },
        },
      ]
    );
  };
  
  const menuItems = [
    {
      icon: 'restaurant' as const,
      title: '⚙️ Вкусовой профиль',
      subtitle: 'Настройте предпочтения',
      color: Colors.primary,
      onPress: () => navigation.navigate('TasteProfile'),
    },
    {
      icon: 'sparkles' as const,
      title: '✨ Рекомендации AI',
      subtitle: 'Подобрано для вас',
      color: Colors.secondary,
      onPress: () => navigation.navigate('Recommendations'),
    },
    {
      icon: 'trophy' as const,
      title: '🏆 Достижения',
      subtitle: 'Ваши награды и прогресс',
      color: Colors.warning,
      onPress: () => navigation.navigate('Achievements'),
    },
    {
      icon: 'person-outline' as const,
      title: 'Редактировать профиль',
      subtitle: 'Фото, имя, био',
      color: Colors.text,
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'heart-outline' as const,
      title: 'Избранное',
      subtitle: 'Любимые рестораны',
      color: Colors.error,
      onPress: () => {},
    },
    {
      icon: 'chatbubbles-outline' as const,
      title: 'Мои отзывы',
      subtitle: 'История активности',
      color: Colors.info,
      onPress: () => {},
    },
    {
      icon: 'wifi' as const,
      title: '🔧 Тест подключения',
      subtitle: 'Проверка связи с сервером',
      color: Colors.info,
      onPress: () => navigation.navigate('ConnectivityTest'),
    },
    {
      icon: 'settings-outline' as const,
      title: 'Настройки',
      subtitle: 'Конфиденциальность',
      color: Colors.textSecondary,
      onPress: () => {},
    },
  ];

  // Режим гостя - показываем приглашение войти
  if (isGuest) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.guestContainer}>
          <View style={styles.guestIconContainer}>
            <Ionicons name="person-outline" size={80} color={Colors.primary} />
          </View>
          
          <Text style={styles.guestTitle}>Режим гостя</Text>
          <Text style={styles.guestSubtitle}>
            Войдите в систему чтобы получить полный доступ к функциям приложения
          </Text>
          
          <View style={styles.guestFeatures}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.featureText}>Оставлять отзывы и рейтинги</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.featureText}>Добавлять фотографии блюд</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.featureText}>Подписываться на пользователей</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.featureText}>Добавлять блюда в меню</Text>
            </View>
          </View>
          
          <Button
            title="Войти"
            onPress={() => dispatch(exitGuestMode())}
            size="large"
            style={styles.loginButton}
          />
          
          <TouchableOpacity onPress={() => dispatch(exitGuestMode())}>
            <Text style={styles.registerText}>
              Еще нет аккаунта? <Text style={styles.registerLink}>Зарегистрироваться</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Вспомогательные функции для рендера (разбиение на функции помогает избежать проблем с рендерингом)
  const renderHeader = () => {
    try {
      const avatarElement = user?.avatar ? (
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Ionicons name="person" size={48} color={Colors.textLight} />
        </View>
      );

      const usernameText = user?.username || 'Пользователь';
      const emailText = user?.email || '';

      // Безопасная обработка formatCount
      let followersFormatted, followingFormatted;
      try {
        followersFormatted = formatCount(user?.followersCount || 0);
      } catch (e: any) {
        logger.error('PROFILE', 'Ошибка formatCount followers', e);
        followersFormatted = String(user?.followersCount || 0);
      }

      try {
        followingFormatted = formatCount(user?.followingCount || 0);
      } catch (e: any) {
        logger.error('PROFILE', 'Ошибка formatCount following', e);
        followingFormatted = String(user?.followingCount || 0);
      }

      const trustScoreText = (user?.trustScore ?? 0).toFixed(1);

      return (
        <View style={styles.header}>
          {avatarElement}
          <Text style={styles.username}>{usernameText}</Text>
          <Text style={styles.email}>{emailText}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{followersFormatted}</Text>
              <Text style={styles.statLabel}>Подписчики</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{followingFormatted}</Text>
              <Text style={styles.statLabel}>Подписки</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.trust }]}>
                {trustScoreText}
              </Text>
              <Text style={styles.statLabel}>Доверие</Text>
            </View>
          </View>
          {user?.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}
        </View>
      );
    } catch (e: any) {
      logger.error('PROFILE', 'Ошибка рендера header', {
        error: e.message,
        stack: e.stack,
      });
      return (
        <View style={styles.header}>
          <Text style={styles.username}>Ошибка загрузки</Text>
        </View>
      );
    }
  };

  const renderMenu = () => {
    try {
      const menuElements = menuItems.map((item, index) => {
        if (!item.icon) {
          logger.error('PROFILE', `Menu item ${index} не имеет icon`);
          return null;
        }

        return (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        );
      });

      return (
        <View style={styles.menuContainer}>
          {menuElements}
        </View>
      );
    } catch (e: any) {
      logger.error('PROFILE', 'Ошибка рендера menu', {
        error: e.message,
        stack: e.stack,
      });
      return (
        <View style={styles.menuContainer}>
          <Text style={styles.menuItemText}>Ошибка загрузки меню</Text>
        </View>
      );
    }
  };

  try {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {renderHeader()}
        {renderMenu()}
        <Button
          title="Выйти"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </ScrollView>
    );
  } catch (e: any) {
    logger.error('PROFILE', 'Критическая ошибка рендера', {
      error: e.message,
      stack: e.stack,
    });
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.username}>Ошибка загрузки профиля</Text>
        </View>
      </ScrollView>
    );
  }
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
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.round,
    marginBottom: Theme.spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  email: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Theme.spacing.md,
  },
  bio: {
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  menuContainer: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.xl,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  menuItemText: {
    fontSize: Theme.fontSize.md,
    color: Colors.text,
  },
  logoutButton: {
    marginBottom: Theme.spacing.xl,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  guestIconContainer: {
    width: 140,
    height: 140,
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
  guestFeatures: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
    gap: Theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  featureText: {
    fontSize: Theme.fontSize.md,
    color: Colors.text,
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

export default ProfileScreen;

