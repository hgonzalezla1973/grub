import React from 'react';
import { View, ViewStyle, DimensionValue } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';
import { colors } from '../theme/tokens';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  bordered?: boolean;
  /** Use on top of a colored card: white stripes at low opacity instead of black. */
  onColor?: boolean;
  baseColor?: string;
  style?: ViewStyle;
}

let uid = 0;

export function PhotoPlaceholder({
  width = '100%',
  height = '100%',
  radius = 14,
  bordered = true,
  onColor = false,
  baseColor,
  style,
}: Props) {
  const id = React.useRef(`stripe-${uid++}`).current;
  const bg = baseColor ?? (onColor ? 'transparent' : colors.white);
  const stripe = onColor ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.09)';

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          overflow: 'hidden',
          backgroundColor: bg,
        },
        bordered && { borderWidth: 2, borderColor: colors.black },
        style,
      ]}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id={id} patternUnits="userSpaceOnUse" width={12} height={12} patternTransform="rotate(45)">
            <Rect width={12} height={12} fill={bg} />
            <Rect width={6} height={12} fill={stripe} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
