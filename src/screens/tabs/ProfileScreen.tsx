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
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { formatCount } from '../../utils/formatters';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: NavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline' as const,
      title: 'Редактировать профиль',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'heart-outline' as const,
      title: 'Избранное',
      onPress: () => {},
    },
    {
      icon: 'chatbubbles-outline' as const,
      title: 'Мои отзывы',
      onPress: () => {},
    },
    {
      icon: 'settings-outline' as const,
      title: 'Настройки',
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={48} color={Theme.colors.textLight} />
          </View>
        )}
        
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCount(user?.followersCount || 0)}</Text>
            <Text style={styles.statLabel}>Подписчики</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCount(user?.followingCount || 0)}</Text>
            <Text style={styles.statLabel}>Подписки</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Theme.colors.trust }]}>
              {user?.trustScore.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Доверие</Text>
          </View>
        </View>
        
        {user?.bio && (
          <Text style={styles.bio}>{user.bio}</Text>
        )}
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={24} color={Theme.colors.text} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Theme.colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Выйти"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
      />
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
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  email: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
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
    color: Theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Theme.colors.border,
    marginHorizontal: Theme.spacing.md,
  },
  bio: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  menuContainer: {
    backgroundColor: Theme.colors.card,
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
    borderBottomColor: Theme.colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  menuItemText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
  },
  logoutButton: {
    marginBottom: Theme.spacing.xl,
  },
});

export default ProfileScreen;

