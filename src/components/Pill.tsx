import React from 'react';
import { Pressable, Text, ViewStyle, StyleProp } from 'react-native';
import { colors, fonts } from '../theme/tokens';

type Variant = 'primary' | 'outline' | 'white';

interface PillProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  labelColor?: string;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function Pill({ label, onPress, variant = 'primary', labelColor, fontSize = 22, style, disabled }: PillProps) {
  const bg = variant === 'primary' ? colors.black : variant === 'white' ? colors.white : 'transparent';
  const textColor = labelColor ?? (variant === 'primary' ? colors.white : colors.black);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: '100%',
          paddingVertical: 17,
          borderRadius: 100,
          borderWidth: 2,
          borderColor: colors.black,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: fonts.display800,
          fontSize,
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
          color: textColor,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
