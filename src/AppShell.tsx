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
    <div
      style={{
        width: '100%',
        maxWidth: 480,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: colors.cream,
        overflow: 'hidden',
      }}
    >
      {showTitleBar && (
        <div
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: `calc(10px + env(safe-area-inset-top))`,
            paddingBottom: 10,
            borderBottomWidth: app.screen === 'detail' ? 0 : 2,
            borderBottomStyle: 'solid',
            borderColor: colors.black,
            background: colors.cream,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 15,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {app.screen === 'onboarding' && <OnboardingScreen />}
        {app.screen === 'home' && <HomeScreen />}
        {app.screen === 'results' && <ExploreScreen />}
        {app.screen === 'detail' && <DetailScreen />}
        {app.screen === 'saved' && <SavedScreen />}
        {app.screen === 'profile' && <ProfileScreen />}
      </div>

      {showNav && (
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)', flexShrink: 0 }}>
          <BottomNav />
        </div>
      )}
    </div>
  );
}
