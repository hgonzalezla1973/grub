import React, { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { FavoriteButton } from '../components/FavoriteButton';
import { Badge } from '../components/Badge';
import { colorForRestaurant } from '../components/RestaurantCard';
import { SkeletonDetail } from '../components/Skeleton';
import { DIET_LABEL, isGem, priceLabel } from '../data/restaurants';
import { useApp } from '../state/AppState';

export function DetailScreen() {
  const app = useApp();
  const r = app.selectedRestaurant;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [r?.id]);

  if (!r) return null;

  if (loading) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.cream }} showsVerticalScrollIndicator={false}>
        <SkeletonDetail />
      </ScrollView>
    );
  }

  const favorite = app.favorites.includes(r.id);
  const gem = isGem(r);
  const query = encodeURIComponent(`${r.name} ${r.address}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const wazeUrl = `https://waze.com/ul?q=${query}&navigate=yes`;
  const telUrl = `tel:${r.phone}`;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }} showsVerticalScrollIndicator={false}>
      <View style={{ height: 200, position: 'relative' }}>
        <PhotoPlaceholder
          width="100%"
          height="100%"
          radius={0}
          bordered={false}
          baseColor={colorForRestaurant(r)}
          onColor
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: colors.black,
          }}
        />
        <Pressable
          onPress={app.backToResults}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            backgroundColor: colors.white,
            borderWidth: 2,
            borderColor: colors.black,
            borderRadius: 100,
            paddingVertical: 8,
            paddingHorizontal: 14,
          }}
        >
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, fontWeight: '700' }}>← Back</Text>
        </Pressable>
        <FavoriteButton
          active={favorite}
          onPress={() => app.toggleFavorite(r.id)}
          size={36}
          style={{ position: 'absolute', top: 16, right: 16 }}
        />
      </View>

      <View style={{ padding: 20 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 44, fontWeight: '900', lineHeight: 44, textTransform: 'uppercase', marginBottom: 10 }}>
          {r.name}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          <Badge label={`★ ${r.rating} (${r.reviewCount})`} />
          <Badge label={priceLabel(r.price)} />
          <Badge label={DIET_LABEL[r.dietCategory]} filled />
          {r.isFastFood && <Badge label="Fast food" bg={colors.yellow} />}
          {gem && <Badge label="Hidden gem" bg={colors.purple} />}
        </View>

        <Text style={{ fontFamily: fonts.body, fontSize: 14, opacity: 0.75, lineHeight: 19.6 }}>
          {r.distance} mi away · {r.address}
        </Text>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, fontWeight: '700', marginTop: 2, marginBottom: 16 }}>
          {r.hours}
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          <ActionPill label="Maps" bg={colors.green} onPress={() => Linking.openURL(googleMapsUrl)} />
          <ActionPill label="Waze" bg={colors.blue} onPress={() => Linking.openURL(wazeUrl)} />
          <ActionPill label="Call" bg={colors.white} onPress={() => Linking.openURL(telUrl)} />
        </View>

        <View
          style={{
            backgroundColor: colors.yellow,
            borderWidth: 2,
            borderColor: colors.black,
            borderRadius: 20,
            padding: 16,
            marginBottom: 22,
            shadowColor: colors.black,
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 1,
            shadowRadius: 0,
          }}
        >
          <Text style={{ fontFamily: fonts.display800, fontSize: 22, fontWeight: '800', textTransform: 'uppercase', marginBottom: 6 }}>
            Eaten here?
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 19.6, marginBottom: 12 }}>
            You're the 3rd person to open this page today. Be the one who says what's actually vegan.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
            <Pressable style={{ flex: 1, backgroundColor: colors.black, borderRadius: 100, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.display800, fontSize: 14, fontWeight: '800', color: colors.white, textTransform: 'uppercase' }}>
                Review +100
              </Text>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                backgroundColor: colors.white,
                borderWidth: 2,
                borderColor: colors.black,
                borderRadius: 100,
                paddingVertical: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: fonts.display800, fontSize: 14, fontWeight: '800', textTransform: 'uppercase' }}>Photo +50</Text>
            </Pressable>
          </View>
          <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 12, fontWeight: '600', opacity: 0.8 }}>
            First review here earns the ⭐ Trailblazer sticker.
          </Text>
        </View>

        <SectionHeading title="Vegan & veg options" />
        <View style={{ gap: 8, marginBottom: 22 }}>
          {r.menu.map((m) => (
            <View
              key={m.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.white,
                borderWidth: 2,
                borderColor: colors.black,
                borderRadius: 16,
                paddingVertical: 11,
                paddingHorizontal: 14,
              }}
            >
              <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 }}>
                {m.name}
              </Text>
              <Badge label={m.tag === 'vegan' ? 'Vegan' : 'Vegetarian'} bg={m.tag === 'vegan' ? colors.green : colors.yellow} />
            </View>
          ))}
        </View>

        <Text style={{ fontFamily: fonts.body, fontSize: 14, opacity: 0.75, lineHeight: 19.6, marginBottom: 22 }}>
          {r.note}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <SectionHeading title="Photos" noMargin />
          <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, fontWeight: '600', opacity: 0.7 }}>
            {r.photoCount} photos
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 22 }}>
          {[0, 1, 2].map((i) => (
            <PhotoPlaceholder key={i} width="31%" height={90} radius={14} />
          ))}
        </View>

        <SectionHeading title={`Reviews · ${r.reviewCount}`} />
        <View style={{ gap: 10 }}>
          {r.reviews.map((rev, i) => (
            <View
              key={i}
              style={{
                backgroundColor: colors.white,
                borderWidth: 2,
                borderColor: colors.black,
                borderRadius: 18,
                padding: 14,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, fontWeight: '700' }}>{rev.author}</Text>
                <Badge label={`★ ${rev.rating}`} bg={colors.yellow} />
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 19.6, opacity: 0.85 }}>{rev.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function SectionHeading({ title, noMargin }: { title: string; noMargin?: boolean }) {
  return (
    <Text
      style={{
        fontFamily: fonts.display800,
        fontSize: 26,
        fontWeight: '800',
        textTransform: 'uppercase',
        lineHeight: 28.6,
        marginBottom: noMargin ? 0 : 10,
      }}
    >
      {title}
    </Text>
  );
}

function ActionPill({ label, bg, onPress }: { label: string; bg: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: bg,
        borderWidth: 2,
        borderColor: colors.black,
        borderRadius: 100,
        paddingVertical: 13,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontFamily: fonts.display800, fontSize: 15, fontWeight: '800', textTransform: 'uppercase' }}>{label}</Text>
    </Pressable>
  );
}
