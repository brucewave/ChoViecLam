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
import authenticationAPI from '../../apis/authApi';
import { Validate } from '../../../utils/validate';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/reducers/authReducer';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(true);
  const [isDisable, setIsDisable] = useState(true);
  const dispatch = useDispatch();

  const handleLogin = async () => {


    const emailValidation = Validate.email(email);
    if(emailValidation){
      try{
        const res = await authenticationAPI.HandleAuthentication(
          '/login', 
          {email, password}, 
          'post'
        );
        dispatch(addAuth(res.data));
          await AsyncStorage.setItem(
            'auth', 
            isRemember ? JSON.stringify(res.data) : email,
          );
      }catch(error){
        console.log(error);
      }
    }else{
      Alert.alert("Email không đúng định dạng");
    }
  };

  return (
    <ContainerComponent isImageBackground isScroll>
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
      <TextComponent size={24} title text="Đăng nhập" />
      <SpaceComponent height={21} />
      <InputComponent
        value={email}
        placeholder="Email"
        onChange={val => setEmail(val)}
        allowClear
        affix={<Sms size={22} color={appColors.gray} />}
      />
      <InputComponent
        value={password}
        placeholder="Mật khẩu"
        onChange={val => setPassword(val)}
        isPassword
        allowClear
        affix={<Lock size={22} color={appColors.gray} />}
      />
      <RowComponent justify="space-between">
        <RowComponent onPress={() => setIsRemember(!isRemember)}>
          <Switch
            trackColor={{true: appColors.primary}}
            thumbColor={appColors.white}
            value={isRemember}
            onChange={() => setIsRemember(!isRemember)}
          />
          <SpaceComponent width={4} />
          <TextComponent text="Ghi nhớ đăng nhập" />
        </RowComponent>
        <ButtonComponent
          text="Quên mật khẩu?"
          onPress={() => navigation.navigate('ForgotPassword')}
          type="text"
        />
      </RowComponent>
    </SectionComponent>
    <SpaceComponent height={16} />
    <SectionComponent>
      <ButtonComponent
        // disable={isDisable}
        onPress={handleLogin}
        text="Đăng nhập"
        type="primary"
      />
    </SectionComponent>
    <SocialLogin />
    <SectionComponent>
      <RowComponent justify="center">
        <TextComponent text="Bạn chưa có tài khoản? " />
        <ButtonComponent
          type="link"
          text="Đăng ký"
          onPress={() => navigation.navigate('SignUpScreen')}
        />
      </RowComponent>
    </SectionComponent>
    
  </ContainerComponent>
  );
};

export default LoginScreen
