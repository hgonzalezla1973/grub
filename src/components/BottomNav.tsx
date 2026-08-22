import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { useApp } from '../state/AppState';

export function BottomNav() {
  const app = useApp();

  const items = [
    {
      label: 'Explore',
      active: app.screen === 'results' && app.resultsView === 'list',
      onPress: () => app.goResults(),
    },
    {
      label: 'Map',
      active: app.screen === 'results' && app.resultsView === 'map',
      onPress: () => {
        app.setResultsView('map');
        app.goResults();
      },
    },
    { label: 'Saved', active: app.screen === 'saved', onPress: app.goSaved },
    { label: 'You', active: app.screen === 'profile', onPress: app.goProfile },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 4,
        backgroundColor: colors.black,
        padding: 5,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.black,
        marginHorizontal: 18,
        marginBottom: 14,
      }}
    >
      {items.map((it) => (
        <Pressable
          key={it.label}
          onPress={it.onPress}
          style={{
            flex: 1,
            paddingVertical: 11,
            borderRadius: 100,
            alignItems: 'center',
            backgroundColor: it.active ? colors.green : 'transparent',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.display800,
              fontSize: 16,
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: 0.3,
              color: it.active ? colors.black : colors.white,
            }}
            numberOfLines={1}
          >
            {it.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
