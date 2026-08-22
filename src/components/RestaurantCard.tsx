import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { cardColors } from '../theme/tokens';
import { DIET_LABEL, priceLabel, Restaurant, RESTAURANTS } from '../data/restaurants';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { FavoriteButton } from './FavoriteButton';
import { Badge } from './Badge';
import { useApp } from '../state/AppState';

export function colorForRestaurant(r: Restaurant) {
  const idx = RESTAURANTS.findIndex((x) => x.id === r.id);
  return cardColors[idx % cardColors.length];
}

interface Props {
  restaurant: Restaurant;
  style?: any;
}

export function RestaurantCard({ restaurant: r, style }: Props) {
  const app = useApp();
  const favorite = app.favorites.includes(r.id);

  return (
    <Pressable
      onPress={() => app.openDetail(r.id)}
      style={[
        {
          backgroundColor: colorForRestaurant(r),
          borderWidth: 2,
          borderColor: colors.black,
          borderRadius: 20,
          padding: 10,
          shadowColor: colors.black,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
        },
        style,
      ]}
    >
      <View style={{ position: 'relative', marginBottom: 8 }}>
        <PhotoPlaceholder height={88} radius={14} onColor />
        <FavoriteButton
          active={favorite}
          onPress={() => app.toggleFavorite(r.id)}
          size={26}
          style={{ position: 'absolute', top: 6, right: 6 }}
        />
      </View>
      <Text style={{ fontFamily: fonts.display800, fontSize: 23, fontWeight: '800', textTransform: 'uppercase', lineHeight: 24.8 }} numberOfLines={1}>
        {r.name}
      </Text>
      <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 12.5, fontWeight: '600', opacity: 0.75, marginTop: 2, marginBottom: 8 }} numberOfLines={1}>
        {r.cuisine} · {priceLabel(r.price)}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        <Badge label={`★ ${r.rating}`} />
        <Badge label={`${r.distance} mi`} />
        <Badge label={DIET_LABEL[r.dietCategory]} filled />
      </View>
    </Pressable>
  );
}
