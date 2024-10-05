import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/auth/LoginScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

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

    </Stack.Navigator>
  )
}

export default AuthNavigator