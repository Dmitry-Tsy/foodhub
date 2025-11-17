import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'sunset' | 'ocean';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const gradients: Record<string, string[]> = {
    primary: Theme.gradients.primary,
    secondary: Theme.gradients.secondary,
    sunset: Theme.gradients.sunset,
    ocean: Theme.gradients.ocean,
  };

  const gradientColors = gradients[variant] || Theme.gradients.primary;

  const sizeStyles = {
    small: { paddingVertical: Theme.spacing.sm, paddingHorizontal: Theme.spacing.md },
    medium: { paddingVertical: Theme.spacing.md, paddingHorizontal: Theme.spacing.lg },
    large: { paddingVertical: Theme.spacing.lg, paddingHorizontal: Theme.spacing.xl },
  };

  const textSizeStyles = {
    small: Theme.fontSize.sm,
    medium: Theme.fontSize.md,
    large: Theme.fontSize.lg,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[style, disabled && { opacity: 0.5 }]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          sizeStyles[size],
          { borderRadius: Theme.borderRadius.md },
          Theme.shadows.md,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textInverse} />
        ) : (
          <Text style={[styles.text, { fontSize: textSizeStyles[size] }, textStyle]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textInverse,
  },
});

