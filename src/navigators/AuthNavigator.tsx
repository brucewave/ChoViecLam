import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import { LoginScreen, SignUpScreen, Verication, ForgotPassword } from '../screens';

const AuthNavigator = () => {

    const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator 
        screenOptions={{
            headerShown: false
        }}
    >
       <Stack.Screen name='OnboardingScreen' component={OnboardingScreen}>
       </Stack.Screen>
        <Stack.Screen name='LoginScreen' component={LoginScreen}>
        </Stack.Screen>
        <Stack.Screen name='SignUpScreen' component={SignUpScreen}>
        </Stack.Screen>
        <Stack.Screen name='Verication' component={Verication}>
        </Stack.Screen>
        <Stack.Screen name='ForgotPassword' component={ForgotPassword}>
        </Stack.Screen>
    </Stack.Navigator>
  )
}

export default AuthNavigator