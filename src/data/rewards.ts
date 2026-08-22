import { colors } from '../theme/tokens';

export const rewards = {
  points: 1240,
  nextTierPoints: 1500,
  tier: 'Sprout II',
  streak: 6,
  nextTier: 'Sapling',
  nextPerk: 'early access to new city maps',
};

export interface Quest {
  title: string;
  detail: string;
  reward: number;
  done: number;
  goal: number;
  bg: string;
}

export const QUESTS: Quest[] = [
  { title: 'Photo run', detail: 'Add photos at 3 different spots.', reward: 150, done: 2, goal: 3, bg: colors.coral },
  { title: 'Say the details', detail: 'Write a review that names a vegan dish.', reward: 100, done: 0, goal: 1, bg: colors.blue },
  { title: 'Off the beaten path', detail: 'Review a hidden gem more than 5 mi out.', reward: 200, done: 1, goal: 2, bg: colors.purple },
];

export interface Sticker {
  icon: string;
  label: string;
  earned: boolean;
}

export const STICKERS: Sticker[] = [
  { icon: '🌱', label: 'First review', earned: true },
  { icon: '📸', label: '10 photos', earned: true },
  { icon: '⭐', label: 'Trailblazer', earned: true },
  { icon: '🔥', label: '4 wk streak', earned: true },
  { icon: '💎', label: 'Gem hunter', earned: false },
  { icon: '🗺️', label: '3 cities', earned: false },
  { icon: '🥑', label: '50 reviews', earned: false },
  { icon: '👑', label: 'Top local', earned: false },
];

export const PROFILE = {
  name: 'Maya Reyes',
  location: 'Los Angeles',
  joined: '2024',
  reviews: 24,
  photos: 68,
};
