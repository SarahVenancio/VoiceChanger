import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useVoiceChanger } from '../hooks/useVoiceChanger';
import { RecordButton, VolumeIndicator, EffectButton } from '../components';
import { VOICE_EFFECTS } from '../constants/effects';
import { colors, spacing, borderRadius } from '../constants/theme';

export default function VoiceChangerScreen() {
  const insets = useSafeAreaInsets();
  const {
    recordingState,
    playbackState,
    selectedEffect,
    recordingDuration,
    audioLevel,
    startRecording,
    stopRecording,
    playWithEffect,
    resetRecording,
    formatDuration,
  } = useVoiceChanger();

  const handleRecordPress = () => {
    if (recordingState === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.background, '#0F3460']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + spacing.md },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <MaterialIcons name="mic" size={32} color={colors.secondary} />
            <Text style={styles.title}>Mudador de Voz</Text>
          </View>

          {/* Volume Indicator */}
          <VolumeIndicator
            level={audioLevel}
            duration={formatDuration(recordingDuration)}
            isVisible={recordingState === 'recording'}
          />

          {/* Record Button */}
          <View style={styles.recordSection}>
            <RecordButton
              isRecording={recordingState === 'recording'}
              onPress={handleRecordPress}
            />
          </View>

          {/* Effects Section */}
          {recordingState === 'recorded' && (
            <View style={styles.effectsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Escolha um Efeito</Text>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetRecording}
                >
                  <MaterialIcons name="refresh" size={20} color={colors.text} />
                  <Text style={styles.resetText}>Nova Gravação</Text>
                </TouchableOpacity>
              </View>

              {VOICE_EFFECTS.map((effect) => (
                <EffectButton
                  key={effect.id}
                  effect={effect}
                  isSelected={selectedEffect.id === effect.id}
                  isPlaying={
                    playbackState === 'playing' && selectedEffect.id === effect.id
                  }
                  onPress={() => playWithEffect(effect)}
                />
              ))}
            </View>
          )}

          {/* Instructions */}
          {recordingState === 'idle' && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Como usar:</Text>
              <View style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>1</Text>
                <Text style={styles.instructionText}>
                  Toque no botão para iniciar a gravação
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>2</Text>
                <Text style={styles.instructionText}>
                  Fale no microfone do seu dispositivo
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>3</Text>
                <Text style={styles.instructionText}>
                  Toque novamente para parar a gravação
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>4</Text>
                <Text style={styles.instructionText}>
                  Escolha um efeito e ouça sua voz transformada
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  recordSection: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  effectsSection: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  resetText: {
    color: colors.text,
    marginLeft: spacing.xs,
    fontSize: 14,
    fontWeight: '500',
  },
  instructionsContainer: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
    color: colors.background,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: 'bold',
    marginRight: spacing.md,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
