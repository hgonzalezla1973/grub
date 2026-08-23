import { type CSSProperties } from 'react';
import { colors } from '../theme/tokens';
import type { Restaurant } from '../data/restaurants';
import { photoUrl } from '../services/googlePlaces';
import { PhotoPlaceholder } from './PhotoPlaceholder';

interface Props {
  restaurant: Restaurant;
  width?: number | string;
  height?: number | string;
  radius?: number;
  bordered?: boolean;
  onColor?: boolean;
  baseColor?: string;
  style?: CSSProperties;
}

/** Real photo when the restaurant came from a live search (a direct URL from Yelp,
 *  or one built from Google's photo reference); the neo-brutalist stripe placeholder
 *  otherwise (sample data has no real photo). */
export function RestaurantPhoto({
  restaurant,
  width = '100%',
  height = '100%',
  radius = 14,
  bordered = true,
  onColor = false,
  baseColor,
  style,
}: Props) {
  const src = restaurant.photoUrl ?? (restaurant.photoName ? photoUrl(restaurant.photoName, 640) : undefined);

  if (!src) {
    return (
      <PhotoPlaceholder width={width} height={height} radius={radius} bordered={bordered} onColor={onColor} baseColor={baseColor} style={style} />
    );
  }

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: 'hidden',
        background: colors.mapSurface,
        ...(bordered ? { borderWidth: 2, borderStyle: 'solid', borderColor: colors.black } : {}),
        ...style,
      }}
    >
      <img
        src={src}
        alt={restaurant.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}
