import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Achievement, UserAchievement } from '../types/profile';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';

interface AchievementBadgeProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  size?: 'small' | 'medium' | 'large';
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  userAchievement,
  size = 'medium',
}) => {
  const isUnlocked = userAchievement && userAchievement.progress >= 100;
  const progress = userAchievement?.progress || 0;

  const sizeStyles = {
    small: { container: 60, icon: 24, badge: 16 },
    medium: { container: 80, icon: 32, badge: 20 },
    large: { container: 100, icon: 40, badge: 24 },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={[styles.container, { width: currentSize.container, height: currentSize.container }]}>
      <View
        style={[
          styles.iconContainer,
          !isUnlocked && styles.locked,
          { borderRadius: currentSize.container / 2 },
        ]}
      >
        <Ionicons
          name={achievement.icon as any}
          size={currentSize.icon}
          color={isUnlocked ? Colors.warning : Colors.textLight}
        />
        {isUnlocked && achievement.reward && (
          <Text style={[styles.badgeEmoji, { fontSize: currentSize.badge }]}>
            {achievement.reward.badge}
          </Text>
        )}
      </View>
      
      {!isUnlocked && progress > 0 && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      )}
      
      <Text style={styles.name} numberOfLines={2}>
        {achievement.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: Theme.spacing.sm,
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.warning,
    position: 'relative',
  },
  locked: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  badgeEmoji: {
    position: 'absolute',
    bottom: -5,
    right: -5,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    marginTop: Theme.spacing.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.warning,
  },
  name: {
    marginTop: Theme.spacing.xs,
    fontSize: Theme.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

