import { type CSSProperties, useId } from 'react';
import { colors } from '../theme/tokens';

interface Props {
  width?: number | string;
  height?: number | string;
  radius?: number;
  bordered?: boolean;
  /** Use on top of a colored card: white stripes at low opacity instead of black. */
  onColor?: boolean;
  baseColor?: string;
  style?: CSSProperties;
}

export function PhotoPlaceholder({
  width = '100%',
  height = '100%',
  radius = 14,
  bordered = true,
  onColor = false,
  baseColor,
  style,
}: Props) {
  const id = `stripe-${useId()}`;
  const bg = baseColor ?? (onColor ? 'transparent' : colors.white);
  const stripe = onColor ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.09)';

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: 'hidden',
        background: bg,
        ...(bordered ? { borderWidth: 2, borderStyle: 'solid', borderColor: colors.black } : {}),
        ...style,
      }}
    >
      <svg width="100%" height="100%">
        <defs>
          <pattern id={id} patternUnits="userSpaceOnUse" width={12} height={12} patternTransform="rotate(45)">
            <rect width={12} height={12} fill={bg} />
            <rect width={6} height={12} fill={stripe} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
