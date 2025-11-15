import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import logger from '../services/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary компонент
 * Перехватывает ошибки рендеринга и показывает fallback UI вместо краша
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Обновляем состояние так, чтобы следующий рендер показал fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Логируем ошибку
    console.error('❌ ErrorBoundary: Перехвачена ошибка:', error);
    console.error('❌ ErrorBoundary: ErrorInfo:', errorInfo);
    
    // Логируем через наш logger (безопасно)
    try {
      logger.error('ErrorBoundary', 'Перехвачена ошибка рендеринга', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack?.substring(0, 500), // Ограничиваем размер
        },
        componentStack: errorInfo.componentStack?.substring(0, 500),
      });
    } catch (e) {
      console.error('❌ Ошибка при логировании в ErrorBoundary:', e);
    }

    this.setState({
      error,
      errorInfo,
    });

    // Вызываем callback если есть
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (e) {
        console.error('❌ Ошибка в onError callback:', e);
      }
    }

    // Показываем Alert только в dev режиме или для критических ошибок
    if (__DEV__) {
      // В dev режиме показываем детали
      try {
        Alert.alert(
          'Ошибка в компоненте',
          `Произошла ошибка: ${error.message}\n\nПриложение продолжит работу, но этот экран может не отображаться корректно.`,
          [{ text: 'OK' }]
        );
      } catch (e) {
        console.error('❌ Ошибка при показе Alert:', e);
      }
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    // Попробуем перезагрузить приложение
    // В React Native это можно сделать через перезапуск навигации
    this.handleReset();
  };

  render() {
    if (this.state.hasError) {
      // Если есть кастомный fallback, используем его
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Иначе показываем стандартный UI ошибки
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Ionicons name="alert-circle" size={80} color={Colors.error} />
            <Text style={styles.title}>Произошла ошибка</Text>
            <Text style={styles.message}>
              Приложение столкнулось с неожиданной ошибкой. Мы уже работаем над исправлением.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Детали ошибки (только для разработки):</Text>
                <Text style={styles.errorText}>{this.state.error.toString()}</Text>
                {this.state.error.stack && (
                  <>
                    <Text style={styles.errorSubtitle}>Stack trace:</Text>
                    <Text style={styles.errorStack}>{this.state.error.stack}</Text>
                  </>
                )}
                {this.state.errorInfo?.componentStack && (
                  <>
                    <Text style={styles.errorSubtitle}>Component stack:</Text>
                    <Text style={styles.errorStack}>{this.state.errorInfo.componentStack}</Text>
                  </>
                )}
              </ScrollView>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={this.handleReset}
              >
                <Ionicons name="refresh" size={20} color={Colors.textInverse} />
                <Text style={styles.buttonText}>Попробовать снова</Text>
              </TouchableOpacity>

              {__DEV__ && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={this.handleReload}
                >
                  <Ionicons name="reload" size={20} color={Colors.primary} />
                  <Text style={[styles.buttonText, { color: Colors.primary }]}>
                    Перезагрузить
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.hint}>
              Если ошибка повторяется, попробуйте перезапустить приложение
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
  },
  message: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorDetails: {
    marginTop: Theme.spacing.lg,
    maxHeight: 200,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    width: '100%',
  },
  errorTitle: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.error,
    marginBottom: Theme.spacing.sm,
  },
  errorText: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text,
    fontFamily: 'monospace',
  },
  errorSubtitle: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.sm,
  },
  errorStack: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    marginTop: Theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.xl,
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.textInverse,
  },
  hint: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textLight,
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
  },
});

export default ErrorBoundary;

