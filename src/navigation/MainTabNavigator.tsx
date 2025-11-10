import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from '../types';
import { Theme } from '../constants/theme';

// Tab Screens
import SearchScreen from '../screens/tabs/SearchScreen';
import AddScreen from '../screens/tabs/AddScreen';
import FeedScreen from '../screens/tabs/FeedScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

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
        component={SearchScreen}
        options={{ title: 'Поиск' }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{ title: 'Добавить' }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{ title: 'Лента' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Профиль' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

