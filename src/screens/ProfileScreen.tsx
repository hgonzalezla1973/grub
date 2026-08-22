import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { ProgressBar } from '../components/ProgressBar';
import { PROFILE, QUESTS, rewards, STICKERS } from '../data/rewards';
import { DIET_FILTERS, DietCategory } from '../data/restaurants';
import { useApp } from '../state/AppState';

export function ProfileScreen() {
  const app = useApp();
  const pointsPct = rewards.points / rewards.nextTierPoints;
  const pointsToNext = rewards.nextTierPoints - rewards.points;

  const stats = [
    { value: String(PROFILE.reviews), label: 'Reviews', bg: colors.green },
    { value: String(PROFILE.photos), label: 'Photos', bg: colors.yellow },
    { value: String(app.favorites.length), label: 'Saved', bg: colors.coral },
  ];

  const activityRows = [
    { label: 'My reviews', detail: `${PROFILE.reviews} places reviewed` },
    { label: 'My photos', detail: `${PROFILE.photos} uploads` },
    { label: 'Saved places', detail: `${app.savedList.length} available offline` },
    { label: 'Suggest a spot', detail: "Add somewhere we're missing" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 16 }}>
      <View
        style={{
          backgroundColor: colors.purple,
          borderWidth: 2,
          borderColor: colors.black,
          borderRadius: 22,
          padding: 18,
          alignItems: 'center',
          marginBottom: 14,
          shadowColor: colors.black,
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 0,
        }}
      >
        <View
          style={{
            width: 66,
            height: 66,
            borderRadius: 33,
            backgroundColor: colors.white,
            borderWidth: 2,
            borderColor: colors.black,
            marginBottom: 10,
          }}
        />
        <Text style={{ fontFamily: fonts.display, fontSize: 34, fontWeight: '900', textTransform: 'uppercase' }}>
          {PROFILE.name}
        </Text>
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, fontWeight: '600', opacity: 0.8, marginTop: 2 }}>
          {PROFILE.location} · joined {PROFILE.joined}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
        {stats.map((s) => (
          <View
            key={s.label}
            style={{
              flex: 1,
              backgroundColor: s.bg,
              borderWidth: 2,
              borderColor: colors.black,
              borderRadius: 18,
              padding: 12,
              shadowColor: colors.black,
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            }}
          >
            <Text style={{ fontFamily: fonts.display800, fontSize: 30, fontWeight: '800' }}>{s.value}</Text>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={{
          backgroundColor: colors.green,
          borderWidth: 2,
          borderColor: colors.black,
          borderRadius: 20,
          padding: 16,
          marginBottom: 20,
          shadowColor: colors.black,
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 0,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 }}>
            Sprout points
          </Text>
          <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 12.5, fontWeight: '600' }}>🔥 {rewards.streak} week streak</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 42, fontWeight: '900' }}>{rewards.points.toLocaleString()}</Text>
          <View
            style={{
              backgroundColor: colors.white,
              borderWidth: 2,
              borderColor: colors.black,
              borderRadius: 100,
              paddingVertical: 5,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, fontWeight: '700' }} numberOfLines={1}>
              {rewards.tier}
            </Text>
          </View>
        </View>
        <ProgressBar progress={pointsPct} />
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 12, fontWeight: '600', marginTop: 8, opacity: 0.85 }}>
          {pointsToNext} points to {rewards.nextTier} — unlocks {rewards.nextPerk}.
        </Text>
      </View>

      <Text style={{ fontFamily: fonts.display800, fontSize: 26, fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 }}>
        This month's quests
      </Text>
      <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 12.5, fontWeight: '600', opacity: 0.7, marginBottom: 10 }}>
        Resets in 9 days
      </Text>
      <View style={{ gap: 10, marginBottom: 20 }}>
        {QUESTS.map((q) => (
          <View
            key={q.title}
            style={{
              backgroundColor: q.bg,
              borderWidth: 2,
              borderColor: colors.black,
              borderRadius: 20,
              padding: 14,
              shadowColor: colors.black,
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontFamily: fonts.display800, fontSize: 23, fontWeight: '800', textTransform: 'uppercase', flex: 1 }} numberOfLines={1}>
                {q.title}
              </Text>
              <View style={{ backgroundColor: colors.black, borderRadius: 100, paddingVertical: 4, paddingHorizontal: 10 }}>
                <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 12, fontWeight: '700' }}>+{q.reward}</Text>
              </View>
            </View>
            <Text style={{ fontFamily: fonts.body, fontSize: 13.5, lineHeight: 18, marginBottom: 10 }}>{q.detail}</Text>
            <ProgressBar progress={q.done / q.goal} height={12} />
            <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 12, fontWeight: '600', marginTop: 6, opacity: 0.85 }}>
              {q.done} of {q.goal} done
            </Text>
          </View>
        ))}
      </View>

      <Text style={{ fontFamily: fonts.display800, fontSize: 26, fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 }}>
        Sticker book
      </Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 13, opacity: 0.7, marginBottom: 10, lineHeight: 18 }}>
        Earn one for every milestone. Trade nothing, brag freely.
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        {STICKERS.map((st) => (
          <View
            key={st.label}
            style={{
              width: '22%',
              aspectRatio: 1,
              borderWidth: 2,
              borderColor: colors.black,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              backgroundColor: st.earned ? colors.white : 'rgba(0,0,0,0.06)',
              opacity: st.earned ? 1 : 0.45,
              shadowColor: colors.black,
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: st.earned ? 1 : 0,
              shadowRadius: 0,
            }}
          >
            <Text style={{ fontSize: 22, marginBottom: 4 }}>{st.icon}</Text>
            <Text
              style={{ fontFamily: fonts.bodyBold, fontSize: 8.5, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', letterSpacing: -0.1 }}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {st.label}
            </Text>
          </View>
        ))}
      </View>

      <Text style={{ fontFamily: fonts.display800, fontSize: 26, fontWeight: '800', textTransform: 'uppercase', marginBottom: 10 }}>
        My diet
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
        {DIET_FILTERS.map(([key, label]) => {
          const active = app.diet.includes(key);
          return (
            <Pressable
              key={key}
              onPress={() => app.toggleDiet(key as DietCategory)}
              style={{
                paddingVertical: 9,
                paddingHorizontal: 15,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: colors.black,
                backgroundColor: active ? colors.black : colors.white,
              }}
            >
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, fontWeight: '700', color: active ? colors.white : colors.black }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ fontFamily: fonts.body, fontSize: 12.5, opacity: 0.65, marginBottom: 20 }}>
        Used as the default filter every time you search.
      </Text>

      <Text style={{ fontFamily: fonts.display800, fontSize: 26, fontWeight: '800', textTransform: 'uppercase', marginBottom: 10 }}>
        Activity
      </Text>
      <View style={{ gap: 8, marginBottom: 22 }}>
        {activityRows.map((row) => (
          <View
            key={row.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: colors.white,
              borderWidth: 2,
              borderColor: colors.black,
              borderRadius: 18,
              padding: 14,
            }}
          >
            <View>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, fontWeight: '700' }}>{row.label}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 12.5, opacity: 0.7, marginTop: 2 }}>{row.detail}</Text>
            </View>
            <Text style={{ fontSize: 20 }}>›</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={app.goHome}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, fontWeight: '700', textDecorationLine: 'underline', textAlign: 'center' }}>
          Back to home
        </Text>
      </Pressable>
    </ScrollView>
  );
}
