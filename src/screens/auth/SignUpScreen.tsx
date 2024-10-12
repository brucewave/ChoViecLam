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
import { LoadingModal } from '../../../modals';
import { Validate } from '../../../utils/validate';

const initValue = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const SignUpScreen = ({navigation}: {navigation: any}) => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    if(values.email || values.password || values.confirmPassword || values.username){
      setErrorMessage('');
    }
  }, [values]);

  const handleChangeValue = (key: string, value: string) => {
    setValues(prevValues => ({
      ...prevValues,
      [key]: value
    }));
  }

  const handleRegister = async () => {
    const { email, password, confirmPassword, username } = values;

    // Check if all fields are filled
    if (!email || !password || !confirmPassword || !username) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu nhập lại không khớp');
      return;
    }

    // Validate email format
    const emailValidation = Validate.email(email);
    if (!emailValidation) {
      setErrorMessage('Email không đúng định dạng');
      return;
    }

    // Validate password (assuming you want to keep this check)
    const passwordValidation = Validate.Password(password);
    if (!passwordValidation) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // If all validations pass, proceed with registration
    setErrorMessage('');
    setIsLoading(true);
    try {
      const response = await authenticationAPI.HandleAuthentication('/register', values, 'post');
      console.log(response);
      setIsLoading(false);
      // Handle successful registration here (e.g., navigate to login screen or show success message)
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setErrorMessage('Đăng ký thất bại. Vui lòng thử lại.');
    }
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
    {errorMessage && 
    <SectionComponent>
    <TextComponent text={errorMessage} color={appColors.danger} />
    </SectionComponent>
    }

    <SpaceComponent height={16} />
    <SectionComponent>
      <ButtonComponent
        // disable={isDisable}
        onPress={handleRegister}
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
    <LoadingModal visible={isLoading} />
  </ContainerComponent>
  );
};

export default SignUpScreen
