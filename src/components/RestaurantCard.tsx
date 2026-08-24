import { type CSSProperties } from 'react';
import { colors, cardColors, fonts } from '../theme/tokens';
import { DIET_LABEL, placeKind, priceLabel, type Restaurant } from '../data/restaurants';
import { formatDistance, hashBearing } from '../utils/geo';
import { RestaurantPhoto } from './RestaurantPhoto';
import { FavoriteButton } from './FavoriteButton';
import { Badge } from './Badge';
import { useApp } from '../state/AppState';

/** Stable per-id color, independent of position in any particular list — works for
 *  both the fixed sample ids ("r1"...) and real Google place ids. */
export function colorForRestaurant(r: Restaurant) {
  return cardColors[hashBearing(r.id) % cardColors.length];
}

interface Props {
  restaurant: Restaurant;
  style?: CSSProperties;
}

export function RestaurantCard({ restaurant: r, style }: Props) {
  const app = useApp();
  const favorite = app.favorites.includes(r.id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => app.openDetail(r.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          app.openDetail(r.id);
        }
      }}
      style={{
        textAlign: 'left',
        background: colorForRestaurant(r),
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        borderRadius: 20,
        padding: 10,
        boxShadow: `4px 4px 0 ${colors.black}`,
        cursor: 'pointer',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        ...style,
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <RestaurantPhoto restaurant={r} width={84} height={84} radius={14} onColor />
        <FavoriteButton
          active={favorite}
          onClick={() => app.toggleFavorite(r.id)}
          size={24}
          style={{ position: 'absolute', top: -6, right: -6 }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 21,
            fontWeight: 800,
            textTransform: 'uppercase',
            lineHeight: 1.08,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {r.name}
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 12.5,
            fontWeight: 600,
            opacity: 0.75,
            marginTop: 2,
            marginBottom: 8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {r.cuisine} · {priceLabel(r.price)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <Badge label={`★ ${r.rating}`} />
          <Badge label={formatDistance(r.distance)} />
          {placeKind(r) === 'store' && <Badge label="🛒 Store" bg={colors.yellow} />}
          <Badge label={DIET_LABEL[r.dietCategory]} filled />
        </div>
      </div>
    </div>
  );
}
