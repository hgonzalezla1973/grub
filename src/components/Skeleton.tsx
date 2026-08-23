import { type CSSProperties } from 'react';
import { colors } from '../theme/tokens';

interface BlockProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: CSSProperties;
}

export function SkeletonBlock({ width = '100%', height = 16, radius = 8, style }: BlockProps) {
  return (
    <div
      className="skeleton-pulse"
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'rgba(0,0,0,0.09)',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.15)',
        ...style,
      }}
    />
  );
}

export function SkeletonRestaurantCard() {
  return (
    <div
      style={{
        flex: 1,
        background: colors.white,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.15)',
        borderRadius: 20,
        padding: 10,
      }}
    >
      <SkeletonBlock height={88} radius={14} style={{ marginBottom: 10 }} />
      <SkeletonBlock height={18} width="80%" radius={6} style={{ marginBottom: 8 }} />
      <SkeletonBlock height={12} width="55%" radius={6} style={{ marginBottom: 10 }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <SkeletonBlock height={20} width={44} radius={100} />
        <SkeletonBlock height={20} width={44} radius={100} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  const rows = [];
  for (let i = 0; i < count; i += 2) {
    rows.push(
      <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <SkeletonRestaurantCard />
        {i + 1 < count ? <SkeletonRestaurantCard /> : <div style={{ flex: 1 }} />}
      </div>
    );
  }
  return <div>{rows}</div>;
}

export function SkeletonDetail() {
  return (
    <div style={{ flex: 1 }}>
      <SkeletonBlock height={200} radius={0} />
      <div style={{ padding: 20 }}>
        <SkeletonBlock height={36} width="70%" radius={8} style={{ marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          <SkeletonBlock height={24} width={70} radius={100} />
          <SkeletonBlock height={24} width={50} radius={100} />
          <SkeletonBlock height={24} width={90} radius={100} />
        </div>
        <SkeletonBlock height={14} width="90%" radius={6} style={{ marginBottom: 8 }} />
        <SkeletonBlock height={14} width="60%" radius={6} style={{ marginBottom: 20 }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <SkeletonBlock height={44} radius={100} style={{ flex: 1 }} />
          <SkeletonBlock height={44} radius={100} style={{ flex: 1 }} />
          <SkeletonBlock height={44} radius={100} style={{ flex: 1 }} />
        </div>
        <SkeletonBlock height={100} radius={20} style={{ marginBottom: 24 }} />
        <SkeletonBlock height={50} radius={16} style={{ marginBottom: 8 }} />
        <SkeletonBlock height={50} radius={16} style={{ marginBottom: 8 }} />
        <SkeletonBlock height={50} radius={16} />
      </div>
    </div>
  );
}
