import { View, Text, Image, TouchableOpacity, StyleSheet, TextComponent } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../style/globalStyles'
import Swiper from 'react-native-swiper'
import { appColors } from '../../constants/appColors'
import { appInfo } from '../../constants/appInfos'

const OnboardingScreen = ({navigation}: any) => {
  const [index, setIndex] = useState(0);

  return (
    <View style={[globalStyles.container]}>
       <Swiper
        style={{}}
        loop={false}
        onIndexChanged={num => setIndex(num)}
        index={index}
        activeDotColor={appColors.white}>
        <Image
          source={require('../../assests/images/onboarding_1.png')}
          style={{
            flex: 1,
            width: appInfo.sizes.WIDTH,
            height: appInfo.sizes.HEIGHT,
            resizeMode: 'cover',
          }}
        />
        <Image
          source={require('../../assests/images/onboarding_2.png')}
          style={{
            flex: 1,
            width: appInfo.sizes.WIDTH,
            height: appInfo.sizes.HEIGHT,
            resizeMode: 'cover',
          }}
        />
        <Image
          source={require('../../assests/images/onboarding_3.png')}
          style={{
            flex: 1,
            width: appInfo.sizes.WIDTH,
            height: appInfo.sizes.HEIGHT,
            resizeMode: 'cover',
          }}
        />
      </Swiper>
      <View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 20,
            position: 'absolute',
            bottom: 5,
            right: 20,
            left: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          {/* <TextComponent
            text="Skip"
            color={appColors.gray2}
            font={fontFamilies.medium}
          /> */}

          <Text style = {[styles.text, {color:appColors.gray5}]} >Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            index < 2 ? setIndex(index + 1) : navigation.navigate('LoginScreen')
          }>
          {/* <TextComponent
            text="Next"
            color={appColors.white}
            font={fontFamilies.medium}
          /> */}
          <Text style = {[styles.text, {color:appColors.gray2}]} >Next</Text>

        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({
  text: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});