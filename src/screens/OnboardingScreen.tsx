import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { colors, fonts } from '../theme/tokens';
import { Pill } from '../components/Pill';
import { DIET_LABEL, DietCategory } from '../data/restaurants';
import { useApp } from '../state/AppState';

const STEP_BG: Record<1 | 2 | 3, string> = { 1: colors.green, 2: colors.coral, 3: colors.blue };

const DIET_CARDS: { key: DietCategory; label: string; detail: string }[] = [
  { key: 'vegan', label: '100% Vegan', detail: 'Only kitchens with no animal products at all.' },
  { key: 'veganOptions', label: 'Vegan options', detail: 'Any restaurant with dishes marked vegan.' },
  { key: 'vegetarian', label: 'Vegetarian options', detail: 'Meat-free dishes, dairy and egg are fine.' },
];

export function OnboardingScreen() {
  const app = useApp();
  const bg = STEP_BG[app.onboardStep];

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 28 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={{
                width: n === app.onboardStep ? 26 : 9,
                height: 9,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: colors.black,
                backgroundColor: n <= app.onboardStep ? colors.black : 'transparent',
              }}
            />
          ))}
        </View>
        {app.onboardStep < 3 && (
          <Pressable onPress={app.goHome}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, fontWeight: '700', textDecorationLine: 'underline' }}>
              Skip
            </Text>
          </Pressable>
        )}
      </View>

      {app.onboardStep === 1 && <StepOne />}
      {app.onboardStep === 2 && <StepTwo />}
      {app.onboardStep === 3 && <StepThree />}
    </View>
  );
}

type LocationStatus = 'idle' | 'requesting' | 'denied';

function StepOne() {
  const app = useApp();
  const [status, setStatus] = useState<LocationStatus>('idle');

  const handleUseLocation = async () => {
    setStatus('requesting');
    try {
      const { status: permission } = await Location.requestForegroundPermissionsAsync();
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      app.setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      app.onboardNext();
    } catch {
      setStatus('denied');
    }
  };

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 104, fontWeight: '900', lineHeight: 104, textTransform: 'uppercase', marginBottom: 14 }}>
          Grub
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 16, opacity: 0.78, lineHeight: 22.4, maxWidth: 290, marginBottom: 24 }}>
          Find the closest place you can actually order from, whether you're fully vegan or just skipping the meat.
        </Text>
        <View
          style={{
            backgroundColor: colors.white,
            borderWidth: 2,
            borderColor: colors.black,
            borderRadius: 20,
            padding: 16,
            shadowColor: colors.black,
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 1,
            shadowRadius: 0,
          }}
        >
          <Text style={{ fontFamily: fonts.display800, fontSize: 26, fontWeight: '800', textTransform: 'uppercase', lineHeight: 28.6 }}>
            Where are you?
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 13.5, opacity: 0.75, marginTop: 5, lineHeight: 18.9 }}>
            We use your location to sort spots by how far you'd have to walk or drive. Nothing is shared.
          </Text>
        </View>
      </View>

      {status === 'denied' && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.08)',
            borderWidth: 2,
            borderColor: colors.black,
            borderRadius: 14,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, fontWeight: '700' }}>Location access is off</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12.5, opacity: 0.8, marginTop: 2, lineHeight: 17 }}>
            Turn it on in Settings any time, or just enter a city below to keep going.
          </Text>
        </View>
      )}

      <View style={{ gap: 10 }}>
        <Pill
          label={status === 'requesting' ? 'Checking…' : 'Use my location'}
          onPress={handleUseLocation}
          labelColor={colors.green}
          disabled={status === 'requesting'}
        />
        <Pill label="Enter a city instead" onPress={app.onboardNext} variant="outline" fontSize={19} />
      </View>
    </>
  );
}

function StepTwo() {
  const app = useApp();
  const hasAny = app.diet.length > 0;
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: '900', lineHeight: 52, textTransform: 'uppercase', marginBottom: 8 }}>
          How do{'\n'}you eat?
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 15, opacity: 0.78, lineHeight: 21, marginBottom: 20 }}>
          Pick anything that applies. This becomes your default filter — change it any time.
        </Text>
        <View style={{ gap: 10 }}>
          {DIET_CARDS.map((d) => {
            const on = app.diet.includes(d.key);
            return (
              <Pressable
                key={d.key}
                onPress={() => app.toggleDiet(d.key)}
                style={{
                  backgroundColor: on ? colors.black : colors.white,
                  borderWidth: 2,
                  borderColor: colors.black,
                  borderRadius: 20,
                  padding: 14,
                  paddingHorizontal: 16,
                  shadowColor: colors.black,
                  shadowOffset: { width: 4, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.display800,
                    fontSize: 26,
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    lineHeight: 28.6,
                    color: on ? colors.white : colors.black,
                  }}
                >
                  {d.label}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 13,
                    opacity: 0.75,
                    marginTop: 4,
                    lineHeight: 17.5,
                    color: on ? colors.white : colors.black,
                  }}
                >
                  {d.detail}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Pill label={hasAny ? 'Looks right' : 'Show me everything'} onPress={app.onboardNext} labelColor={colors.coral} />
    </>
  );
}

function StepThree() {
  const app = useApp();
  const teaser = app.filteredRestaurants.slice(0, 3);
  const line = app.diet.length
    ? 'Matching your diet, closest first. Tap any spot for dish-level detail.'
    : 'Everything nearby with vegan or vegetarian options, closest first.';

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', minHeight: 0 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: '900', lineHeight: 52, textTransform: 'uppercase', marginBottom: 6 }}>
          {app.filteredRestaurants.length} spots{'\n'}are ready
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 15, opacity: 0.78, lineHeight: 21, marginBottom: 18 }}>{line}</Text>
        <View style={{ gap: 10 }}>
          {teaser.map((r) => (
            <View
              key={r.id}
              style={{
                backgroundColor: colors.white,
                borderWidth: 2,
                borderColor: colors.black,
                borderRadius: 18,
                padding: 11,
                flexDirection: 'row',
                gap: 11,
                alignItems: 'center',
                shadowColor: colors.black,
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 0,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: colors.black,
                  backgroundColor: '#eee',
                }}
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: fonts.display800, fontSize: 23, fontWeight: '800', textTransform: 'uppercase', lineHeight: 24.8 }} numberOfLines={1}>
                  {r.name}
                </Text>
                <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 12, fontWeight: '600', opacity: 0.75, marginTop: 2 }}>
                  ★ {r.rating} · {r.distance} mi · {DIET_LABEL[r.dietCategory]}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Pill label="Start exploring" onPress={app.startQuiz} labelColor={colors.blue} />
    </>
  );
}
