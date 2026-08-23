import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';

interface Props {
  icon: string;
  title: string;
  detail: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: any;
}

export function EmptyState({ icon, title, detail, actionLabel, onAction, style }: Props) {
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }, style]}>
      <Text style={{ fontSize: 44, marginBottom: 12 }}>{icon}</Text>
      <Text
        style={{
          fontFamily: fonts.display800,
          fontSize: 22,
          fontWeight: '800',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        {title}
      </Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 14, opacity: 0.7, textAlign: 'center', lineHeight: 19.6, marginBottom: actionLabel ? 18 : 0 }}>
        {detail}
      </Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={{
            backgroundColor: colors.black,
            borderRadius: 100,
            paddingVertical: 12,
            paddingHorizontal: 22,
          }}
        >
          <Text style={{ fontFamily: fonts.display800, fontSize: 14, fontWeight: '800', color: colors.white, textTransform: 'uppercase' }}>
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
