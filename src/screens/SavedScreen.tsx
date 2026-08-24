import { colors, fonts } from '../theme/tokens';
import { RestaurantPhoto } from '../components/RestaurantPhoto';
import { FavoriteButton } from '../components/FavoriteButton';
import { colorForRestaurant } from '../components/RestaurantCard';
import { priceLabel, type Restaurant } from '../data/restaurants';
import { formatDistance } from '../utils/geo';
import { useApp } from '../state/AppState';

export function SavedScreen() {
  const app = useApp();

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        background: colors.cream,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 22,
        paddingBottom: 20,
      }}
    >
      <button
        type="button"
        onClick={app.goHome}
        style={{
          alignSelf: 'flex-start',
          marginBottom: 16,
          background: colors.white,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: colors.black,
          borderRadius: 100,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 14,
          paddingRight: 14,
          cursor: 'pointer',
          fontFamily: fonts.body,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        ← Home
      </button>

      <div style={{ fontFamily: fonts.display, fontSize: 44, fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>
        Saved
      </div>

      <div
        style={{
          alignSelf: 'flex-start',
          background: colors.green,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: colors.black,
          borderRadius: 100,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 12,
          paddingRight: 12,
          marginBottom: 16,
          fontFamily: fonts.body,
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        Available offline
      </div>

      {app.savedList.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.7, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 10 }}>♡</div>
          <div style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 1.4, maxWidth: 260 }}>
            Tap the heart on any spot to keep it here — no signal needed.
          </div>
        </div>
      ) : (
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {app.savedList.map((r) => (
            <SavedRow key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function SavedRow({ restaurant: r }: { restaurant: Restaurant }) {
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
        position: 'relative',
        background: colorForRestaurant(r),
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        borderRadius: 20,
        padding: 12,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        boxShadow: `4px 4px 0 ${colors.black}`,
        cursor: 'pointer',
      }}
    >
      <RestaurantPhoto restaurant={r} width={58} height={58} radius={14} onColor />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 25,
            fontWeight: 800,
            textTransform: 'uppercase',
            lineHeight: 1.07,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {r.name}
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 600, opacity: 0.78, marginTop: 2 }}>
          ★ {r.rating} · {priceLabel(r.price)} · {formatDistance(r.distance)}
        </div>
      </div>
      <FavoriteButton
        active={favorite}
        onClick={() => app.toggleFavorite(r.id)}
        size={26}
        style={{ position: 'absolute', top: 10, right: 10 }}
      />
    </div>
  );
}
