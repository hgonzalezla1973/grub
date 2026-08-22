import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { priceLabel, Restaurant } from '../data/restaurants';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { useApp } from '../state/AppState';

export function PeekCard({ restaurant }: { restaurant: Restaurant }) {
  const app = useApp();
  return (
    <View
      style={{
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: 10,
        backgroundColor: colors.coral,
        borderWidth: 2,
        borderColor: colors.black,
        borderRadius: 18,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
      }}
    >
      <PhotoPlaceholder width={46} height={46} radius={12} onColor />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: fonts.display800, fontSize: 22, fontWeight: '800', textTransform: 'uppercase', lineHeight: 23.6 }} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 12.5, fontWeight: '600', opacity: 0.8, marginTop: 2 }}>
          ★ {restaurant.rating} · {priceLabel(restaurant.price)} · {restaurant.distance} mi
        </Text>
      </View>
      <Pressable
        onPress={() => app.openDetail(restaurant.id)}
        style={{ backgroundColor: colors.black, borderRadius: 100, paddingVertical: 10, paddingHorizontal: 16 }}
      >
        <Text style={{ fontFamily: fonts.display800, fontSize: 14, fontWeight: '800', color: colors.white, textTransform: 'uppercase' }}>
          View
        </Text>
      </Pressable>
    </View>
  );
}
