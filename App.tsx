import React, { useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthNavigator from './src/navigators/AuthNavigator';
import MainNavigator from './src/navigators/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import * as SplashScreenExpo from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import SplashScreen from './src/screens/SplashScreen';
import AppRouters from './src/navigators/AppRouters';

SplashScreenExpo.preventAutoHideAsync();

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);


  const prepareApp = async () => {
    try {
      await Font.loadAsync({
        'BalooPaaji2-Regular': require('./assets/fonts/BalooPaaji2-Regular.ttf'),
        'BalooPaaji2-Medium': require('./assets/fonts/BalooPaaji2-Medium.ttf'),
        'BalooPaaji2-SemiBold': require('./assets/fonts/BalooPaaji2-SemiBold.ttf'),
        'BalooPaaji2-Bold': require('./assets/fonts/BalooPaaji2-Bold.ttf'),
      });
    } catch (e) {
      console.warn('Error loading fonts:', e);
    } finally {
      setIsShowSplash(false);
      SplashScreenExpo.hideAsync();
    }
  };

useEffect(() => {
  prepareApp();
}, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);


  return (
    <>
    <Provider store={store}>
    <StatusBar
    barStyle="dark-content"
    backgroundColor="transparent"
    translucent
    />
    {isShowSplash ? <SplashScreen /> : (
      <NavigationContainer>
        <AppRouters />
      </NavigationContainer>
    )}
    </Provider>
    </>
  )
};

export default App;
