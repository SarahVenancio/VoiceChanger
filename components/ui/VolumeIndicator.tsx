import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius } from '../../constants/theme';

interface VolumeIndicatorProps {
  level: number;
  duration: string;
  isVisible: boolean;
}

export function VolumeIndicator({ level, duration, isVisible }: VolumeIndicatorProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withSpring((level / 100) * 100, {
      damping: 15,
      stiffness: 150,
    });
  }, [level]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.recordingDot} />
        <Text style={styles.durationText}>{duration}</Text>
      </View>

      <View style={styles.volumeBar}>
        <Animated.View style={[styles.volumeFill, animatedStyle]} />
      </View>

      <Text style={styles.label}>Gravando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.recording,
    marginRight: spacing.sm,
  },
  durationText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
  },
  volumeBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: colors.recording,
    borderRadius: borderRadius.sm,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
