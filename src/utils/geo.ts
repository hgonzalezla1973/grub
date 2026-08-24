export interface Coords {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_MI = 3958.8;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function haversineMiles(a: Coords, b: Coords): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.sqrt(h));
}

/** Point at `distanceMi` from `origin` along compass `bearingDeg` (0 = north). */
export function destinationPoint(origin: Coords, distanceMi: number, bearingDeg: number): Coords {
  const d = distanceMi / EARTH_RADIUS_MI;
  const brng = toRad(bearingDeg);
  const lat1 = toRad(origin.lat);
  const lng1 = toRad(origin.lng);
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
  const lng2 =
    lng1 + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: toDeg(lat2), lng: toDeg(lng2) };
}

const MILES_PER_KM = 0.621371;
const IMPERIAL_REGIONS = new Set(['US', 'LR', 'MM', 'GB']); // officially imperial (US, Liberia,
// Myanmar), plus the UK, which still gives road/travel distance in miles despite being
// metric otherwise. Every other locale defaults to km, which is what most of the world uses.

/** Whether this browser's locale suggests the user thinks of everyday travel distance in
 *  miles rather than km. Read once at call time (not cached) since it's cheap and this
 *  keeps it correct if the app is ever run in a webview whose locale can change at runtime. */
export function usesImperialUnits(locale: string = typeof navigator !== 'undefined' ? navigator.language : 'en-US'): boolean {
  try {
    const region = new Intl.Locale(locale).maximize().region;
    if (region) return IMPERIAL_REGIONS.has(region);
  } catch {
    // Intl.Locale unsupported, or an unparsable locale tag — fall through to the plain heuristic.
  }
  const region = locale.split('-')[1]?.toUpperCase();
  return region ? IMPERIAL_REGIONS.has(region) : false;
}

/** Distances are computed and stored internally in miles throughout the app (see
 *  haversineMiles) regardless of locale — this is the one place that converts for display. */
export function formatDistance(miles: number, imperial = usesImperialUnits()): string {
  if (imperial) return `${miles} mi`;
  return `${Math.round((miles / MILES_PER_KM) * 10) / 10} km`;
}

/** Same conversion, rounded to a clean whole number — for fixed threshold copy like
 *  "Less than 3 mi" / "Less than 5 km", where an exact decimal (4.8 km) would look odd. */
export function formatDistanceThreshold(miles: number, imperial = usesImperialUnits()): string {
  if (imperial) return `${miles} mi`;
  return `${Math.round(miles / MILES_PER_KM)} km`;
}

/** Deterministic 0-359 "bearing" derived from a restaurant id, so its position is stable.
 *  Ids like "r1"/"r2" differ by one character, so a plain multiply-add hash would produce
 *  nearly-identical output (pins bunched in one direction) — the finalizer below avalanches
 *  that single-bit difference across all bits before reducing to a compass degree. */
export function hashBearing(id: string): number {
  let h = 5381;
  for (let i = 0; i < id.length; i++) h = ((h << 5) + h + id.charCodeAt(i)) | 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x45d9f3b);
  h ^= h >>> 16;
  h = Math.imul(h, 0x45d9f3b);
  h ^= h >>> 16;
  return ((h % 360) + 360) % 360;
}
