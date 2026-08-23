import { useEffect, useState } from 'react';
import { colors, fonts } from '../theme/tokens';
import { Chip, SegmentedControl } from '../components/Chip';
import { RestaurantCard } from '../components/RestaurantCard';
import { MapPlaceholder } from '../components/MapPlaceholder';
import { EmptyState } from '../components/EmptyState';
import { SkeletonGrid } from '../components/Skeleton';
import { DataSourceBanner } from '../components/DataSourceBanner';
import { COLLECTIONS } from '../data/restaurants';
import { useApp, type Collection } from '../state/AppState';
import { FilterSheet } from '../components/FilterSheet';

export function ExploreScreen() {
  const app = useApp();
  const [minTimerDone, setMinTimerDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimerDone(true), 550);
    return () => clearTimeout(t);
  }, []);

  // A brief minimum skeleton flash for the (instant) sample-data case, plus the real
  // network wait when an actual Places search is in flight.
  const loading = !minTimerDone || app.restaurantsStatus === 'loading';

  const resetSearchAndFilters = () => {
    app.clearFilters();
    app.setSearch('');
    app.setCollection('all');
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        background: colors.cream,
        paddingLeft: 18,
        paddingRight: 18,
        paddingTop: 20,
        paddingBottom: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 10 }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 36,
            fontWeight: 900,
            lineHeight: 1.05,
            textTransform: 'uppercase',
            flex: 1,
          }}
        >
          {app.filteredRestaurants.length} spots
          <br />
          near you
        </div>
        <button
          type="button"
          onClick={app.openFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: colors.yellow,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: colors.black,
            borderRadius: 100,
            paddingTop: 9,
            paddingBottom: 9,
            paddingLeft: 14,
            paddingRight: 14,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 700 }}>Filters</span>
          {app.hasActiveFilters && (
            <span
              style={{
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                background: colors.black,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 4,
                paddingRight: 4,
                color: colors.white,
                fontSize: 11,
                fontFamily: fonts.body,
                fontWeight: 700,
              }}
            >
              {app.activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <SegmentedControl
        options={[
          { label: 'All', value: 'all' },
          { label: 'Vegan', value: 'vegan' },
          { label: 'Vegetarian', value: 'vegetarian' },
        ]}
        value={app.quickDiet}
        onChange={app.setQuickDiet}
        style={{ alignSelf: 'flex-start', marginBottom: 12 }}
      />

      <DataSourceBanner status={app.restaurantsStatus} usingSampleData={app.usingSampleData} />

      <input
        value={app.search}
        onChange={(e) => app.setSearch(e.target.value)}
        placeholder="Search food, restaurants, cafés…"
        style={{
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: colors.black,
          borderRadius: 100,
          paddingTop: 13,
          paddingBottom: 13,
          paddingLeft: 16,
          paddingRight: 16,
          fontSize: 14,
          background: colors.white,
          marginBottom: 12,
          outline: 'none',
          width: '100%',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <SegmentedControl
          options={[
            { label: 'Distance', value: 'distance' },
            { label: 'Rating', value: 'rating' },
          ]}
          value={app.sort}
          onChange={app.setSort}
        />
        <SegmentedControl
          options={[
            { label: 'List', value: 'list' },
            { label: 'Map', value: 'map' },
          ]}
          value={app.resultsView}
          onChange={app.setResultsView}
        />
        {app.hasActiveFilters && (
          <button
            type="button"
            onClick={app.clearFilters}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: fonts.body,
              fontSize: 12.5,
              fontWeight: 700,
              textDecoration: 'underline',
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ overflowY: 'auto' }}>
            <SkeletonGrid />
          </div>
        ) : app.resultsView === 'list' ? (
          app.filteredRestaurants.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No spots match"
              detail="Try a different search term, or clear your filters to see everything nearby."
              actionLabel="Reset search & filters"
              onAction={resetSearchAndFilters}
            />
          ) : (
            <div
              style={{
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                alignContent: 'start',
                paddingBottom: 12,
              }}
            >
              {app.filteredRestaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )
        ) : (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {COLLECTIONS.map(([key, label]) => (
                <Chip key={key} label={label} active={app.collection === key} onClick={() => app.setCollection(key as Collection)} />
              ))}
            </div>
            {app.filteredRestaurants.length === 0 ? (
              <EmptyState
                icon="🗺️"
                title="Nothing on the map"
                detail="No spots match this collection and filter combo. Try a different one."
                actionLabel="Reset search & filters"
                onAction={resetSearchAndFilters}
              />
            ) : (
              <MapPlaceholder restaurants={app.filteredRestaurants} />
            )}
          </div>
        )}
      </div>

      <FilterSheet />
    </div>
  );
}
