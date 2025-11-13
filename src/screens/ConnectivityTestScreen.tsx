import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import axios from 'axios';
import { getApiBaseUrl } from '../config/api.config';

// Автоматическое определение из конфига
const isEmulator = true; // Измените на false для реального устройства
const API_BASE_URL = getApiBaseUrl(isEmulator);

const ConnectivityTestScreen = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (test: string, success: boolean, message: string, data?: any) => {
    setResults(prev => [...prev, { test, success, message, data, time: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    // Test 1: Health check
    try {
      addResult('Health Check', false, 'Проверяю...', null);
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      addResult('Health Check', true, 'Успешно!', response.data);
    } catch (error: any) {
      addResult('Health Check', false, `Ошибка: ${error.message}`, error.code);
    }

    // Test 2: API endpoint
    try {
      addResult('API Test', false, 'Проверяю /api/search...', null);
      const response = await axios.get(`${API_BASE_URL}/api/search?query=test`, { timeout: 5000 });
      addResult('API Test', true, 'API доступен!', response.data);
    } catch (error: any) {
      addResult('API Test', false, `Ошибка: ${error.message}`, error.code);
    }

    // Test 3: Регистрация
    try {
      addResult('Registration', false, 'Пробую регистрацию...', null);
      const testEmail = `test${Date.now()}@test.com`;
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        {
          username: `testuser${Date.now()}`,
          email: testEmail,
          password: 'password123',
        },
        { timeout: 10000 }
      );
      addResult('Registration', true, 'Регистрация работает!', { userId: response.data.user?.id });
    } catch (error: any) {
      addResult('Registration', false, `Ошибка: ${error.message}`, {
        code: error.code,
        response: error.response?.data,
      });
    }

    setTesting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🔧 Connectivity Test</Text>
        <Text style={styles.subtitle}>Проверка подключения к серверу</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📡 Конфигурация:</Text>
          <Text style={styles.infoText}>API URL: {API_BASE_URL}</Text>
          <Text style={styles.infoText}>Timeout: 5-10 секунд</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, testing && styles.buttonDisabled]}
          onPress={runTests}
          disabled={testing}
        >
          {testing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>▶ Запустить тесты</Text>
          )}
        </TouchableOpacity>

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>📋 Результаты:</Text>
            {results.map((result, index) => (
              <View
                key={index}
                style={[
                  styles.resultItem,
                  result.success ? styles.resultSuccess : styles.resultError,
                ]}
              >
                <Text style={styles.resultTest}>
                  {result.success ? '✅' : '❌'} {result.test}
                </Text>
                <Text style={styles.resultMessage}>{result.message}</Text>
                {result.data && (
                  <Text style={styles.resultData}>
                    {JSON.stringify(result.data, null, 2)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>💡 Если тесты не проходят:</Text>
          <Text style={styles.helpText}>
            1. Убедитесь что бэкенд запущен:{'\n'}
               cd backend && npm run dev
          </Text>
          <Text style={styles.helpText}>
            2. Проверьте в браузере телефона:{'\n'}
               http://192.168.31.212:3000/health
          </Text>
          <Text style={styles.helpText}>
            3. Устройство и компьютер должны быть в одной Wi-Fi сети!
          </Text>
          <Text style={styles.helpText}>
            4. Проверьте IP компьютера:{'\n'}
               ifconfig | grep "inet "
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xl,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  infoTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  infoText: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xs,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
  },
  resultsContainer: {
    marginBottom: Theme.spacing.xl,
  },
  resultsTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  resultItem: {
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderLeftWidth: 4,
  },
  resultSuccess: {
    backgroundColor: `${Colors.success}15`,
    borderLeftColor: Colors.success,
  },
  resultError: {
    backgroundColor: `${Colors.error}15`,
    borderLeftColor: Colors.error,
  },
  resultTest: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  resultMessage: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  resultData: {
    fontSize: 11,
    color: Colors.textLight,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  helpBox: {
    backgroundColor: `${Colors.warning}15`,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  helpTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Theme.spacing.md,
  },
  helpText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.sm,
    lineHeight: 20,
  },
});

export default ConnectivityTestScreen;

