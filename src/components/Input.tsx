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
import { Colors } from '../constants/colors';

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
            color={Colors.textSecondary}
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textLight}
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
              color={Colors.textSecondary}
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
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Theme.spacing.md,
  },
  inputContainer_error: {
    borderColor: Colors.error,
  },
  icon: {
    marginRight: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    paddingVertical: Theme.spacing.md,
  },
  eyeIcon: {
    padding: Theme.spacing.xs,
  },
  error: {
    fontSize: Theme.fontSize.sm,
    color: Colors.error,
    marginTop: Theme.spacing.xs,
  },
});

