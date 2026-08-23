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

/** Real Google Places photo when the restaurant came from a live search; the
 *  neo-brutalist stripe placeholder otherwise (sample data has no real photo). */
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
  if (!restaurant.photoName) {
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
        src={photoUrl(restaurant.photoName, 640)}
        alt={restaurant.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}
