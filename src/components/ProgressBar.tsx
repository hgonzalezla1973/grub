import React from 'react';
import { View } from 'react-native';
import { colors } from '../theme/tokens';

interface Props {
  progress: number;
  height?: number;
  trackColor?: string;
}

export function ProgressBar({ progress, height = 16, trackColor = colors.white }: Props) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View
      style={{
        height,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.black,
        backgroundColor: trackColor,
        overflow: 'hidden',
      }}
    >
      <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: colors.black }} />
    </View>
  );
}
