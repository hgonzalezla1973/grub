import { colors, fonts } from '../theme/tokens';
import { priceLabel, type Restaurant } from '../data/restaurants';
import { formatDistance } from '../utils/geo';
import { RestaurantPhoto } from './RestaurantPhoto';
import { useApp } from '../state/AppState';

export function PeekCard({ restaurant }: { restaurant: Restaurant }) {
  const app = useApp();
  return (
    <div
      style={{
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: 10,
        background: colors.coral,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        borderRadius: 18,
        padding: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: `4px 4px 0 ${colors.black}`,
      }}
    >
      <RestaurantPhoto restaurant={restaurant} width={46} height={46} radius={12} onColor />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 22,
            fontWeight: 800,
            textTransform: 'uppercase',
            lineHeight: 1.07,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {restaurant.name}
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 12.5, fontWeight: 600, opacity: 0.8, marginTop: 2 }}>
          ★ {restaurant.rating} · {priceLabel(restaurant.price)} · {formatDistance(restaurant.distance)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => app.openDetail(restaurant.id)}
        style={{
          background: colors.black,
          border: 'none',
          borderRadius: 100,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 16,
          paddingRight: 16,
          cursor: 'pointer',
          fontFamily: fonts.display,
          fontSize: 14,
          fontWeight: 800,
          color: colors.white,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        View
      </button>
    </div>
  );
}
