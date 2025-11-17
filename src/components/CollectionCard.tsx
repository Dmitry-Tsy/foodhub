import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Collection } from '../types';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';
import { scaleIn } from '../utils/animations';
import { useTheme } from '../contexts/ThemeContext';

interface CollectionCardProps {
  collection: Collection;
  onPress: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onPress }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scaleIn(scaleAnim, 300).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: scaleAnim }}>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.imageContainer}>
          {collection.coverPhoto ? (
            <>
              <Image source={{ uri: collection.coverPhoto }} style={styles.image} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)']}
                style={styles.imageGradient}
              />
            </>
          ) : (
            <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name="albums" size={48} color={colors.textLight} />
            </View>
          )}
          <View style={styles.overlay}>
            <View style={[styles.badge, { backgroundColor: colors.primary + 'DD' }]}>
              <Ionicons name="restaurant" size={16} color={Colors.textInverse} />
              <Text style={styles.badgeText}>{collection.dishCount}</Text>
            </View>
            {!collection.isPublic && (
              <View style={[styles.privateBadge, { backgroundColor: colors.overlay }]}>
                <Ionicons name="lock-closed" size={14} color={Colors.textInverse} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {collection.name}
          </Text>
          {collection.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
              {collection.description}
            </Text>
          )}
          {collection.user && (
            <View style={styles.footer}>
              <View style={styles.userContainer}>
                {collection.user.avatar ? (
                  <Image source={{ uri: collection.user.avatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: colors.surfaceAlt }]}>
                    <Ionicons name="person" size={12} color={colors.textLight} />
                  </View>
                )}
                <Text style={[styles.username, { color: colors.textSecondary }]} numberOfLines={1}>
                  {collection.user.username}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.borderRadius.xl,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.shadows.lg,
    borderWidth: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: Theme.spacing.md,
    left: Theme.spacing.md,
    right: Theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    gap: 4,
    ...Theme.shadows.md,
  },
  badgeText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.textInverse,
  },
  privateBadge: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  content: {
    padding: Theme.spacing.lg,
  },
  name: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: Theme.spacing.xs,
    lineHeight: 24,
  },
  description: {
    fontSize: Theme.fontSize.md,
    marginBottom: Theme.spacing.md,
    lineHeight: 20,
  },
  footer: {
    marginTop: Theme.spacing.sm,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: Theme.borderRadius.round,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: Theme.fontSize.sm,
    flex: 1,
  },
});

