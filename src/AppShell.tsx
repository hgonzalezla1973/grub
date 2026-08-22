import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from './theme/tokens';
import { useApp } from './state/AppState';
import { BottomNav } from './components/BottomNav';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { DetailScreen } from './screens/DetailScreen';
import { SavedScreen } from './screens/SavedScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const TITLES: Record<string, string> = {
  onboarding: 'Grub',
  home: 'Home',
  results: 'Explore',
  saved: 'Saved',
  profile: 'You',
};

export function AppShell() {
  const app = useApp();
  const showNav = ['results', 'saved', 'profile'].includes(app.screen);
  const showTitleBar = app.screen !== 'onboarding';
  const title = app.screen === 'detail' ? app.selectedRestaurant?.name ?? '' : TITLES[app.screen];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      {showTitleBar && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderBottomWidth: app.screen === 'detail' ? 0 : 2,
            borderColor: colors.black,
            backgroundColor: colors.cream,
          }}
        >
          <Text
            style={{ fontFamily: fonts.display800, fontSize: 15, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        {app.screen === 'onboarding' && <OnboardingScreen />}
        {app.screen === 'home' && <HomeScreen />}
        {app.screen === 'results' && <ExploreScreen />}
        {app.screen === 'detail' && <DetailScreen />}
        {app.screen === 'saved' && <SavedScreen />}
        {app.screen === 'profile' && <ProfileScreen />}
      </View>

      {showNav && <BottomNav />}
    </SafeAreaView>
  );
}
