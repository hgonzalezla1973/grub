import { haversineMiles, type Coords } from '../utils/geo';
import type { DietCategory, PlaceKind, Restaurant } from '../data/restaurants';

const SEARCH_QUERY_SUFFIX = ', health food stores, or natural grocery stores';

// Read at build time by Vite (VITE_ vars are inlined into the JS bundle).
// See README-GOOGLE-PLACES-SETUP.md for how to get a key.
const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined;

const SEARCH_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.priceLevel',
  'places.types',
  'places.primaryType',
  'places.photos',
  'places.currentOpeningHours',
  'places.internationalPhoneNumber',
  'nextPageToken',
].join(',');

const RESULTS_PAGE_SIZE = 20; // Google's max per call
const MAX_RESULTS = 60; // safety cap: at most 3 upstream calls per search

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  types?: string[];
  primaryType?: string;
  photos?: { name: string }[];
  currentOpeningHours?: { weekdayDescriptions?: string[] };
  internationalPhoneNumber?: string;
}

export class PlacesApiError extends Error {}

export function hasApiKey(): boolean {
  return !!API_KEY;
}

export function photoUrl(photoName: string, maxWidthPx = 640): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${API_KEY}`;
}

const PRICE_LEVEL_MAP: Record<string, 1 | 2 | 3> = {
  PRICE_LEVEL_FREE: 1,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 3,
};

function humanizeType(type: string | undefined): string {
  if (!type) return 'Restaurant';
  const cleaned = type
    .replace(/_/g, ' ')
    .replace(/\brestaurant\b/gi, '')
    .trim();
  if (!cleaned) return 'Restaurant';
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Google doesn't curate dish-level "has vegan options" data the way the rest of this
 * app's design assumes — the closest signal is these two specific place types. Anything
 * that matched our vegan/vegetarian search query but isn't explicitly typed as one of
 * these gets the more permissive "veganOptions" bucket rather than a guess we can't back up.
 */
function inferDietCategory(types: string[]): DietCategory {
  if (types.includes('vegan_restaurant')) return 'vegan';
  if (types.includes('vegetarian_restaurant')) return 'vegetarian';
  return 'veganOptions';
}

/** The search itself is scoped to include these types, so any result carrying one of
 *  them is a store, not a restaurant. "health_food_store" covers small health food/
 *  vitamin shops; "grocery_store" and "supermarket" catch bigger natural grocery chains
 *  (Sprouts, Whole Foods, Trader Joe's) that Google doesn't type as "health_food_store"
 *  even though they're exactly what someone looking for health food stores means. */
const STORE_TYPES = new Set(['health_food_store', 'grocery_store', 'supermarket']);

function inferKind(types: string[]): PlaceKind {
  return types.some((t) => STORE_TYPES.has(t)) ? 'store' : 'restaurant';
}

function mapPlace(p: GooglePlace, origin: Coords): Restaurant {
  const lat = p.location?.latitude ?? origin.lat;
  const lng = p.location?.longitude ?? origin.lng;
  const types = p.types ?? [];
  const kind = inferKind(types);

  return {
    id: p.id,
    name: p.displayName?.text ?? 'Unnamed restaurant',
    cuisine: humanizeType(p.primaryType),
    distance: Math.round(haversineMiles(origin, { lat, lng }) * 10) / 10,
    address: p.formattedAddress ?? 'Address unavailable',
    isFastFood: types.includes('fast_food_restaurant') || types.includes('meal_takeaway'),
    kind,
    dietCategory: inferDietCategory(types),
    rating: p.rating ?? 0,
    reviewCount: p.userRatingCount ?? 0,
    photoCount: p.photos?.length ?? 0,
    price: PRICE_LEVEL_MAP[p.priceLevel ?? ''] ?? 2,
    phone: p.internationalPhoneNumber ?? '',
    hours: p.currentOpeningHours?.weekdayDescriptions?.[0] ?? 'Hours unavailable',
    menu: [],
    note:
      kind === 'store'
        ? "This listing comes from Google Places — we don't have details on what they stock yet."
        : "This listing comes from Google Places — dish-level vegan/vegetarian details aren't available yet.",
    reviews: [],
    lat,
    lng,
    placeId: p.id,
    photoName: p.photos?.[0]?.name,
  };
}

async function fetchAllPlaces(body: Record<string, unknown>): Promise<GooglePlace[]> {
  if (!API_KEY) throw new PlacesApiError('No Google Places API key configured');

  const places: GooglePlace[] = [];
  let pageToken: string | undefined;

  do {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': SEARCH_FIELD_MASK,
      },
      body: JSON.stringify({
        ...body,
        maxResultCount: RESULTS_PAGE_SIZE,
        ...(pageToken ? { pageToken } : {}),
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      if (places.length > 0) break; // keep what we already have rather than failing outright
      throw new PlacesApiError(`Places API ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const data = (await res.json()) as { places?: GooglePlace[]; nextPageToken?: string };
    places.push(...(data.places ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken && places.length < MAX_RESULTS);

  return places;
}

export async function searchVeganVegetarianNearby(origin: Coords): Promise<Restaurant[]> {
  const places = await fetchAllPlaces({
    textQuery: `vegan or vegetarian restaurants${SEARCH_QUERY_SUFFIX}`,
    locationBias: {
      circle: { center: { latitude: origin.lat, longitude: origin.lng }, radius: 8000 },
    },
  });
  return places.map((p) => mapPlace(p, origin));
}

/**
 * Google's text search resolves a plain city name in the query itself — no geocoding
 * step needed. There's no real device position to measure distance from here, so each
 * result's distance is instead measured from the centroid of the results themselves
 * (a "distance from the middle of the pack" proxy, not a true from-you distance).
 */
export async function searchVeganVegetarianInCity(city: string): Promise<Restaurant[]> {
  const places = await fetchAllPlaces({ textQuery: `vegan or vegetarian restaurants${SEARCH_QUERY_SUFFIX} in ${city}` });

  const withCoords = places.filter((p) => p.location);
  const centroid: Coords = withCoords.length
    ? {
        lat: withCoords.reduce((sum, p) => sum + p.location!.latitude, 0) / withCoords.length,
        lng: withCoords.reduce((sum, p) => sum + p.location!.longitude, 0) / withCoords.length,
      }
    : { lat: 0, lng: 0 };

  return places.map((p) => mapPlace(p, centroid));
}
