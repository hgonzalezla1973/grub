import { colors, fonts } from '../theme/tokens';

interface BadgeProps {
  label: string;
  filled?: boolean;
  bg?: string;
  textColor?: string;
}

export function Badge({ label, filled = false, bg, textColor }: BadgeProps) {
  const background = bg ?? (filled ? colors.black : colors.white);
  const color = textColor ?? (filled ? colors.white : colors.black);
  return (
    <span
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 9,
        paddingRight: 9,
        borderRadius: 100,
        borderWidth: 1.5,
        borderStyle: 'solid',
        borderColor: colors.black,
        background,
        fontFamily: fonts.body,
        fontSize: 11.5,
        fontWeight: 700,
        color,
      }}
    >
      {label}
    </span>
  );
}
