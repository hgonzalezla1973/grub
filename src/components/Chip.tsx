import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexShrink: 0,
        paddingVertical: 9,
        paddingHorizontal: 15,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.black,
        backgroundColor: active ? colors.black : colors.white,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.bodyBold,
          fontSize: 12.5,
          fontWeight: '700',
          color: active ? colors.white : colors.black,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  style?: any;
}

export function SegmentedControl<T extends string>({ options, value, onChange, style }: SegmentedControlProps<T>) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          gap: 6,
          backgroundColor: colors.white,
          padding: 4,
          borderRadius: 100,
          borderWidth: 2,
          borderColor: colors.black,
          flexShrink: 0,
        },
        style,
      ]}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 100,
              backgroundColor: active ? colors.black : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: fonts.bodyBold,
                fontSize: 12.5,
                fontWeight: '700',
                color: active ? colors.white : colors.black,
              }}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
