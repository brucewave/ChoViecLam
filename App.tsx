import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SplashScreen } from './src/screens';
import AuthNavigator from './src/screens/navigators/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {

  const [isShowSpalash, setIsShowSplash] = useState(true);
  useEffect(()=>{
    const timeout = setTimeout(()=>{
      setIsShowSplash(false)
    },1500)

    return () => clearTimeout(timeout);

  })


  return (
    isShowSpalash ? <SplashScreen/> : <NavigationContainer>
      <AuthNavigator/>
    </NavigationContainer>
  )
}

export default App