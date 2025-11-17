import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/theme';

export const ThemeToggle: React.FC = () => {
  const { themeMode, isDark, colors, setThemeMode } = useTheme();

  const handleToggle = (value: boolean) => {
    setThemeMode(value ? 'dark' : 'light');
  };

  const handleAutoToggle = () => {
    if (themeMode === 'auto') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('light');
    } else {
      setThemeMode('auto');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Ionicons name="moon" size={24} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Тема оформления</Text>
      </View>
      
      <TouchableOpacity
        style={[styles.option, { borderBottomColor: colors.borderLight }]}
        onPress={handleAutoToggle}
        activeOpacity={0.7}
      >
        <View style={styles.optionLeft}>
          <Ionicons
            name={themeMode === 'auto' ? 'phone-portrait' : 'phone-portrait-outline'}
            size={20}
            color={themeMode === 'auto' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.optionText,
              { color: themeMode === 'auto' ? colors.text : colors.textSecondary },
            ]}
          >
            Автоматически
          </Text>
          <Text style={[styles.optionSubtext, { color: colors.textLight }]}>
            Следовать системной теме
          </Text>
        </View>
        {themeMode === 'auto' && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        )}
      </TouchableOpacity>

      <View style={[styles.option, { borderBottomColor: colors.borderLight }]}>
        <View style={styles.optionLeft}>
          <Ionicons
            name={themeMode === 'light' ? 'sunny' : 'sunny-outline'}
            size={20}
            color={themeMode === 'light' ? colors.warning : colors.textSecondary}
          />
          <Text
            style={[
              styles.optionText,
              { color: themeMode === 'light' ? colors.text : colors.textSecondary },
            ]}
          >
            Светлая
          </Text>
        </View>
        <Switch
          value={themeMode === 'light'}
          onValueChange={(value) => setThemeMode(value ? 'light' : themeMode === 'dark' ? 'dark' : 'auto')}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </View>

      <View style={styles.option}>
        <View style={styles.optionLeft}>
          <Ionicons
            name={themeMode === 'dark' ? 'moon' : 'moon-outline'}
            size={20}
            color={themeMode === 'dark' ? colors.secondary : colors.textSecondary}
          />
          <Text
            style={[
              styles.optionText,
              { color: themeMode === 'dark' ? colors.text : colors.textSecondary },
            ]}
          >
            Темная
          </Text>
        </View>
        <Switch
          value={themeMode === 'dark'}
          onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
          trackColor={{ false: colors.border, true: colors.secondary }}
          thumbColor={colors.surface}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
  },
  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  optionText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
  },
  optionSubtext: {
    fontSize: Theme.fontSize.xs,
    marginLeft: Theme.spacing.xs,
  },
});

