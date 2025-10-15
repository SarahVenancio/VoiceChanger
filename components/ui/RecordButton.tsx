import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

export function RecordButton({ isRecording, onPress }: RecordButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulseRing, animatedStyle]}>
        <View style={[styles.outerRing, isRecording && styles.recordingRing]} />
      </Animated.View>
      
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <MaterialIcons
          name={isRecording ? 'stop' : 'mic'}
          size={48}
          color={colors.text}
        />
      </TouchableOpacity>

      <Text style={styles.label}>
        {isRecording ? 'Parar Gravação' : 'Iniciar Gravação'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
    borderWidth: 3,
    borderColor: colors.primary,
    opacity: 0.3,
  },
  recordingRing: {
    borderColor: colors.recording,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  recordingButton: {
    backgroundColor: colors.recording,
  },
  label: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
});
