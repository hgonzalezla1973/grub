import type { ReactNode } from 'react';
import { colors, fonts } from '../theme/tokens';
import { Chip } from './Chip';
import { Pill } from './Pill';
import { DIET_FILTERS, DISTANCE_FILTERS, MOOD_FILTERS } from '../data/restaurants';
import { useApp, type DistanceKey } from '../state/AppState';

export function FilterSheet() {
  const app = useApp();

  if (!app.filtersOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div
        onClick={app.closeFilters}
        style={{ position: 'absolute', inset: 0, background: colors.scrim }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 430,
          maxHeight: '82%',
          background: colors.cream,
          borderTopWidth: 2,
          borderTopStyle: 'solid',
          borderColor: colors.black,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          paddingTop: 22,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 32, fontWeight: 800, textTransform: 'uppercase' }}>Filters</span>
          <button
            type="button"
            onClick={app.closeFilters}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              background: colors.white,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.black,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ overflowY: 'auto' }}>
          <FilterGroup label="Diet">
            {DIET_FILTERS.map(([key, label]) => (
              <Chip key={key} label={label} active={app.diet.includes(key)} onClick={() => app.toggleDiet(key)} />
            ))}
          </FilterGroup>

          <FilterGroup label="Mood">
            {MOOD_FILTERS.map(([key, label]) => (
              <Chip key={key} label={label} active={app.mood === key} onClick={() => app.setMood(key)} />
            ))}
          </FilterGroup>

          <FilterGroup label="Distance">
            {DISTANCE_FILTERS.map(([key, label]) => (
              <Chip
                key={key}
                label={label}
                active={app.distance === key}
                onClick={() => app.setDistance(key as DistanceKey)}
              />
            ))}
          </FilterGroup>
        </div>

        <div style={{ marginTop: 8 }}>
          <Pill
            label={`Show ${app.filteredRestaurants.length} results`}
            onClick={app.closeFilters}
            variant="primary"
            labelColor={colors.black}
            style={{ background: colors.green }}
            fontSize={20}
          />
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 11.5,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.9,
          marginBottom: 10,
          opacity: 0.7,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{children}</div>
    </div>
  );
}
