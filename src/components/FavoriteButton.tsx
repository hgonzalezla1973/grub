import type { CSSProperties, MouseEvent } from 'react';
import { colors } from '../theme/tokens';

interface Props {
  active: boolean;
  onClick: (e: MouseEvent) => void;
  size?: number;
  style?: CSSProperties;
}

export function FavoriteButton({ active, onClick, size = 26, style }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: colors.white,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        lineHeight: 1,
        ...style,
      }}
    >
      <span style={{ fontSize: size * 0.52, color: active ? colors.heartActive : colors.black }}>
        {active ? '♥' : '♡'}
      </span>
    </button>
  );
}
