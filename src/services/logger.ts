/**
 * FoodHub Logger Service
 * 
 * Централизованная система логирования с:
 * - Разными уровнями (debug, info, warn, error)
 * - Сохранением в AsyncStorage
 * - Просмотром логов в приложении
 * - Экспортом логов
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Alert, Share } from 'react-native';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

const LOG_STORAGE_KEY = '@foodhub_logs';
const MAX_LOGS = 500; // Максимум 500 записей
const LOG_RETENTION_DAYS = 7; // Храним логи 7 дней

class Logger {
  private logs: LogEntry[] = [];
  private isInitialized = false;

  /**
   * Инициализация - загрузка сохраненных логов
   * Добавлен таймаут и защита от зависаний на Android 15
   */
  async init() {
    if (this.isInitialized) return;
    
    // Флаг для предотвращения повторных вызовов
    if ((this as any)._isInitializing) {
      // Ждем завершения текущей инициализации
      return new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.isInitialized) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
        // Таймаут на случай зависания
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 3000);
      });
    }
    
    (this as any)._isInitializing = true;
    
    try {
      // Таймаут для AsyncStorage на Android 15
      const initPromise = (async () => {
        try {
          const savedLogs = await AsyncStorage.getItem(LOG_STORAGE_KEY);
          if (savedLogs) {
            try {
              const parsed = JSON.parse(savedLogs);
              if (Array.isArray(parsed)) {
                this.logs = parsed;
                // Очистка старых логов
                this.cleanOldLogs();
              } else {
                this.logs = [];
              }
            } catch (parseError) {
              console.error('❌ Ошибка парсинга логов:', parseError);
              this.logs = [];
            }
          } else {
            this.logs = [];
          }
        } catch (storageError) {
          console.error('❌ Ошибка AsyncStorage при инициализации:', storageError);
          this.logs = [];
        }
      })();
      
      // Таймаут 5 секунд для инициализации
      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          console.warn('⚠️ Таймаут инициализации logger, используем пустой массив');
          this.logs = [];
          resolve();
        }, 5000);
      });
      
      await Promise.race([initPromise, timeoutPromise]);
      
      this.isInitialized = true;
      console.log('✅ Logger initialized, logs:', this.logs.length);
    } catch (error) {
      console.error('❌ Критическая ошибка инициализации logger:', error);
      this.logs = [];
      this.isInitialized = true; // Все равно помечаем как инициализированный
    } finally {
      (this as any)._isInitializing = false;
    }
  }

  /**
   * Удаление логов старше N дней
   */
  private cleanOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - LOG_RETENTION_DAYS);
    
    const initialCount = this.logs.length;
    this.logs = this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate > cutoffDate;
    });
    
    const removed = initialCount - this.logs.length;
    if (removed > 0) {
      console.log(`🗑️ Удалено старых логов: ${removed}`);
    }
  }

  /**
   * Добавление лог записи
   */
  private async addLog(level: LogLevel, category: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
    };

    this.logs.push(entry);

    // Ограничение количества логов
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(-MAX_LOGS);
    }

    // Сохранение в AsyncStorage (асинхронно, не блокируем)
    this.saveLogs();

    // Дублируем в console для разработки
    const emoji = this.getEmojiForLevel(level);
    const logMessage = `${emoji} [${category}] ${message}`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, data || '');
        break;
      case LogLevel.INFO:
        console.log(logMessage, data || '');
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data || '');
        break;
      case LogLevel.ERROR:
        console.error(logMessage, data || '');
        break;
    }
  }

  /**
   * Сохранение логов в AsyncStorage
   * Добавлен таймаут для защиты от зависаний
   */
  private async saveLogs() {
    try {
      // Не блокируем приложение при сохранении
      const savePromise = AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs));
      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          console.warn('⚠️ Таймаут сохранения логов, пропускаем');
          resolve();
        }, 2000);
      });
      
      await Promise.race([savePromise, timeoutPromise]);
    } catch (error) {
      console.error('Error saving logs:', error);
      // Не бросаем ошибку, просто логируем
    }
  }

  /**
   * Получить эмодзи для уровня лога
   */
  private getEmojiForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return '🔍';
      case LogLevel.INFO: return 'ℹ️';
      case LogLevel.WARN: return '⚠️';
      case LogLevel.ERROR: return '❌';
      default: return '📝';
    }
  }

  /**
   * Debug логи
   */
  debug(category: string, message: string, data?: any) {
    this.addLog(LogLevel.DEBUG, category, message, data);
  }

  /**
   * Info логи
   */
  info(category: string, message: string, data?: any) {
    this.addLog(LogLevel.INFO, category, message, data);
  }

  /**
   * Warning логи
   */
  warn(category: string, message: string, data?: any) {
    this.addLog(LogLevel.WARN, category, message, data);
  }

  /**
   * Error логи
   */
  error(category: string, message: string, data?: any) {
    this.addLog(LogLevel.ERROR, category, message, data);
  }

  /**
   * Получить все логи
   */
  async getAllLogs(): Promise<LogEntry[]> {
    await this.init();
    return [...this.logs].reverse(); // Новые сверху
  }

  /**
   * Получить логи по уровню
   */
  async getLogsByLevel(level: LogLevel): Promise<LogEntry[]> {
    await this.init();
    return this.logs.filter(log => log.level === level).reverse();
  }

  /**
   * Получить логи по категории
   */
  async getLogsByCategory(category: string): Promise<LogEntry[]> {
    await this.init();
    return this.logs.filter(log => log.category === category).reverse();
  }

  /**
   * Получить последние N логов
   */
  async getRecentLogs(count: number = 100): Promise<LogEntry[]> {
    await this.init();
    return this.logs.slice(-count).reverse();
  }

  /**
   * Очистить все логи
   */
  async clearLogs() {
    this.logs = [];
    await AsyncStorage.removeItem(LOG_STORAGE_KEY);
    console.log('🗑️ Все логи очищены');
  }

  /**
   * Экспорт логов в файл
   */
  async exportLogs(): Promise<string | null> {
    try {
      await this.init();
      
      const logsText = this.logs.map(log => {
        const date = new Date(log.timestamp).toLocaleString('ru-RU');
        const dataStr = log.data ? `\n   Data: ${JSON.stringify(log.data, null, 2)}` : '';
        return `[${date}] [${log.level}] [${log.category}] ${log.message}${dataStr}`;
      }).join('\n\n');

      const fileName = `foodhub-logs-${new Date().toISOString().split('T')[0]}.txt`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, logsText, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log('✅ Логи экспортированы:', fileUri);
      return fileUri;
    } catch (error) {
      console.error('❌ Ошибка экспорта логов:', error);
      return null;
    }
  }

  /**
   * Поделиться логами (как текст)
   */
  async shareLogs(): Promise<boolean> {
    try {
      await this.init();
      
      // Форматируем логи как текст
      const logsText = this.logs.slice(-50).map(log => {
        const date = new Date(log.timestamp).toLocaleString('ru-RU');
        const dataStr = log.data ? ` | Data: ${JSON.stringify(log.data)}` : '';
        return `[${date}] [${log.level}] [${log.category}] ${log.message}${dataStr}`;
      }).join('\n');

      const message = `📝 FoodHub Логи (последние 50):\n\n${logsText}`;

      // Используем React Native Share
      const result = await Share.share({
        message,
        title: 'FoodHub Логи',
      });

      if (result.action === Share.sharedAction) {
        console.log('✅ Логи отправлены');
        return true;
      } else {
        console.log('ℹ️ Шаринг отменен');
        return false;
      }
    } catch (error) {
      console.error('❌ Ошибка при шаринге логов:', error);
      return false;
    }
  }

  /**
   * Получить статистику логов
   */
  async getStats() {
    await this.init();
    
    const stats = {
      total: this.logs.length,
      debug: this.logs.filter(l => l.level === LogLevel.DEBUG).length,
      info: this.logs.filter(l => l.level === LogLevel.INFO).length,
      warn: this.logs.filter(l => l.level === LogLevel.WARN).length,
      error: this.logs.filter(l => l.level === LogLevel.ERROR).length,
      categories: Array.from(new Set(this.logs.map(l => l.category))),
      oldestLog: this.logs[0]?.timestamp,
      newestLog: this.logs[this.logs.length - 1]?.timestamp,
    };

    return stats;
  }
}

// Singleton instance
const logger = new Logger();

// НЕ инициализируем при импорте - это может вызывать проблемы на Android 15
// Инициализация будет происходить при первом вызове getAllLogs() или getStats()
// logger.init(); // УБРАНО - вызывается лениво

export default logger;

// Удобные экспорты
export const log = {
  debug: (category: string, message: string, data?: any) => logger.debug(category, message, data),
  info: (category: string, message: string, data?: any) => logger.info(category, message, data),
  warn: (category: string, message: string, data?: any) => logger.warn(category, message, data),
  error: (category: string, message: string, data?: any) => logger.error(category, message, data),
};
