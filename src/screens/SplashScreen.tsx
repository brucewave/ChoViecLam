import { View, Text, ImageBackground, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { appInfo } from '../constants/appInfos';
import { SpaceComponent } from '../components';
import { appColors } from '../constants/appColors';

const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('../assests/images/splash-screen.png')}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      imageStyle={{flex: 1}}>
      <Image
        source={require('../assests/images/logo.png')}
        style={{
          width: appInfo.sizes.WIDTH * 0.8,
          resizeMode: 'contain',

          }}
      />
      <SpaceComponent height={16} />
      <ActivityIndicator color={appColors.gray} size={22}/>
    </ImageBackground>
  );
};

export default SplashScreen