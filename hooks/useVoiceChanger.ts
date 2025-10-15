import { useState, useEffect, useRef } from 'react';
import { audioService } from '../services/audioService';
import { VoiceEffect, VOICE_EFFECTS } from '../constants/effects';
import { Platform, Alert } from 'react-native';

type RecordingState = 'idle' | 'recording' | 'recorded';
type PlaybackState = 'idle' | 'playing';

export function useVoiceChanger() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [selectedEffect, setSelectedEffect] = useState<VoiceEffect>(VOICE_EFFECTS[0]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkPermissions();
    return () => {
      cleanup();
    };
  }, []);

  const checkPermissions = async () => {
    const granted = await audioService.requestPermissions();
    setHasPermission(granted);
    if (!granted) {
      showAlert('Permissão Necessária', 'O aplicativo precisa de permissão para acessar o microfone.');
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const startRecording = async () => {
    if (!hasPermission) {
      showAlert('Sem Permissão', 'Por favor, conceda permissão para usar o microfone.');
      return;
    }

    try {
      await audioService.startRecording();
      setRecordingState('recording');
      setRecordingDuration(0);

      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      audioLevelIntervalRef.current = setInterval(async () => {
        const status = await audioService.getRecordingStatus();
        if (status && 'metering' in status && status.metering !== undefined) {
          const normalized = Math.max(0, Math.min(100, (status.metering + 160) * 2));
          setAudioLevel(normalized);
        } else {
          const randomLevel = Math.random() * 60 + 20;
          setAudioLevel(randomLevel);
        }
      }, 100);
    } catch (error) {
      showAlert('Erro', 'Falha ao iniciar gravação. Tente novamente.');
      console.error(error);
    }
  };

  const stopRecording = async () => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
        audioLevelIntervalRef.current = null;
      }

      setAudioLevel(0);
      await audioService.stopRecording();
      setRecordingState('recorded');
    } catch (error) {
      showAlert('Erro', 'Falha ao parar gravação.');
      console.error(error);
    }
  };

  const playWithEffect = async (effect: VoiceEffect) => {
    if (recordingState !== 'recorded') {
      return;
    }

    try {
      setSelectedEffect(effect);
      setPlaybackState('playing');
      await audioService.playWithEffect(effect);
      
      setTimeout(() => {
        setPlaybackState('idle');
      }, recordingDuration * 1000 / effect.speed);
    } catch (error) {
      showAlert('Erro', 'Falha ao reproduzir áudio.');
      setPlaybackState('idle');
      console.error(error);
    }
  };

  const stopPlayback = async () => {
    try {
      await audioService.stopPlayback();
      setPlaybackState('idle');
    } catch (error) {
      console.error(error);
    }
  };

  const resetRecording = () => {
    setRecordingState('idle');
    setRecordingDuration(0);
    setAudioLevel(0);
    setSelectedEffect(VOICE_EFFECTS[0]);
  };

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
    }
    audioService.cleanup();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    recordingState,
    playbackState,
    selectedEffect,
    recordingDuration,
    audioLevel,
    hasPermission,
    startRecording,
    stopRecording,
    playWithEffect,
    stopPlayback,
    resetRecording,
    formatDuration,
  };
}
