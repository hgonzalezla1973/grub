import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';
import { colors, fonts } from '../theme/tokens';
import { isGem, Restaurant } from '../data/restaurants';
import { useApp } from '../state/AppState';
import { hashBearing } from '../utils/geo';
import { PeekCard } from './PeekCard';

/** When real geo data is available, radiate pins outward from a "you are here" center
 *  by real bearing/relative-distance; otherwise fall back to a fixed scatter layout. */
function pinPosition(r: Restaurant, i: number, maxDistance: number, hasGeo: boolean) {
  if (hasGeo && r.lat !== undefined) {
    const bearing = hashBearing(r.id);
    const radius = Math.min(0.42, (r.distance / maxDistance) * 0.42);
    const rad = (bearing * Math.PI) / 180;
    return {
      left: `${50 + Math.sin(rad) * radius * 100}%`,
      top: `${50 - Math.cos(rad) * radius * 100}%`,
    };
  }
  return {
    left: `${15 + ((i * 17) % 70)}%`,
    top: `${18 + ((i * 23) % 52)}%`,
  };
}

export function MapPlaceholder({ restaurants }: { restaurants: Restaurant[] }) {
  const app = useApp();
  const hasGeo = app.hasLiveLocation;
  const maxDistance = Math.max(1, ...restaurants.map((r) => r.distance));

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

      {hasGeo && (
        <View
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -9,
            marginTop: -9,
            alignItems: 'center',
          }}
          pointerEvents="none"
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.blue,
              borderWidth: 2,
              borderColor: colors.black,
            }}
          />
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10, fontWeight: '700', marginTop: 2 }}>You</Text>
        </View>
      )}

      {restaurants.map((r, i) => {
        const { left, top } = pinPosition(r, i, maxDistance, hasGeo);
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
