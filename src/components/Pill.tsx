import { type CSSProperties } from 'react';
import { colors, fonts } from '../theme/tokens';

type Variant = 'primary' | 'outline' | 'white';

interface PillProps {
  label: string;
  onClick?: () => void;
  variant?: Variant;
  labelColor?: string;
  fontSize?: number;
  style?: CSSProperties;
  disabled?: boolean;
}

export function Pill({ label, onClick, variant = 'primary', labelColor, fontSize = 22, style, disabled }: PillProps) {
  const bg = variant === 'primary' ? colors.black : variant === 'white' ? colors.white : 'transparent';
  const textColor = labelColor ?? (variant === 'primary' ? colors.white : colors.black);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        paddingTop: 17,
        paddingBottom: 17,
        borderRadius: 100,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        background: bg,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: fonts.display,
        fontSize,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        color: textColor,
        ...style,
      }}
    >
      {label}
    </button>
  );
}
