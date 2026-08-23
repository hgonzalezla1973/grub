import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { Chip, SegmentedControl } from '../components/Chip';
import { RestaurantCard } from '../components/RestaurantCard';
import { MapPlaceholder } from '../components/MapPlaceholder';
import { EmptyState } from '../components/EmptyState';
import { SkeletonGrid } from '../components/Skeleton';
import { COLLECTIONS } from '../data/restaurants';
import { useApp } from '../state/AppState';
import { FilterSheet } from '../components/FilterSheet';

export function ExploreScreen() {
  const app = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const resetSearchAndFilters = () => {
    app.clearFilters();
    app.setSearch('');
    app.setCollection('all');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingHorizontal: 18, paddingTop: 20, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <Text
          style={{ fontFamily: fonts.display, fontSize: 36, fontWeight: '900', lineHeight: 37.8, textTransform: 'uppercase', flex: 1 }}
          numberOfLines={2}
        >
          {app.filteredRestaurants.length} spots{'\n'}near you
        </Text>
        <Pressable
          onPress={app.openFilters}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: colors.yellow,
            borderWidth: 2,
            borderColor: colors.black,
            borderRadius: 100,
            paddingVertical: 9,
            paddingHorizontal: 14,
          }}
        >
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, fontWeight: '700' }}>Filters</Text>
          {app.hasActiveFilters && (
            <View
              style={{
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: colors.black,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
              }}
            >
              <Text style={{ color: colors.white, fontSize: 11, fontFamily: fonts.bodyBold, fontWeight: '700' }}>
                {app.activeFilterCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <TextInput
        value={app.search}
        onChangeText={app.setSearch}
        placeholder="Search food, restaurants, cafés…"
        placeholderTextColor="rgba(0,0,0,0.45)"
        style={{
          borderWidth: 2,
          borderColor: colors.black,
          borderRadius: 100,
          paddingVertical: 13,
          paddingHorizontal: 16,
          fontFamily: fonts.body,
          fontSize: 14,
          backgroundColor: colors.white,
          marginBottom: 12,
        }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
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
          <Pressable onPress={app.clearFilters}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, fontWeight: '700', textDecorationLine: 'underline' }}>
              Clear
            </Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <SkeletonGrid />
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
          <FlatList
            data={app.filteredRestaurants}
            keyExtractor={(r) => r.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
            renderItem={({ item }) => <RestaurantCard restaurant={item} style={{ flex: 1 }} />}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
            {COLLECTIONS.map(([key, label]) => (
              <Chip key={key} label={label} active={app.collection === key} onPress={() => app.setCollection(key as any)} />
            ))}
          </View>
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
        </View>
      )}

      <FilterSheet />
    </View>
  );
}
