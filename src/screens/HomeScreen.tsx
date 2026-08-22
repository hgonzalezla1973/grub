import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { Pill } from '../components/Pill';
import { SegmentedControl } from '../components/Chip';
import { useApp } from '../state/AppState';

export function HomeScreen() {
  const app = useApp();
  const locationLabel = app.mode === 'trip' ? app.destination || 'Planning a trip' : 'Current location';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 28 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 }} numberOfLines={1}>
          📍 {locationLabel}
        </Text>
        <Pressable
          onPress={app.goProfile}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.purple,
            borderWidth: 2,
            borderColor: colors.black,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.black,
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 1,
            shadowRadius: 0,
          }}
        >
          <Text style={{ fontFamily: fonts.display800, fontSize: 14, fontWeight: '800' }}>MR</Text>
        </Pressable>
      </View>

      <Text style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: '900', lineHeight: 52, textTransform: 'uppercase', marginBottom: 18 }}>
        What are{'\n'}you craving?
      </Text>

      <SegmentedControl
        options={[
          { label: 'Near me', value: 'near' },
          { label: 'Plan a trip', value: 'trip' },
        ]}
        value={app.mode}
        onChange={app.setMode}
        style={{ marginBottom: 16, alignSelf: 'flex-start' }}
      />

      {app.mode === 'trip' && (
        <TextInput
          value={app.destination}
          onChangeText={app.setDestination}
          placeholder="Where are you headed?"
          placeholderTextColor="rgba(0,0,0,0.45)"
          style={{
            borderWidth: 2,
            borderColor: colors.black,
            borderRadius: 16,
            paddingVertical: 13,
            paddingHorizontal: 16,
            fontFamily: fonts.body,
            fontSize: 15,
            backgroundColor: colors.white,
            marginBottom: 16,
          }}
        />
      )}

      <View
        style={{
          backgroundColor: colors.coral,
          borderWidth: 2,
          borderColor: colors.black,
          borderRadius: 22,
          padding: 20,
          marginBottom: 14,
          shadowColor: colors.black,
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 0,
        }}
      >
        <Text style={{ fontFamily: fonts.display, fontSize: 34, fontWeight: '900', lineHeight: 34, textTransform: 'uppercase', marginBottom: 8 }}>
          Browse{'\n'}every spot
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 21, opacity: 0.85, marginBottom: 16 }}>
          Filter by 100% vegan, vegan options or vegetarian options.
        </Text>
        <Pill label="Find food" onPress={app.goResults} fontSize={20} style={{ width: undefined, paddingVertical: 15 }} />
      </View>

      <Pressable
        onPress={app.goSaved}
        style={{
          backgroundColor: colors.blue,
          borderWidth: 2,
          borderColor: colors.black,
          borderRadius: 22,
          padding: 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          shadowColor: colors.black,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
        }}
      >
        <View>
          <Text style={{ fontFamily: fonts.display800, fontSize: 23, fontWeight: '800', textTransform: 'uppercase' }}>
            Saved · {app.favorites.length}
          </Text>
          <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, opacity: 0.78, marginTop: 2 }}>Works offline</Text>
        </View>
        <Text style={{ fontSize: 26 }}>♥</Text>
      </Pressable>
    </ScrollView>
  );
}
