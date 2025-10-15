import React from 'react';
import { render } from '@testing-library/react-native';
import VoiceChangerScreen from '../app/index';

describe('VoiceChangerScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<VoiceChangerScreen />);
    expect(getByText('Modificador de Voz')).toBeTruthy();
  });
});
