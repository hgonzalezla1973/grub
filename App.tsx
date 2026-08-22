import React, { useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  BigShouldersDisplay_800ExtraBold,
  BigShouldersDisplay_900Black,
} from '@expo-google-fonts/big-shoulders-display';
import {
  JosefinSans_400Regular,
  JosefinSans_500Medium,
  JosefinSans_600SemiBold,
  JosefinSans_700Bold,
} from '@expo-google-fonts/josefin-sans';
import { colors } from './src/theme/tokens';
import { AppProvider } from './src/state/AppState';
import { AppShell } from './src/AppShell';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    BigShouldersDisplay_900Black,
    BigShouldersDisplay_800ExtraBold,
    JosefinSans_400Regular,
    JosefinSans_500Medium,
    JosefinSans_600SemiBold,
    JosefinSans_700Bold,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: colors.cream }} onLayout={onLayout}>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </View>
    </SafeAreaProvider>
  );
}
