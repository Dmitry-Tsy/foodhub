import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { loadUser } from '../store/slices/authSlice';
import { RootStackParamList } from '../types';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main App
import MainTabNavigator from './MainTabNavigator';

// Detail Screens
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import DishDetailScreen from '../screens/DishDetailScreen';
import AddReviewScreen from '../screens/AddReviewScreen';
import AddDishScreen from '../screens/AddDishScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

import { Loading } from '../components';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Проверяем наличие сохраненного токена при запуске
    dispatch(loadUser());
  }, [dispatch]);

  if (isLoading) {
    return <Loading fullScreen text="Загрузка..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // App Stack
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="RestaurantDetail"
              component={RestaurantDetailScreen}
              options={{ headerShown: true, title: 'Ресторан' }}
            />
            <Stack.Screen
              name="DishDetail"
              component={DishDetailScreen}
              options={{ headerShown: true, title: 'Блюдо' }}
            />
            <Stack.Screen
              name="AddReview"
              component={AddReviewScreen}
              options={{ headerShown: true, title: 'Добавить отзыв' }}
            />
            <Stack.Screen
              name="AddDish"
              component={AddDishScreen}
              options={{ headerShown: true, title: 'Добавить блюдо' }}
            />
            <Stack.Screen
              name="UserProfile"
              component={UserProfileScreen}
              options={{ headerShown: true, title: 'Профиль' }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ headerShown: true, title: 'Редактировать профиль' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

