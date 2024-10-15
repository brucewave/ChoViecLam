import { View, Text } from 'react-native'
import React from 'react'
import { ButtonComponent, SectionComponent, SpaceComponent, TextComponent } from '../../../components'
import { appColors } from '../../../constants/appColors';
import { fontFamilies } from '../../../constants/fontFamilies';
import { Facebook, Google } from '../../../assests/svgs';

const SocialLogin = () => {

  const handleLoginWithGoogle = async () => {
   console.log('login with google');
  };

  return (
    <SectionComponent>
    <TextComponent
      styles={{textAlign: 'center', marginTop:-20}}
      text="Hoặc"
      color={appColors.gray4}
      size={16}
      font={fontFamilies.medium}
    />
    <SpaceComponent height={16} />

    <ButtonComponent
      type="primary"
      onPress={handleLoginWithGoogle}
      color={appColors.white}
      textColor={appColors.text}
      text="Đăng nhập bằng Google"
      textFont={fontFamilies.regular}
      iconFlex="left"
      icon={<Google />}
    />

    <ButtonComponent
      type="primary"
      color={appColors.white}
      textColor={appColors.text}
      text="Đăng nhập bằng Facebook"
      textFont={fontFamilies.regular}
    //   onPress={handleLoginWithFacebook}
      iconFlex="left"
      icon={<Facebook />}
    />
    {/* <LoadingModal visible={isLoading} /> */}
  </SectionComponent>
  )
};

export default SocialLogin