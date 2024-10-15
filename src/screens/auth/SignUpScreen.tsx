import {Lock, Sms} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, Image, Switch} from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocialLogin from './components/SocialLogin';
import authenticationAPI from '../../apis/authApi';
import { LoadingModal } from '../../../modals';
import { Validate } from '../../../utils/validate';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/reducers/authReducer';


interface ErrorMessage {
  email: string;
  password: string;
  confirmPassword: string;
}

const initValue = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const SignUpScreen = ({navigation}: {navigation: any}) => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>();
  const [isDisable, setIsDisable] = useState(true);

  const dispatch = useDispatch();
  
  useEffect(() => {
    if (
      !errorMessage ||
      (errorMessage &&
        (errorMessage.email ||
          errorMessage.password ||
          errorMessage.confirmPassword)) ||
      !values.email ||
      !values.password ||
      !values.confirmPassword
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [errorMessage, values]);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};
    data[`${key}`] = value;
    setValues(data);
  }

  const formValidator = (key: string) => {
    const data = {...errorMessage};
    let message = ``;

    switch (key) {
      case 'email':
        if (!values.email) {
          message = `Email không được để trống`;
        } else if (!Validate.email(values.email)) {
          message = 'Email không hợp lệ';
        } else {
          message = '';
        }

        break;

      case 'password':
        message = !values.password ? `Mật khẩu không được để trống` : '';
        break;

      case 'confirmPassword':
        if (!values.confirmPassword) {
          message = `Mật khẩu nhập lại không được để trống`;
        } else if (values.confirmPassword !== values.password) {
          message = 'Mật khẩu nhập lại không khớp';
        } else {
          message = '';
        }

        break;
    }

    data[`${key}`] = message;

    setErrorMessage(data);
  };


  const handleRegister = async () => {
    const { email, password, confirmPassword, username } = values;

    // Check if all fields are filled
    if (!email || !password || !confirmPassword || !username) {
      setErrorMessage(errorMessage);
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setErrorMessage(errorMessage);
      return;
    }

    // Validate email format
    const emailValidation = Validate.email(email);
    if (!emailValidation) {
      setErrorMessage(errorMessage);
      return;
    }

    // Validate password (assuming you want to keep this check)
    const passwordValidation = Validate.Password(password);
    if (!passwordValidation) {
      setErrorMessage(errorMessage);
      return;
    }

    // If all validations pass, proceed with registration
    setErrorMessage(errorMessage);
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication(
        '/register', 
        {
          fullname: values.username, 
          email,
          password,}, 
        'post'
      );

      // if (response && response.data && response.data.data) {
      //   const { email, token } = response.data.data; // Adjust this line based on your actual response structure
      //   Alert.alert('Registration Successful', `Email: ${email}\nToken: ${token}`);

      //   dispatch(addAuth(response.data.data));
      //   await AsyncStorage.setItem('auth', JSON.stringify(response.data.data));
      //   navigation.navigate('HomeScreen'); // Navigate to HomeScreen after successful registration
      // }
      
      dispatch(addAuth(res.data));
      await AsyncStorage.setItem('auth', JSON.stringify(res.data));

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setErrorMessage(errorMessage);
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
        onEnd={() => formValidator('email')}
      />

<InputComponent
        value={values.password}
        placeholder="Mật khẩu"
        onChange={val => handleChangeValue('password', val)}
        isPassword
        allowClear
        affix={<Lock size={22} color={appColors.gray} />}
        onEnd={() => formValidator('password')}
      />

<InputComponent
        value={values.confirmPassword}
        placeholder="Nhập lại mật khẩu"
        onChange={val => handleChangeValue('confirmPassword', val)}
        isPassword
        allowClear
        affix={<Lock size={22} color={appColors.gray} />}
        onEnd={() => formValidator('confirmPassword')}
      />

    </SectionComponent>
    {errorMessage && 
      (errorMessage.email 
        || errorMessage.password 
          || errorMessage.confirmPassword)  && (
    <SectionComponent>
    {
      Object.keys(errorMessage).map((error, index) =>
        errorMessage[error] && (
        <TextComponent
        color={appColors.danger} 
        text={errorMessage[error]} 
        key={`error${index}`}
        />
      ))}
    </SectionComponent>
    )}

    <SpaceComponent height={10} />
    <SectionComponent>
      <ButtonComponent
        disable={isDisable}
        onPress={handleRegister}
        text="Đăng Ký"
        type="primary"
      />
    </SectionComponent>
    <SocialLogin />
    <LoadingModal visible={isLoading} />
  </ContainerComponent>
  );
};

export default SignUpScreen
