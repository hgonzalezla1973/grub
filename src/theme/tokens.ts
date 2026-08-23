import type { CSSProperties } from 'react';

export const colors = {
  cream: '#FDF2EC',
  black: '#000000',
  white: '#FFFFFF',
  green: '#A2DB69',
  purple: '#B089F4',
  coral: '#F98875',
  yellow: '#F4DC3D',
  blue: '#73A3F5',
  orange: '#F4A03B',
  mapSurface: '#EDE3DA',
  heartActive: '#D9403A',
  scrim: 'rgba(0,0,0,0.4)',
};

export const cardColors = [
  colors.green,
  colors.purple,
  colors.coral,
  colors.yellow,
  colors.blue,
  colors.orange,
];

export const fonts = {
  display: "'Big Shoulders Display', sans-serif",
  body: "'Josefin Sans', system-ui, sans-serif",
};

export const radii = {
  pill: 100,
  card: 20,
  cardLarge: 22,
  inner: 16,
  sticker: 16,
  sheet: 26,
};

export const shadow = (offset: 3 | 4 | 5 = 4): CSSProperties => ({
  boxShadow: `${offset}px ${offset}px 0 ${colors.black}`,
});

export const border: CSSProperties = {
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: colors.black,
};

export const borderThin: CSSProperties = {
  borderWidth: 1.5,
  borderStyle: 'solid',
  borderColor: colors.black,
};
