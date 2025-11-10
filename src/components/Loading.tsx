import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/theme';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ text, fullScreen = false }) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Theme.colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  container: {
    padding: Theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
  },
});

