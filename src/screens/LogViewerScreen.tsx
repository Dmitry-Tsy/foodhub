import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import logger, { LogEntry, LogLevel } from '../services/logger';

const LogViewerScreen = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Устанавливаем флаг монтирования после первого рендера
    setIsMounted(true);
    // Загружаем логи с небольшой задержкой для Android 15
    const timer = setTimeout(() => {
      loadLogsAndStats();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    // Защита от выполнения до монтирования
    if (!isMounted) return;
    // Защита от выполнения до загрузки логов
    if (isLoading) return;
    
    filterLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs, selectedLevel, searchQuery, isMounted, isLoading]);

  const loadLogsAndStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Защита от выполнения после размонтирования
      if (!isMounted) return;
      
      const [allLogs, logStats] = await Promise.all([
        logger.getAllLogs(),
        logger.getStats(),
      ]);
      
      // Проверяем монтирование перед установкой состояния
      if (!isMounted) return;
      
      setLogs(Array.isArray(allLogs) ? allLogs : []);
      setStats(logStats || { total: 0, error: 0, warn: 0, info: 0, debug: 0 });
    } catch (err: any) {
      console.error('❌ Ошибка загрузки логов:', err);
      
      // Проверяем монтирование перед установкой ошибки
      if (!isMounted) return;
      
      setError(err.message || 'Ошибка загрузки логов');
      setLogs([]);
      setStats({ total: 0, error: 0, warn: 0, info: 0, debug: 0 });
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const loadLogs = async () => {
    try {
      const allLogs = await logger.getAllLogs();
      setLogs(allLogs);
    } catch (err: any) {
      console.error('❌ Ошибка загрузки логов:', err);
    }
  };

  const loadStats = async () => {
    try {
      const logStats = await logger.getStats();
      setStats(logStats);
    } catch (err: any) {
      console.error('❌ Ошибка загрузки статистики:', err);
    }
  };

  const filterLogs = () => {
    try {
      let filtered = logs;

      // Фильтр по уровню
      if (selectedLevel !== 'ALL') {
        filtered = filtered.filter(log => log.level === selectedLevel);
      }

      // Фильтр по поиску
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(log => {
          try {
            const matchesMessage = log.message?.toLowerCase().includes(query) || false;
            const matchesCategory = log.category?.toLowerCase().includes(query) || false;
            let matchesData = false;
            
            if (log.data) {
              try {
                // Безопасный JSON.stringify с защитой от циклических ссылок
                const dataString = JSON.stringify(log.data, (key, value) => {
                  if (typeof value === 'object' && value !== null) {
                    // Ограничиваем глубину для больших объектов
                    if (key && key.length > 100) return '[Object]';
                  }
                  return value;
                });
                matchesData = dataString.toLowerCase().includes(query);
              } catch (e) {
                // Если не удалось сериализовать, пропускаем проверку data
                matchesData = false;
              }
            }
            
            return matchesMessage || matchesCategory || matchesData;
          } catch (e) {
            return false;
          }
        });
      }

      // Ограничиваем количество логов для производительности (последние 500)
      filtered = filtered.slice(-500).reverse();
      
      setFilteredLogs(filtered);
    } catch (e) {
      console.error('Ошибка фильтрации логов:', e);
      setFilteredLogs([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadLogs(), loadStats()]);
    } catch (err) {
      console.error('Ошибка обновления:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearLogs = () => {
    Alert.alert(
      'Очистить логи',
      'Вы уверены? Все логи будут удалены безвозвратно.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            await logger.clearLogs();
            setLogs([]);
            setFilteredLogs([]);
            Alert.alert('Успех', 'Все логи очищены');
          },
        },
      ]
    );
  };

  const handleExportLogs = async () => {
    const success = await logger.shareLogs();
    if (success) {
      Alert.alert('Успех', 'Логи экспортированы');
    } else {
      Alert.alert('Ошибка', 'Не удалось экспортировать логи');
    }
  };

  const getColorForLevel = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG: return Colors.textSecondary;
      case LogLevel.INFO: return Colors.info;
      case LogLevel.WARN: return Colors.warning;
      case LogLevel.ERROR: return Colors.error;
      default: return Colors.text;
    }
  };

  const getIconForLevel = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG: return 'bug';
      case LogLevel.INFO: return 'information-circle';
      case LogLevel.WARN: return 'warning';
      case LogLevel.ERROR: return 'close-circle';
      default: return 'document-text';
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Неверная дата';
      }
      return date.toLocaleString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
      });
    } catch (e) {
      return 'Ошибка даты';
    }
  };

  const renderLogItem = ({ item, index }: { item: LogEntry; index: number }) => {
    try {
      const isExpanded = expandedIndex === index;
      const color = getColorForLevel(item.level);
      const icon = getIconForLevel(item.level);

      // Безопасная сериализация данных
      const renderLogData = () => {
        if (!item.data) return null;
        
        try {
          let dataString: string;
          try {
            // Пытаемся сериализовать с защитой от циклических ссылок
            dataString = JSON.stringify(item.data, (key, value) => {
              // Ограничиваем глубину и размер
              if (typeof value === 'object' && value !== null) {
                if (key && key.length > 50) return '[Object]';
              }
              if (typeof value === 'string' && value.length > 200) {
                return value.substring(0, 200) + '...';
              }
              return value;
            }, 2);
            
            // Ограничиваем общий размер строки
            if (dataString.length > 2000) {
              dataString = dataString.substring(0, 2000) + '\n... (обрезано)';
            }
          } catch (e) {
            dataString = '[Не удалось сериализовать данные]';
          }

          return (
            <View style={styles.logData}>
              <Text style={styles.logDataLabel}>Данные:</Text>
              <Text style={styles.logDataText}>{dataString}</Text>
            </View>
          );
        } catch (e) {
          return (
            <View style={styles.logData}>
              <Text style={styles.logDataLabel}>Ошибка отображения данных</Text>
            </View>
          );
        }
      };

      return (
        <TouchableOpacity
          style={[styles.logItem, { borderLeftColor: color }]}
          onPress={() => setExpandedIndex(isExpanded ? null : index)}
          activeOpacity={0.7}
        >
          <View style={styles.logHeader}>
            <Ionicons name={icon as any} size={16} color={color} />
            <Text style={[styles.logLevel, { color }]}>{item.level}</Text>
            <Text style={styles.logTime}>{formatTimestamp(item.timestamp)}</Text>
          </View>

          <View style={styles.logContent}>
            <Text style={styles.logCategory}>[{item.category || 'N/A'}]</Text>
            <Text style={styles.logMessage} numberOfLines={3}>
              {item.message || 'Нет сообщения'}
            </Text>
          </View>

          {isExpanded && renderLogData()}

          {item.data && (
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={Colors.textSecondary}
              style={styles.expandIcon}
            />
          )}
        </TouchableOpacity>
      );
    } catch (e) {
      // Fallback для проблемных элементов
      return (
        <View style={styles.logItem}>
          <Text style={styles.logMessage}>Ошибка отображения лога</Text>
        </View>
      );
    }
  };

  const renderFilterButton = (level: LogLevel | 'ALL', label: string, count?: number) => {
    const isSelected = selectedLevel === level;
    const color = level === 'ALL' ? Colors.primary : getColorForLevel(level as LogLevel);

    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          isSelected && { backgroundColor: color, borderColor: color },
        ]}
        onPress={() => setSelectedLevel(level)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.filterButtonText,
            isSelected && { color: Colors.textInverse },
          ]}
        >
          {label}
        </Text>
        {count !== undefined && (
          <Text
            style={[
              styles.filterButtonCount,
              isSelected && { color: Colors.textInverse },
            ]}
          >
            {count}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // Защита от рендера до монтирования (важно для Android 15)
  if (!isMounted) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Инициализация...</Text>
        </View>
      </View>
    );
  }

  // Показываем loading если загружаются логи
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка логов...</Text>
        </View>
      </View>
    );
  }

  // Показываем ошибку если не удалось загрузить (но только если есть ошибка и нет логов)
  if (error && (!logs || logs.length === 0)) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={Colors.error} />
          <Text style={styles.errorText}>Ошибка загрузки логов</Text>
          <Text style={styles.errorHint}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadLogsAndStats}
          >
            <Text style={styles.retryButtonText}>Попробовать снова</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Вспомогательные функции для рендера (разбиение для оптимизации)
  const renderHeader = () => {
    try {
      return (
        <View style={styles.header}>
          <Text style={styles.title}>📝 Логи приложения</Text>
          {stats && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.total || 0}</Text>
                <Text style={styles.statLabel}>Всего</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: Colors.error }]}>
                  {stats.error || 0}
                </Text>
                <Text style={styles.statLabel}>Ошибок</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: Colors.warning }]}>
                  {stats.warn || 0}
                </Text>
                <Text style={styles.statLabel}>Предупр.</Text>
              </View>
            </View>
          )}
        </View>
      );
    } catch (e) {
      return (
        <View style={styles.header}>
          <Text style={styles.title}>📝 Логи приложения</Text>
        </View>
      );
    }
  };

  const renderSearchBar = () => {
    try {
      return (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск в логах..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      );
    } catch (e) {
      return null;
    }
  };

  const renderFilters = () => {
    try {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {renderFilterButton('ALL', 'Все', stats?.total)}
          {renderFilterButton(LogLevel.ERROR, 'Ошибки', stats?.error)}
          {renderFilterButton(LogLevel.WARN, 'Предупр.', stats?.warn)}
          {renderFilterButton(LogLevel.INFO, 'Инфо', stats?.info)}
          {renderFilterButton(LogLevel.DEBUG, 'Debug', stats?.debug)}
        </ScrollView>
      );
    } catch (e) {
      return null;
    }
  };

  const renderActions = () => {
    try {
      return (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.exportButton]}
            onPress={handleExportLogs}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={20} color={Colors.textInverse} />
            <Text style={styles.actionButtonText}>Экспорт</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={handleClearLogs}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color={Colors.textInverse} />
            <Text style={styles.actionButtonText}>Очистить</Text>
          </TouchableOpacity>
        </View>
      );
    } catch (e) {
      return null;
    }
  };

  // Финальная защита - проверяем что данные готовы
  if (!isMounted || isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </View>
    );
  }

  try {
    // Убеждаемся что filteredLogs это массив
    const safeFilteredLogs = Array.isArray(filteredLogs) ? filteredLogs : [];
    
    return (
      <View style={styles.container}>
        {renderHeader()}
        {renderSearchBar()}
        {renderFilters()}
        
        {safeFilteredLogs.length > 0 || !searchQuery ? (
          <FlatList
            data={safeFilteredLogs}
            renderItem={renderLogItem}
            keyExtractor={(item, index) => {
              try {
                return `${item.timestamp || Date.now()}-${item.category || 'N/A'}-${index}`;
              } catch (e) {
                return `log-${index}`;
              }
            }}
            contentContainerStyle={styles.logsList}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={3}
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={50}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={64} color={Colors.textLight} />
                <Text style={styles.emptyText}>
                  {searchQuery ? 'Логи не найдены' : 'Логов пока нет'}
                </Text>
                <Text style={styles.emptyHint}>
                  {searchQuery ? 'Попробуйте другой запрос' : 'Логи появятся при использовании приложения'}
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={Colors.primary}
              />
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>Логи не найдены</Text>
            <Text style={styles.emptyHint}>Попробуйте другой запрос</Text>
          </View>
        )}

        {renderActions()}
      </View>
    );
  } catch (e: any) {
    console.error('Критическая ошибка рендера LogViewer:', e);
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={Colors.error} />
          <Text style={styles.errorText}>Ошибка отображения логов</Text>
          <Text style={styles.errorHint}>{e?.message || 'Неизвестная ошибка'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadLogsAndStats}
          >
            <Text style={styles.retryButtonText}>Попробовать снова</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.card,
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Theme.spacing.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    fontSize: Theme.fontSize.md,
    color: Colors.text,
  },
  filtersContainer: {
    maxHeight: 50,
    marginBottom: Theme.spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterButtonText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text,
    fontWeight: Theme.fontWeight.medium,
  },
  filterButtonCount: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
  },
  logsList: {
    padding: Theme.spacing.md,
    paddingBottom: 100,
  },
  logItem: {
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderLeftWidth: 4,
    ...Theme.shadows.sm,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  logLevel: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.bold,
  },
  logTime: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: 'auto',
  },
  logContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
  },
  logCategory: {
    fontSize: Theme.fontSize.sm,
    color: Colors.primary,
    fontWeight: Theme.fontWeight.medium,
  },
  logMessage: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text,
    flex: 1,
  },
  logData: {
    marginTop: Theme.spacing.sm,
    padding: Theme.spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.sm,
  },
  logDataLabel: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  logDataText: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text,
    fontFamily: 'monospace',
  },
  expandIcon: {
    position: 'absolute',
    right: Theme.spacing.sm,
    bottom: Theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl * 2,
  },
  emptyText: {
    fontSize: Theme.fontSize.lg,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
    fontWeight: Theme.fontWeight.medium,
  },
  emptyHint: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textLight,
    marginTop: Theme.spacing.xs,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Theme.spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.sm,
  },
  exportButton: {
    backgroundColor: Colors.primary,
  },
  clearButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    color: Colors.textInverse,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Theme.fontSize.lg,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  errorText: {
    fontSize: Theme.fontSize.lg,
    color: Colors.error,
    marginTop: Theme.spacing.md,
    fontWeight: Theme.fontWeight.bold,
  },
  errorHint: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Theme.spacing.xs,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Theme.borderRadius.md,
  },
  retryButtonText: {
    color: Colors.textInverse,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
  },
});

export default LogViewerScreen;
