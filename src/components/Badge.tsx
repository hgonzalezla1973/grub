import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';

interface BadgeProps {
  label: string;
  filled?: boolean;
  bg?: string;
  textColor?: string;
}

export function Badge({ label, filled = false, bg, textColor }: BadgeProps) {
  const backgroundColor = bg ?? (filled ? colors.black : colors.white);
  const color = textColor ?? (filled ? colors.white : colors.black);
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 9,
        borderRadius: 100,
        borderWidth: 1.5,
        borderColor: colors.black,
        backgroundColor,
      }}
    >
      <Text
        style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, fontWeight: '700', color }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export function MicroBadgeRow({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{children}</View>;
}
