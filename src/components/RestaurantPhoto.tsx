import React from 'react';
import { Image, View, DimensionValue } from 'react-native';
import { colors } from '../theme/tokens';
import { Restaurant } from '../data/restaurants';
import { photoUrl } from '../services/googlePlaces';
import { PhotoPlaceholder } from './PhotoPlaceholder';

interface Props {
  restaurant: Restaurant;
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  bordered?: boolean;
  onColor?: boolean;
  baseColor?: string;
  style?: any;
}

/** Real Google Places photo when the restaurant came from a live search; the
 *  neo-brutalist stripe placeholder otherwise (sample data has no real photo). */
export function RestaurantPhoto({ restaurant, width = '100%', height = '100%', radius = 14, bordered = true, onColor = false, baseColor, style }: Props) {
  if (!restaurant.photoName) {
    return (
      <PhotoPlaceholder width={width} height={height} radius={radius} bordered={bordered} onColor={onColor} baseColor={baseColor} style={style} />
    );
  }

  return (
    <View
      style={[
        { width, height, borderRadius: radius, overflow: 'hidden', backgroundColor: colors.mapSurface },
        bordered && { borderWidth: 2, borderColor: colors.black },
        style,
      ]}
    >
      <Image source={{ uri: photoUrl(restaurant.photoName, 640) }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
    </View>
  );
}
