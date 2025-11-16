import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { loadUser } from '../store/slices/authSlice';
import { RootStackParamList } from '../types';
import { Colors } from '../constants/colors';

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
import ReviewDetailScreen from '../screens/ReviewDetailScreen';
import AddDishScreen from '../screens/AddDishScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

// AI & Gamification Screens
import TasteProfileScreen from '../screens/TasteProfileScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import ConnectivityTestScreen from '../screens/ConnectivityTestScreen';
import LogViewerScreen from '../screens/LogViewerScreen';

import { Loading, ErrorBoundary } from '../components';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Обертка экрана в ErrorBoundary для предотвращения крашей
const withErrorBoundary = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};

const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isGuest, isLoading } = useAppSelector((state) => state.auth);

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
        {!isAuthenticated && !isGuest ? (
          // Auth Stack
          <>
            <Stack.Screen name="Welcome" component={withErrorBoundary(WelcomeScreen)} />
            <Stack.Screen name="Login" component={withErrorBoundary(LoginScreen)} />
            <Stack.Screen name="Register" component={withErrorBoundary(RegisterScreen)} />
          </>
        ) : (
          // App Stack
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="RestaurantDetail"
              component={withErrorBoundary(RestaurantDetailScreen)}
              options={{ headerShown: true, title: 'Ресторан' }}
            />
            <Stack.Screen
              name="DishDetail"
              component={withErrorBoundary(DishDetailScreen)}
              options={{ headerShown: true, title: 'Блюдо' }}
            />
            <Stack.Screen
              name="AddReview"
              component={withErrorBoundary(AddReviewScreen)}
              options={{ headerShown: true, title: 'Добавить отзыв' }}
            />
            <Stack.Screen
              name="ReviewDetail"
              component={withErrorBoundary(ReviewDetailScreen)}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddDish"
              component={withErrorBoundary(AddDishScreen)}
              options={{ headerShown: true, title: 'Добавить блюдо' }}
            />
            <Stack.Screen
              name="UserProfile"
              component={withErrorBoundary(UserProfileScreen)}
              options={{ headerShown: true, title: 'Профиль' }}
            />
            <Stack.Screen
              name="EditProfile"
              component={withErrorBoundary(EditProfileScreen)}
              options={{ headerShown: true, title: 'Редактировать профиль' }}
            />
            <Stack.Screen
              name="TasteProfile"
              component={withErrorBoundary(TasteProfileScreen)}
              options={{ 
                headerShown: true, 
                title: 'Вкусовой профиль',
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: Colors.textInverse,
              }}
            />
            <Stack.Screen
              name="Achievements"
              component={withErrorBoundary(AchievementsScreen)}
              options={{ 
                headerShown: true, 
                title: 'Достижения',
                headerStyle: { backgroundColor: Colors.warning },
                headerTintColor: Colors.textInverse,
              }}
            />
            <Stack.Screen
              name="Recommendations"
              component={withErrorBoundary(RecommendationsScreen)}
              options={{ 
                headerShown: true, 
                title: 'Рекомендации для вас',
                headerStyle: { backgroundColor: Colors.secondary },
                headerTintColor: Colors.textInverse,
              }}
            />
            <Stack.Screen
              name="ConnectivityTest"
              component={withErrorBoundary(ConnectivityTestScreen)}
              options={{ 
                headerShown: true, 
                title: '🔧 Тест подключения',
                headerStyle: { backgroundColor: Colors.info },
                headerTintColor: Colors.textInverse,
              }}
            />
            <Stack.Screen
              name="LogViewer"
              component={withErrorBoundary(LogViewerScreen)}
              options={{ 
                headerShown: true, 
                title: '📝 Логи приложения',
                headerStyle: { backgroundColor: Colors.textSecondary },
                headerTintColor: Colors.textInverse,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

