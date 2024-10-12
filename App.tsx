import React, { useEffect, useState, useCallback } from 'react';
import { View, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthNavigator from './src/navigators/AuthNavigator';
import MainNavigator from './src/navigators/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import * as SplashScreenExpo from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from hiding immediately
SplashScreenExpo.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const { getItem } = useAsyncStorage('assetToken');

  const prepareApp = async () => {
    try {
      // Load fonts
      await Font.loadAsync({
        'BalooPaaji2-Regular': require('./assets/fonts/BalooPaaji2-Regular.ttf'),
        'BalooPaaji2-Medium': require('./assets/fonts/BalooPaaji2-Medium.ttf'),
        'BalooPaaji2-SemiBold': require('./assets/fonts/BalooPaaji2-SemiBold.ttf'),
        'BalooPaaji2-Bold': require('./assets/fonts/BalooPaaji2-Bold.ttf'),
      });

      const token = await getItem();
      if (token) {
        setAccessToken(token);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setAppIsReady(true);
    }
  };

  useEffect(() => {
    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreenExpo.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
            <NavigationContainer>
              {accessToken ? <MainNavigator /> : <AuthNavigator />}
            </NavigationContainer>
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
