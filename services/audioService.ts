import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { VoiceEffect } from '../constants/effects';

class AudioService {
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private recordingUri: string | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async startRecording(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<string | null> {
    if (!this.recording) {
      return null;
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recordingUri = uri;
      this.recording = null;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  async getRecordingStatus() {
    if (!this.recording) {
      return null;
    }
    return await this.recording.getStatusAsync();
  }

  async playWithEffect(effect: VoiceEffect): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      if (!this.recordingUri) {
        throw new Error('No recording available');
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: this.recordingUri },
        { 
          shouldPlay: true,
          rate: effect.speed,
          pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
        }
      );

      this.sound = sound;

      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          this.sound?.unloadAsync();
          this.sound = null;
        }
      });
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  async stopPlayback(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }

  async cleanup(): Promise<void> {
    if (this.recording) {
      await this.recording.stopAndUnloadAsync();
      this.recording = null;
    }
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }

  getRecordingUri(): string | null {
    return this.recordingUri;
  }

  isPlaying(): boolean {
    return this.sound !== null;
  }
}

export const audioService = new AudioService();
