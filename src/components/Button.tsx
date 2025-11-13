import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary : Colors.background}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.sm,
  },
  button_primary: {
    backgroundColor: Colors.primary,
  },
  button_secondary: {
    backgroundColor: Colors.secondary,
  },
  button_outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  button_small: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  button_medium: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  button_large: {
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.xl,
  },
  button_disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: Theme.fontWeight.semibold,
  },
  text_primary: {
    color: Colors.background,
  },
  text_secondary: {
    color: Colors.background,
  },
  text_outline: {
    color: Colors.primary,
  },
  text_small: {
    fontSize: Theme.fontSize.sm,
  },
  text_medium: {
    fontSize: Theme.fontSize.md,
  },
  text_large: {
    fontSize: Theme.fontSize.lg,
  },
  text_disabled: {
    color: Colors.textLight,
  },
});

