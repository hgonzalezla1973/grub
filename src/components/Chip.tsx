import { type CSSProperties } from 'react';
import { colors, fonts } from '../theme/tokens';

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0,
        paddingTop: 9,
        paddingBottom: 9,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 100,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        background: active ? colors.black : colors.white,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        fontFamily: fonts.body,
        fontSize: 12.5,
        fontWeight: 700,
        color: active ? colors.white : colors.black,
      }}
    >
      {label}
    </button>
  );
}

interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  style?: CSSProperties;
}

export function SegmentedControl<T extends string>({ options, value, onChange, style }: SegmentedControlProps<T>) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        background: colors.white,
        padding: 4,
        borderRadius: 100,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        flexShrink: 0,
        ...style,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 100,
              border: 'none',
              background: active ? colors.black : 'transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: fonts.body,
              fontSize: 12.5,
              fontWeight: 700,
              color: active ? colors.white : colors.black,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
