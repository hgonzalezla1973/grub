import React from 'react';
import { Pressable, Text } from 'react-native';
import { colors } from '../theme/tokens';

interface Props {
  active: boolean;
  onPress: (e?: any) => void;
  size?: number;
  style?: any;
}

export function FavoriteButton({ active, onPress, size = 26, style }: Props) {
  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation?.();
        onPress(e);
      }}
      hitSlop={8}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.white,
          borderWidth: 2,
          borderColor: colors.black,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.52, color: active ? colors.heartActive : colors.black, lineHeight: size * 0.6 }}>
        {active ? '♥' : '♡'}
      </Text>
    </Pressable>
  );
}
