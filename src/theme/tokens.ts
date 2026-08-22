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
  display: 'BigShouldersDisplay_900Black',
  display800: 'BigShouldersDisplay_800ExtraBold',
  body: 'JosefinSans_400Regular',
  bodyMedium: 'JosefinSans_500Medium',
  bodySemiBold: 'JosefinSans_600SemiBold',
  bodyBold: 'JosefinSans_700Bold',
};

export const radii = {
  pill: 100,
  card: 20,
  cardLarge: 22,
  inner: 16,
  sticker: 16,
  sheet: 26,
};

export const shadow = (offset: 3 | 4 | 5 = 4) => ({
  shadowColor: colors.black,
  shadowOffset: { width: offset, height: offset },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: offset,
});

export const border = {
  borderWidth: 2,
  borderColor: colors.black,
};

export const borderThin = {
  borderWidth: 1.5,
  borderColor: colors.black,
};
