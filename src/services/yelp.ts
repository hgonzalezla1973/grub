import { haversineMiles, type Coords } from '../utils/geo';
import type { DietCategory, Restaurant } from '../data/restaurants';

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
  distance?: number; // meters, computed by Yelp when lat/lng are supplied
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

function mapBusiness(b: YelpBusiness, origin: Coords): Restaurant {
  const lat = b.coordinates?.latitude ?? origin.lat;
  const lng = b.coordinates?.longitude ?? origin.lng;
  const categories = b.categories ?? [];
  const distanceMi = b.distance != null ? b.distance / 1609.344 : haversineMiles(origin, { lat, lng });

  return {
    id: `yelp-${b.id}`,
    name: b.name,
    cuisine: cuisineFrom(categories),
    distance: Math.round(distanceMi * 10) / 10,
    address: b.location?.display_address?.join(', ') ?? 'Address unavailable',
    isFastFood: categories.some((c) => c.alias === 'hotdogs' || c.alias === 'fastfood'),
    dietCategory: inferDietCategory(categories),
    rating: b.rating ?? 0,
    reviewCount: b.review_count ?? 0,
    photoCount: b.image_url ? 1 : 0,
    price: (b.price?.length as 1 | 2 | 3 | undefined) ?? 2,
    phone: b.phone ?? '',
    hours: 'Hours unavailable',
    menu: [],
    note: "This listing comes from Yelp — dish-level vegan/vegetarian details aren't available yet.",
    reviews: [],
    lat,
    lng,
    photoUrl: b.image_url,
    source: 'yelp',
  };
}

export async function searchVeganVegetarianNearby(origin: Coords): Promise<Restaurant[]> {
  const url = `/api/yelp/search?lat=${origin.lat}&lng=${origin.lng}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new YelpApiError(body?.error || `Yelp proxy returned ${res.status}`);
  }

  const data = (await res.json()) as { businesses?: YelpBusiness[] };
  return (data.businesses ?? []).filter((b) => !b.is_closed).map((b) => mapBusiness(b, origin));
}
