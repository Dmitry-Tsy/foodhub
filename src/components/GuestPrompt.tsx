import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { Button } from './Button';

interface GuestPromptProps {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
  title?: string;
  message?: string;
}

export const GuestPrompt: React.FC<GuestPromptProps> = ({
  visible,
  onClose,
  onLogin,
  title = 'Требуется авторизация',
  message = 'Для выполнения этого действия необходимо войти в систему',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={48} color={Colors.primary} />
              </View>
              
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              
              <View style={styles.buttonContainer}>
                <Button
                  title="Войти"
                  onPress={onLogin}
                  size="medium"
                  style={styles.loginButton}
                />
                
                <Button
                  title="Отмена"
                  onPress={onClose}
                  variant="outline"
                  size="medium"
                  style={styles.cancelButton}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    maxWidth: 400,
  },
  content: {
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: Theme.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: Theme.spacing.sm,
  },
  loginButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});

