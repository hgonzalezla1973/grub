export type DietCategory = 'vegan' | 'veganOptions' | 'vegetarian';
export type MenuTag = 'vegan' | 'vegetarian';

export interface MenuItem {
  name: string;
  tag: MenuTag;
}

export interface Review {
  author: string;
  rating: number;
  text: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  distance: number;
  address: string;
  isFastFood: boolean;
  dietCategory: DietCategory;
  rating: number;
  reviewCount: number;
  photoCount: number;
  price: 1 | 2 | 3;
  phone: string;
  hours: string;
  menu: MenuItem[];
  note: string;
  reviews: Review[];
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1', name: 'Green Fork', cuisine: 'American', distance: 0.4, address: '112 Maple St',
    isFastFood: false, dietCategory: 'veganOptions',
    rating: 4.6, reviewCount: 214, photoCount: 340, price: 2, phone: '+15551012233', hours: 'Open until 9:00 PM',
    menu: [
      { name: 'Jackfruit BBQ Bowl', tag: 'vegan' },
      { name: 'Loaded Veggie Nachos', tag: 'vegetarian' },
      { name: 'Cashew Mac & Cheese', tag: 'vegan' },
    ],
    note: 'Fully separate vegan kitchen. Staff trained on cross-contact.',
    reviews: [
      { author: 'Dana M.', rating: 5, text: 'The jackfruit bowl is incredible, and they clearly know how to handle vegan orders separately.' },
      { author: 'Priya K.', rating: 4, text: 'Great spot for a casual dinner, portions are generous.' },
    ],
  },
  {
    id: 'r2', name: 'Basil & Bloom', cuisine: 'Italian', distance: 0.9, address: '58 Pine Ave',
    isFastFood: false, dietCategory: 'vegetarian',
    rating: 4.3, reviewCount: 98, photoCount: 152, price: 3, phone: '+15551023344', hours: 'Open until 10:00 PM',
    menu: [
      { name: 'Wild Mushroom Risotto', tag: 'vegetarian' },
      { name: 'Vegan Margherita', tag: 'vegan' },
      { name: 'Eggplant Parmesan', tag: 'vegetarian' },
    ],
    note: 'Most pastas can be made vegan on request.',
    reviews: [
      { author: 'Marco T.', rating: 4, text: "Risotto was rich and the vegan margherita didn't skimp on flavor." },
    ],
  },
  {
    id: 'r3', name: 'Loco Verde', cuisine: 'Mexican', distance: 2.4, address: '900 Ocean Blvd',
    isFastFood: true, dietCategory: 'veganOptions',
    rating: 4.1, reviewCount: 156, photoCount: 210, price: 1, phone: '+15551034455', hours: 'Open until 11:00 PM',
    menu: [
      { name: 'Jackfruit Carnitas Tacos', tag: 'vegan' },
      { name: 'Queso Fresco Bowl', tag: 'vegetarian' },
      { name: 'Black Bean Burrito', tag: 'vegan' },
    ],
    note: 'Quick-service counter. Ask for the vegan menu insert.',
    reviews: [
      { author: 'Sam R.', rating: 4, text: 'Fast and the vegan tacos actually taste like something.' },
    ],
  },
  {
    id: 'r4', name: 'Bamboo Bowl', cuisine: 'Asian', distance: 5.3, address: '24 Harbor Rd',
    isFastFood: false, dietCategory: 'vegan',
    rating: 4.8, reviewCount: 302, photoCount: 410, price: 2, phone: '+15551045566', hours: 'Open until 9:30 PM',
    menu: [
      { name: 'Tofu Pad See Ew', tag: 'vegan' },
      { name: 'Miso Eggplant', tag: 'vegan' },
      { name: 'Coconut Curry', tag: 'vegan' },
    ],
    note: '100% plant-based menu, no animal products in the kitchen.',
    reviews: [
      { author: 'Lena W.', rating: 5, text: 'Best fully vegan Asian spot in the area, the curry is unreal.' },
      { author: 'Josh P.', rating: 5, text: "Never worry about cross-contact here, everything's plant-based." },
    ],
  },
  {
    id: 'r5', name: 'Patty Shack', cuisine: 'American', distance: 6.7, address: '77 Fifth Ave',
    isFastFood: true, dietCategory: 'veganOptions',
    rating: 3.9, reviewCount: 87, photoCount: 96, price: 1, phone: '+15551056677', hours: 'Open until midnight',
    menu: [
      { name: 'Beyond Burger', tag: 'vegan' },
      { name: 'Cheddar Melt', tag: 'vegetarian' },
      { name: 'Sweet Potato Fries', tag: 'vegan' },
    ],
    note: 'Drive-thru available. Vegan patty cooked on shared grill.',
    reviews: [
      { author: 'Omar F.', rating: 3, text: 'Solid late-night option, just double-check the grill situation.' },
    ],
  },
  {
    id: 'r6', name: 'Terra Verde', cuisine: 'Mexican', distance: 12.1, address: '410 Sunset Way',
    isFastFood: false, dietCategory: 'vegan',
    rating: 4.9, reviewCount: 176, photoCount: 260, price: 2, phone: '+15551067788', hours: 'Open until 9:00 PM',
    menu: [
      { name: 'Cauliflower Al Pastor', tag: 'vegan' },
      { name: 'Cashew Queso Tacos', tag: 'vegan' },
    ],
    note: 'Fully plant-based taqueria.',
    reviews: [
      { author: 'Ilana G.', rating: 5, text: 'A hidden gem worth the drive, the al pastor is genuinely shocking.' },
    ],
  },
  {
    id: 'r7', name: 'Noodle & Ninth', cuisine: 'Asian', distance: 8.9, address: '203 Elm St',
    isFastFood: false, dietCategory: 'vegetarian',
    rating: 4.4, reviewCount: 121, photoCount: 178, price: 2, phone: '+15551078899', hours: 'Open until 10:00 PM',
    menu: [
      { name: 'Veggie Dumplings', tag: 'vegetarian' },
      { name: 'Tofu Ramen', tag: 'vegan' },
    ],
    note: 'Vegetarian menu, ask about vegan broth swap.',
    reviews: [
      { author: 'Chris B.', rating: 4, text: 'Dumplings are excellent, ramen broth can be swapped vegan on request.' },
    ],
  },
];

