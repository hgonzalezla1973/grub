import { colors } from '../theme/tokens';

interface Props {
  progress: number;
  height?: number;
  trackColor?: string;
}

export function ProgressBar({ progress, height = 16, trackColor = colors.white }: Props) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <div
      style={{
        height,
        borderRadius: 100,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        background: trackColor,
        overflow: 'hidden',
      }}
    >
      <div style={{ height: '100%', width: `${pct * 100}%`, background: colors.black }} />
    </div>
  );
}
