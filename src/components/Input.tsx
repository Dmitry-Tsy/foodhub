import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  isPassword = false,
  style,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, error && styles.inputContainer_error]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={Theme.colors.textSecondary}
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Theme.colors.textLight}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.md,
  },
  inputContainer_error: {
    borderColor: Theme.colors.error,
  },
  icon: {
    marginRight: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    paddingVertical: Theme.spacing.md,
  },
  eyeIcon: {
    padding: Theme.spacing.xs,
  },
  error: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.error,
    marginTop: Theme.spacing.xs,
  },
});

