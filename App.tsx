import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { SoundProvider } from './src/context/SoundContext';
import { AppNavigator } from './src/navigation/AppNavigator';

// Sin servidor: ocultar avisos de red fallida
LogBox.ignoreLogs(['fetch failed', 'Failed to fetch', 'Network request failed', 'hostname could not be found']);
const _origError = console.error;
console.error = (...args: any[]) => {
  const msg = args.map((a: any) => String((a && a.message) || a)).join(' ');
  if (/fetch failed|failed to fetch|network request failed|hostname could not be found/i.test(msg)) return;
  _origError(...args);
};

export default function App() {
  useEffect(() => {
    // Default to Portrait for the whole app
    if (Platform.OS !== 'web') {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <LanguageProvider>
          <SoundProvider>
            <AppNavigator />
          </SoundProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
