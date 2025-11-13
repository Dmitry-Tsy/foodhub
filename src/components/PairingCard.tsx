import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pairing } from '../types/profile';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';

interface PairingCardProps {
  pairing: Pairing;
  onVote?: (positive: boolean) => void;
}

export const PairingCard: React.FC<PairingCardProps> = ({ pairing, onVote }) => {
  const drinkIcons: Record<Pairing['drinkType'], string> = {
    wine: 'wine',
    beer: 'beer',
    cocktail: 'bonfire',
    sake: 'flask',
    tea: 'cafe',
    other: 'water',
  };

  const confidenceColor = 
    pairing.confidence >= 80 ? Colors.success :
    pairing.confidence >= 60 ? Colors.warning :
    Colors.textSecondary;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={drinkIcons[pairing.drinkType] as any}
            size={32}
            color={Colors.primary}
          />
        </View>
        
        <View style={styles.headerText}>
          <Text style={styles.drinkName}>{pairing.drink}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.confidenceBadge, { backgroundColor: `${confidenceColor}20` }]}>
              <Text style={[styles.confidenceText, { color: confidenceColor }]}>
                {pairing.confidence}% совпадение
              </Text>
            </View>
            {pairing.addedBy === 'ai' && (
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={12} color={Colors.secondary} />
                <Text style={styles.aiText}>AI</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.reason}>{pairing.reason}</Text>

      {onVote && (
        <View style={styles.voteContainer}>
          <TouchableOpacity
            style={styles.voteButton}
            onPress={() => onVote(true)}
          >
            <Ionicons name="thumbs-up-outline" size={20} color={Colors.success} />
            <Text style={styles.voteText}>Согласен</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.voteButton}
            onPress={() => onVote(false)}
          >
            <Ionicons name="thumbs-down-outline" size={20} color={Colors.error} />
            <Text style={styles.voteText}>Не согласен</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: Theme.spacing.md,
    justifyContent: 'center',
  },
  drinkName: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Theme.spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  confidenceBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  confidenceText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.medium,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.secondary}10`,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  aiText: {
    fontSize: Theme.fontSize.xs,
    color: Colors.secondary,
    fontWeight: Theme.fontWeight.medium,
  },
  reason: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  voteContainer: {
    flexDirection: 'row',
    marginTop: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  voteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surfaceAlt,
  },
  voteText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text,
  },
});

