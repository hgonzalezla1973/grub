import { useId } from 'react';
import { colors, fonts } from '../theme/tokens';
import { isGem, type Restaurant } from '../data/restaurants';
import { useApp } from '../state/AppState';
import { hashBearing } from '../utils/geo';
import { PeekCard } from './PeekCard';

// This is a placeholder canvas, not a real map — a fixed handful of pixels standing in
// for what a real SDK would lay out over actual geography. With the small sample dataset
// it was designed against, that was fine; with real search results (dozens of nearby
// restaurants, often clustered close together in dense areas) it isn't, so we both cap
// how many pins it tries to hold at once and spread them out more aggressively.
const MAX_PINS = 24;

/** When real geo data is available, radiate pins outward from a "you are here" center
 *  by real bearing/relative-distance; otherwise fall back to a fixed scatter layout. */
function pinPosition(r: Restaurant, i: number, maxDistance: number, hasGeo: boolean) {
  if (hasGeo && r.lat !== undefined) {
    const bearing = hashBearing(r.id);
    // sqrt (not linear) so restaurants that are all close together don't collapse into a
    // single dot at the center — it pushes near ones outward proportionally more than far
    // ones. A little per-pin jitter (from an independent hash) keeps near-identical
    // bearing/distance pairs from landing exactly on top of each other.
    const jitter = hashBearing(`${r.id}-jitter`);
    const radiusJitter = 0.85 + (jitter % 30) / 100;
    const bearingJitter = (jitter % 40) - 20;
    const radius = Math.min(0.46, Math.sqrt(r.distance / maxDistance) * 0.46 * radiusJitter);
    const rad = ((bearing + bearingJitter) * Math.PI) / 180;
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

export function MapPlaceholder({ restaurants: allRestaurants }: { restaurants: Restaurant[] }) {
  const app = useApp();
  const hasGeo = app.hasLiveLocation;
  const restaurants = allRestaurants.slice(0, MAX_PINS);
  const maxDistance = Math.max(1, ...restaurants.map((r) => r.distance));
  const gridId = `map-grid-${useId()}`;

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        borderRadius: 22,
        overflow: 'hidden',
        background: colors.mapSurface,
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={gridId} patternUnits="userSpaceOnUse" width={28} height={28}>
            <rect width={28} height={28} fill={colors.mapSurface} />
            <line x1={0} y1={0} x2={28} y2={0} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
            <line x1={0} y1={0} x2={0} y2={28} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>

      {hasGeo && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -9,
            marginTop: -9,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: colors.blue,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.black,
            }}
          />
          <span style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 700, marginTop: 2 }}>You</span>
        </div>
      )}

      {restaurants.map((r, i) => {
        const { left, top } = pinPosition(r, i, maxDistance, hasGeo);
        const selected = app.peekId === r.id;
        return (
          <button
            type="button"
            key={r.id}
            onClick={() => app.setPeek(r.id)}
            style={{
              position: 'absolute',
              left,
              top,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              lineHeight: 1,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <span style={{ fontSize: selected ? 34 : 27 }}>{isGem(r) ? '💎' : '📍'}</span>
          </button>
        );
      })}

      {allRestaurants.length > MAX_PINS && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: colors.white,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: colors.black,
            borderRadius: 100,
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 10,
            paddingRight: 10,
            fontFamily: fonts.body,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          Closest {MAX_PINS} of {allRestaurants.length} — see List for all
        </div>
      )}

      {app.peekRestaurant && <PeekCard restaurant={app.peekRestaurant} />}
    </div>
  );
}
