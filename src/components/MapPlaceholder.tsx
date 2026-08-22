import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';
import { colors } from '../theme/tokens';
import { isGem, Restaurant } from '../data/restaurants';
import { useApp } from '../state/AppState';
import { PeekCard } from './PeekCard';

export function MapPlaceholder({ restaurants }: { restaurants: Restaurant[] }) {
  const app = useApp();

  return (
    <View
      style={{
        flex: 1,
        borderWidth: 2,
        borderColor: colors.black,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: colors.mapSurface,
      }}
    >
      <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <Defs>
          <Pattern id="mapGrid" patternUnits="userSpaceOnUse" width={28} height={28}>
            <Rect width={28} height={28} fill={colors.mapSurface} />
            <Line x1={0} y1={0} x2={28} y2={0} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
            <Line x1={0} y1={0} x2={0} y2={28} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#mapGrid)" />
      </Svg>

      {restaurants.map((r, i) => {
        const left = `${15 + ((i * 17) % 70)}%`;
        const top = `${18 + ((i * 23) % 52)}%`;
        const selected = app.peekId === r.id;
        return (
          <Pressable
            key={r.id}
            onPress={() => app.setPeek(r.id)}
            style={{ position: 'absolute', left: left as any, top: top as any }}
            hitSlop={10}
          >
            <Text style={{ fontSize: selected ? 34 : 27 }}>{isGem(r) ? '💎' : '📍'}</Text>
          </Pressable>
        );
      })}

      {app.peekRestaurant && <PeekCard restaurant={app.peekRestaurant} />}
    </View>
  );
}
