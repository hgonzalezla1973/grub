import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { Chip } from './Chip';
import { Pill } from './Pill';
import { DIET_FILTERS, DISTANCE_FILTERS, MOOD_FILTERS } from '../data/restaurants';
import { useApp } from '../state/AppState';

export function FilterSheet() {
  const app = useApp();

  return (
    <Modal visible={app.filtersOpen} transparent animationType="fade" onRequestClose={app.closeFilters}>
      <Pressable style={{ flex: 1, backgroundColor: colors.scrim }} onPress={app.closeFilters} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '82%',
          backgroundColor: colors.cream,
          borderTopWidth: 2,
          borderColor: colors.black,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          paddingTop: 22,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <Text style={{ fontFamily: fonts.display800, fontSize: 32, fontWeight: '800', textTransform: 'uppercase' }}>Filters</Text>
          <Pressable
            onPress={app.closeFilters}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.white,
              borderWidth: 2,
              borderColor: colors.black,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700' }}>✕</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <FilterGroup label="Diet">
            {DIET_FILTERS.map(([key, label]) => (
              <Chip key={key} label={label} active={app.diet.includes(key)} onPress={() => app.toggleDiet(key)} />
            ))}
          </FilterGroup>

          <FilterGroup label="Mood">
            {MOOD_FILTERS.map(([key, label]) => (
              <Chip key={key} label={label} active={app.mood === key} onPress={() => app.setMood(key)} />
            ))}
          </FilterGroup>

          <FilterGroup label="Distance">
            {DISTANCE_FILTERS.map(([key, label]) => (
              <Chip key={key} label={label} active={app.distance === key} onPress={() => app.setDistance(key as any)} />
            ))}
          </FilterGroup>
        </ScrollView>

        <View style={{ marginTop: 8 }}>
          <Pill
            label={`Show ${app.filteredRestaurants.length} results`}
            onPress={app.closeFilters}
            labelColor={colors.black}
            variant="primary"
            style={{ backgroundColor: colors.green }}
            fontSize={20}
          />
        </View>
      </View>
    </Modal>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: fonts.bodyBold,
          fontSize: 11.5,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 0.9,
          marginBottom: 10,
          opacity: 0.7,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{children}</View>
    </View>
  );
}
