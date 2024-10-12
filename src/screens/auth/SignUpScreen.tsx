import {Lock, Sms} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, Image, Switch} from 'react-native';
// import authenticationAPI from '../../apis/authApi';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
// import {Validate} from '../../utils/validate';
// import SocialLogin from './components/SocialLogin';
// import {useDispatch} from 'react-redux';
// import {addAuth} from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocialLogin from './components/SocialLogin';

const initValue = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const SignUpScreen = ({navigation}: {navigation: any}) => {
  const [values, setValues] = useState(initValue);
  
  const handleChangeValue = (key: string, value: string) => {
    setValues(prevValues => ({
      ...prevValues,
      [key]: value
    }));
  }

  return (
    <ContainerComponent isImageBackground isScroll back>
    <SectionComponent
      styles={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
      }}>
      <Image
        source={require('../../assests/images/logo.png')}
        style={{
          resizeMode: 'contain',
          width: 350,
          height: 114,
          marginBottom: 0,
        }}
      />
    </SectionComponent>

    <SectionComponent>
      <TextComponent size={24} title text="Đăng ký" />
      <SpaceComponent height={21} />
      <InputComponent
        value={values.username}
        placeholder="Tên đăng nhập"
        onChange={val => handleChangeValue('username', val)}
        allowClear
        affix={<Sms size={22} color={appColors.gray} />}
      />
      <InputComponent
        value={values.email}
        placeholder="Email"
        onChange={val => handleChangeValue('email', val)}
        allowClear
        affix={<Sms size={22} color={appColors.gray} />}
      />

<InputComponent
        value={values.password}
        placeholder="Mật khẩu"
        onChange={val => handleChangeValue('password', val)}
        isPassword
        allowClear
        affix={<Lock size={22} color={appColors.gray} />}
      />

<InputComponent
        value={values.confirmPassword}
        placeholder="Nhập lại mật khẩu"
        onChange={val => handleChangeValue('confirmPassword', val)}
        isPassword
        allowClear
        affix={<Lock size={22} color={appColors.gray} />}
      />

    </SectionComponent>
    <SpaceComponent height={16} />
    <SectionComponent>
      <ButtonComponent
        // disable={isDisable}
        // onPress={handleLogin}
        text="Đăng ký"
        type="primary"
      />
    </SectionComponent>
    <SocialLogin />
    <SectionComponent>
      <RowComponent justify="center">
        <TextComponent text="Bạn chưa có tài khoản? " />
        <ButtonComponent
          type="link"
          text="Đăng nhập"
          onPress={() => navigation.navigate('LoginScreen')}
        />
      </RowComponent>
    </SectionComponent>
    
  </ContainerComponent>
  );
};

export default SignUpScreen
