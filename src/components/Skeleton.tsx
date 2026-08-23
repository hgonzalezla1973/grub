import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { colors } from '../theme/tokens';

interface BlockProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: any;
}

export function SkeletonBlock({ width = '100%', height = 16, radius = 8, style }: BlockProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 550, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 550, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius: radius,
          backgroundColor: 'rgba(0,0,0,0.09)',
          borderWidth: 2,
          borderColor: 'rgba(0,0,0,0.15)',
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonRestaurantCard() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.15)',
        borderRadius: 20,
        padding: 10,
      }}
    >
      <SkeletonBlock height={88} radius={14} style={{ marginBottom: 10 }} />
      <SkeletonBlock height={18} width="80%" radius={6} style={{ marginBottom: 8 }} />
      <SkeletonBlock height={12} width="55%" radius={6} style={{ marginBottom: 10 }} />
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <SkeletonBlock height={20} width={44} radius={100} />
        <SkeletonBlock height={20} width={44} radius={100} />
      </View>
    </View>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  const rows = [];
  for (let i = 0; i < count; i += 2) {
    rows.push(
      <View key={i} style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <SkeletonRestaurantCard />
        {i + 1 < count ? <SkeletonRestaurantCard /> : <View style={{ flex: 1 }} />}
      </View>
    );
  }
  return <View>{rows}</View>;
}

export function SkeletonDetail() {
  return (
    <View style={{ flex: 1 }}>
      <SkeletonBlock height={200} radius={0} />
      <View style={{ padding: 20 }}>
        <SkeletonBlock height={36} width="70%" radius={8} style={{ marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 16 }}>
          <SkeletonBlock height={24} width={70} radius={100} />
          <SkeletonBlock height={24} width={50} radius={100} />
          <SkeletonBlock height={24} width={90} radius={100} />
        </View>
        <SkeletonBlock height={14} width="90%" radius={6} style={{ marginBottom: 8 }} />
        <SkeletonBlock height={14} width="60%" radius={6} style={{ marginBottom: 20 }} />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
          <SkeletonBlock height={44} radius={100} style={{ flex: 1 }} />
          <SkeletonBlock height={44} radius={100} style={{ flex: 1 }} />
          <SkeletonBlock height={44} radius={100} style={{ flex: 1 }} />
        </View>
        <SkeletonBlock height={100} radius={20} style={{ marginBottom: 24 }} />
        <SkeletonBlock height={50} radius={16} style={{ marginBottom: 8 }} />
        <SkeletonBlock height={50} radius={16} style={{ marginBottom: 8 }} />
        <SkeletonBlock height={50} radius={16} />
      </View>
    </View>
  );
}
