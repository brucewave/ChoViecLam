import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../auth/LoginScreen';

const AuthNavigator = () => {

    const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator 
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name='LoginScreen' component={LoginScreen}>
        </Stack.Screen>

    </Stack.Navigator>
  )
}

export default AuthNavigator