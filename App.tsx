import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { setupGlobalErrorHandler, setupUnhandledRejectionHandler } from './src/utils/errorHandler';

const AppContent: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider>
          <ErrorBoundary>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <AppNavigator />
          </ErrorBoundary>
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default function App() {
  // Устанавливаем глобальные обработчики ошибок при монтировании
  useEffect(() => {
    setupGlobalErrorHandler();
    setupUnhandledRejectionHandler();
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

