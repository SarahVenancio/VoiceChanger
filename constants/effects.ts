export interface VoiceEffect {
  id: string;
  name: string;
  icon: string;
  description: string;
  pitchRate: number;
  speed: number;
}

export const VOICE_EFFECTS: VoiceEffect[] = [
  {
    id: 'normal',
    name: 'Normal',
    icon: 'person',
    description: 'Voz original',
    pitchRate: 1.0,
    speed: 1.0,
  },
  {
    id: 'chipmunk',
    name: 'Voz Fina',
    icon: 'arrow-up',
    description: 'Tom agudo e rápido',
    pitchRate: 1.5,
    speed: 1.5,
  },
  {
    id: 'deep',
    name: 'Voz Grossa',
    icon: 'arrow-down',
    description: 'Tom grave e lento',
    pitchRate: 0.7,
    speed: 0.7,
  },
  {
    id: 'robot',
    name: 'Robô',
    icon: 'settings',
    description: 'Voz robótica',
    pitchRate: 0.9,
    speed: 0.95,
  },
  {
    id: 'fast',
    name: 'Rápido',
    icon: 'flash',
    description: 'Velocidade acelerada',
    pitchRate: 1.3,
    speed: 1.8,
  },
  {
    id: 'slow',
    name: 'Lento',
    icon: 'hourglass',
    description: 'Velocidade reduzida',
    pitchRate: 0.8,
    speed: 0.5,
  },
];
