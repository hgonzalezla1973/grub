import type { DietCategory, PlaceKind, Restaurant } from '../data/restaurants';

/**
 * Yelp Fusion's API deliberately doesn't support CORS, so it can never be called
 * directly from the browser — this hits our own server proxy (server/index.js)
 * instead, which holds the real Yelp key. See README-YELP-SETUP.md.
 */

export class YelpApiError extends Error {}

interface YelpBusiness {
  id: string;
  name: string;
  image_url?: string;
  url?: string;
  review_count?: number;
  categories?: { alias: string; title: string }[];
  rating?: number;
  coordinates?: { latitude: number; longitude: number };
  price?: string;
  phone?: string;
  distance?: number; // meters — Yelp computes this from whatever location it resolved
  // (lat/lng or a city string), so it's present either way.
  location?: { display_address?: string[] };
  is_closed?: boolean;
}

/**
 * Yelp has no dish-level "has vegan options" data either — the closest signal is
 * whether "vegan" or "vegetarian" itself is one of the business's own categories.
 * Anything that matched our category search but isn't tagged as either specifically
 * gets the more permissive "veganOptions" bucket rather than a guess we can't back up.
 */
function inferDietCategory(categories: { alias: string }[]): DietCategory {
  const aliases = categories.map((c) => c.alias);
  if (aliases.includes('vegan')) return 'vegan';
  if (aliases.includes('vegetarian')) return 'vegetarian';
  return 'veganOptions';
}

function cuisineFrom(categories: { alias: string; title: string }[]): string {
  const nonDiet = categories.find((c) => c.alias !== 'vegan' && c.alias !== 'vegetarian');
  return (nonDiet ?? categories[0])?.title ?? 'Restaurant';
}

/** The search is scoped to these categories, so any result carrying one of them is a
 *  store, not a restaurant. "healthmarkets" covers small health food/vitamin shops;
 *  "grocery" and "organic_stores" catch bigger natural grocery chains (Sprouts, Whole
 *  Foods, Trader Joe's) that Yelp doesn't tag as "healthmarkets" even though they're
 *  exactly what someone looking for health food stores means. */
const STORE_CATEGORIES = new Set(['healthmarkets', 'grocery', 'organic_stores']);

function inferKind(categories: { alias: string }[]): PlaceKind {
  return categories.some((c) => STORE_CATEGORIES.has(c.alias)) ? 'store' : 'restaurant';
}

function mapBusiness(b: YelpBusiness): Restaurant {
  const categories = b.categories ?? [];
  const kind = inferKind(categories);

  return {
    id: `yelp-${b.id}`,
    name: b.name,
    cuisine: cuisineFrom(categories),
    distance: Math.round(((b.distance ?? 0) / 1609.344) * 10) / 10,
    address: b.location?.display_address?.join(', ') ?? 'Address unavailable',
    isFastFood: categories.some((c) => c.alias === 'hotdogs' || c.alias === 'fastfood'),
    kind,
    dietCategory: inferDietCategory(categories),
    rating: b.rating ?? 0,
    reviewCount: b.review_count ?? 0,
    photoCount: b.image_url ? 1 : 0,
    price: (b.price?.length as 1 | 2 | 3 | undefined) ?? 2,
    phone: b.phone ?? '',
    hours: 'Hours unavailable',
    menu: [],
    note:
      kind === 'store'
        ? "This listing comes from Yelp — we don't have details on what they stock yet."
        : "This listing comes from Yelp — dish-level vegan/vegetarian details aren't available yet.",
    reviews: [],
    lat: b.coordinates?.latitude,
    lng: b.coordinates?.longitude,
    photoUrl: b.image_url,
    source: 'yelp',
  };
}

async function fetchYelp(params: Record<string, string>): Promise<Restaurant[]> {
  const url = `/api/yelp/search?${new URLSearchParams(params)}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new YelpApiError(body?.error || `Yelp proxy returned ${res.status}`);
  }

  const data = (await res.json()) as { businesses?: YelpBusiness[] };
  return (data.businesses ?? []).filter((b) => !b.is_closed).map(mapBusiness);
}

export function searchVeganVegetarianNearby(origin: { lat: number; lng: number }): Promise<Restaurant[]> {
  return fetchYelp({ lat: String(origin.lat), lng: String(origin.lng) });
}

/** Yelp resolves a plain city/address string server-side — no geocoding step needed. */
export function searchVeganVegetarianInCity(city: string): Promise<Restaurant[]> {
  return fetchYelp({ city });
}
