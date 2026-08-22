import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { FavoriteButton } from '../components/FavoriteButton';
import { colorForRestaurant } from '../components/RestaurantCard';
import { priceLabel, Restaurant } from '../data/restaurants';
import { useApp } from '../state/AppState';

export function SavedScreen() {
  const app = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 20 }}>
      <Pressable onPress={app.goHome} style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
        <View
          style={{
            backgroundColor: colors.white,
            borderWidth: 2,
            borderColor: colors.black,
            borderRadius: 100,
            paddingVertical: 8,
            paddingHorizontal: 14,
          }}
        >
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, fontWeight: '700' }}>← Home</Text>
        </View>
      </Pressable>

      <Text style={{ fontFamily: fonts.display, fontSize: 44, fontWeight: '900', textTransform: 'uppercase', marginBottom: 12 }}>
        Saved
      </Text>

      <View
        style={{
          alignSelf: 'flex-start',
          backgroundColor: colors.green,
          borderWidth: 2,
          borderColor: colors.black,
          borderRadius: 100,
          paddingVertical: 6,
          paddingHorizontal: 12,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Available offline
        </Text>
      </View>

      {app.savedList.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
          <Text style={{ fontSize: 56, marginBottom: 10 }}>♡</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 15, textAlign: 'center', lineHeight: 21, maxWidth: 260 }}>
            Tap the heart on any spot to keep it here — no signal needed.
          </Text>
        </View>
      ) : (
        <FlatList
          data={app.savedList}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => <SavedRow restaurant={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function SavedRow({ restaurant: r }: { restaurant: Restaurant }) {
  const app = useApp();
  const favorite = app.favorites.includes(r.id);
  return (
    <Pressable
      onPress={() => app.openDetail(r.id)}
      style={{
        position: 'relative',
        backgroundColor: colorForRestaurant(r),
        borderWidth: 2,
        borderColor: colors.black,
        borderRadius: 20,
        padding: 12,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
      }}
    >
      <PhotoPlaceholder width={58} height={58} radius={14} onColor />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: fonts.display800, fontSize: 25, fontWeight: '800', textTransform: 'uppercase', lineHeight: 26.8 }} numberOfLines={1}>
          {r.name}
        </Text>
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, fontWeight: '600', opacity: 0.78, marginTop: 2 }}>
          ★ {r.rating} · {priceLabel(r.price)} · {r.distance} mi
        </Text>
      </View>
      <FavoriteButton
        active={favorite}
        onPress={() => app.toggleFavorite(r.id)}
        size={26}
        style={{ position: 'absolute', top: 10, right: 10 }}
      />
    </Pressable>
  );
}
