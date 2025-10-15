import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VoiceEffect } from '../../constants/effects';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

interface EffectButtonProps {
  effect: VoiceEffect;
  isSelected: boolean;
  isPlaying: boolean;
  onPress: () => void;
}

export function EffectButton({ effect, isSelected, isPlaying, onPress }: EffectButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selected,
        isPlaying && styles.playing,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isSelected && styles.selectedIcon]}>
        <Ionicons
          name={effect.icon as any}
          size={28}
          color={isSelected ? colors.text : colors.textSecondary}
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[styles.name, isSelected && styles.selectedText]}>
          {effect.name}
        </Text>
        <Text style={styles.description}>{effect.description}</Text>
      </View>

      {isPlaying && (
        <View style={styles.playingIndicator}>
          <Ionicons name="play" size={16} color={colors.playing} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: colors.secondary,
    backgroundColor: colors.cardBackground,
    ...shadows.medium,
  },
  playing: {
    borderColor: colors.playing,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  selectedIcon: {
    backgroundColor: colors.secondary,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  selectedText: {
    color: colors.secondary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  playingIndicator: {
    marginLeft: spacing.sm,
  },
});
