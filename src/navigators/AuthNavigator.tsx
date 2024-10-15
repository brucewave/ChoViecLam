import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import { LoginScreen, SignUpScreen, Verification, ForgotPassword } from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();
  // const [isUserExisting, setIsUserExisting] = useState(false);
  //   useEffect(() => {
  //       checkUserExisting();
  //   }, []);
  //   const checkUserExisting = async () => {
  //       const res = await AsyncStorage.getItem('auth');
  //         res &&  setIsUserExisting(true);
  //   }
  //   console.log(isUserExisting);

  return (
    <Stack.Navigator 
        screenOptions={{
            headerShown: false
    }}>
       <Stack.Screen name='OnboardingScreen' component={OnboardingScreen}>
       </Stack.Screen>
        <Stack.Screen name='LoginScreen' component={LoginScreen} />
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
        <Stack.Screen name='Verification' component={Verification}>
        </Stack.Screen>
        <Stack.Screen name='ForgotPassword' component={ForgotPassword}>
        </Stack.Screen>
    </Stack.Navigator>
  )
}

export default AuthNavigator