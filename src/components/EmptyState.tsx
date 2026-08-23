import { type CSSProperties } from 'react';
import { colors, fonts } from '../theme/tokens';

interface Props {
  icon: string;
  title: string;
  detail: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: CSSProperties;
}

export function EmptyState({ icon, title, detail, actionLabel, onAction, style }: Props) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: 'center',
        ...style,
      }}
    >
      <div style={{ fontSize: 44, marginBottom: 12 }}>{icon}</div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 22,
          fontWeight: 800,
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 14,
          opacity: 0.7,
          lineHeight: 1.4,
          marginBottom: actionLabel ? 18 : 0,
        }}
      >
        {detail}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            background: colors.black,
            border: 'none',
            borderRadius: 100,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 22,
            paddingRight: 22,
            cursor: 'pointer',
            fontFamily: fonts.display,
            fontSize: 14,
            fontWeight: 800,
            color: colors.white,
            textTransform: 'uppercase',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
