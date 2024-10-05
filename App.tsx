import { View, Text, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SplashScreen } from './src/screens';
import AuthNavigator from './src/navigators/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import MainNavigator from './src/navigators/MainNavigator';

const App = () => {
  // State
  const [isShowSpalash, setIsShowSplash] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  
  // Constant
  const {getItem, setItem} = useAsyncStorage('assetToken');
  

  //Function
  useEffect(()=>{
    const timeout = setTimeout(()=>{
      setIsShowSplash(false)
    },1500)

    return () => clearTimeout(timeout);

  })

  useEffect(() => {
    checkLogin();
  }, [])


  const checkLogin = async () => {
    const token = await getItem()
    token && setAccessToken(token);
    console.log(token)
  }

  return (
    <>
    <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
    {isShowSpalash ? (<SplashScreen/>
  ) : (<NavigationContainer>
    {
      accessToken ? <MainNavigator/> : <AuthNavigator/>
    }
    </NavigationContainer>
    )}
    </>
  )
}

export default App