export const SORTS: [string, string][] = [
  ['distance', 'Distance'],
  ['rating', 'Rating'],
];

export const DIET_FILTERS: [DietCategory, string][] = [
  ['vegan', '100% Vegan'],
  ['veganOptions', 'Vegan Options'],
  ['vegetarian', 'Vegetarian Options'],
];

export const MOOD_FILTERS: [string, string][] = [
  ['any', 'Anything'],
  ['Italian', 'Italian'],
  ['Mexican', 'Mexican'],
  ['Asian', 'Asian'],
  ['American', 'American'],
];

export const DISTANCE_FILTERS: [string, string][] = [
  ['near', 'Less than 3 mi'],
  ['mid', '3 to 10 mi'],
  ['far', 'More than 10 mi'],
];

export const COLLECTIONS: [string, string][] = [
  ['all', 'All'],
  ['popular', 'Popular'],
  ['gems', 'Hidden gems'],
];

export const DIET_LABEL: Record<DietCategory, string> = {
  vegan: '100% Vegan',
  veganOptions: 'Vegan opts',
  vegetarian: 'Veg opts',
};

export const distanceBucket = (d: number): 'near' | 'mid' | 'far' =>
  d < 3 ? 'near' : d <= 10 ? 'mid' : 'far';

export const isGem = (r: Restaurant) => r.rating >= 4.7 && r.reviewCount < 200;
export const isPopular = (r: Restaurant) => r.reviewCount >= 150;

export const priceLabel = (p: number) => '$'.repeat(p);
