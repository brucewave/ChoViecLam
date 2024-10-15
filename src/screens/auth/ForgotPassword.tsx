import {View, Text, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {ArrowRight, Sms} from 'iconsax-react-native';
import {appColors} from '../../constants/appColors';
import { Validate } from '../../../utils/validate';
import LoadingModal from '../../../modals/LoadingModal';
import authenticationAPI from '../../apis/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckEmail = () => {
    const isValidEmail = Validate.email(email);
    setIsDisable(!isValidEmail);
  };

  const handleForgotPassword = async () => {
    const api = `/forgotPassword`;
    setIsLoading(true);
    try {
      const res: any = await authenticationAPI.HandleAuthentication(
        api,
        {email},
        'post',
      );

      console.log(res);

      Alert.alert('Thông báo', 'Chúng tôi đã gửi mật khẩu mới đến email của bạn!');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(`Không thể tạo mật khẩu mới, ${error}`);
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text="Đặt lại mật khẩu" title />
        <SpaceComponent height={12} />
        <TextComponent text="Vui lòng nhập email để yêu cầu đặt lại mật khẩu" />
        <SpaceComponent height={26} />
        <InputComponent
          value={email}
          onChange={val => setEmail(val)}
          affix={<Sms size={20} color={appColors.gray} />}
          placeholder="abc@gmail.com"
          onEnd={handleCheckEmail}
        />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          onPress={handleForgotPassword}
          disable={isDisable}
          text="Gửi"
          type="primary"
          icon={<ArrowRight size={20} color={appColors.white} />}
          iconFlex="right"
        />
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default ForgotPassword;