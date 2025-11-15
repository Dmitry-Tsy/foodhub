import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from '../types';
import { Theme } from '../constants/theme';
import { ErrorBoundary } from '../components';

// Tab Screens
import SearchScreen from '../screens/tabs/SearchScreen';
import AddScreen from '../screens/tabs/AddScreen';
import FeedScreen from '../screens/tabs/FeedScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';
import LogViewerScreen from '../screens/LogViewerScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Обертка экрана в ErrorBoundary для предотвращения крашей
const withErrorBoundary = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Feed') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Logs') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Theme.colors.background,
          borderTopColor: Theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: Theme.colors.background,
        },
        headerTitleStyle: {
          fontWeight: Theme.fontWeight.bold,
        },
      })}
    >
      <Tab.Screen
        name="Search"
        component={withErrorBoundary(SearchScreen)}
        options={{ title: 'Поиск' }}
      />
      <Tab.Screen
        name="Add"
        component={withErrorBoundary(AddScreen)}
        options={{ title: 'Добавить' }}
      />
      <Tab.Screen
        name="Feed"
        component={withErrorBoundary(FeedScreen)}
        options={{ title: 'Лента' }}
      />
      <Tab.Screen
        name="Logs"
        component={withErrorBoundary(LogViewerScreen)}
        options={{ 
          title: 'Логи',
          headerShown: false, // LogViewerScreen имеет свой header
        }}
      />
      <Tab.Screen
        name="Profile"
        component={withErrorBoundary(ProfileScreen)}
        options={{ title: 'Профиль' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

