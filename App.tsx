import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components';
import { setupGlobalErrorHandler, setupUnhandledRejectionHandler } from './src/utils/errorHandler';

export default function App() {
  // Устанавливаем глобальные обработчики ошибок при монтировании
  useEffect(() => {
    setupGlobalErrorHandler();
    setupUnhandledRejectionHandler();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider>
          <ErrorBoundary>
            <StatusBar style="auto" />
            <AppNavigator />
          </ErrorBoundary>
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
}

