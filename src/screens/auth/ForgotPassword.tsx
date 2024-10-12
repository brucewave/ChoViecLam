import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ContainerComponent, SectionComponent, TextComponent, SpaceComponent, InputComponent, ButtonComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { ArrowRight, Sms } from 'iconsax-react-native'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isDisable, setIsDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckEmail = (val: string) => {
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsDisable(!emailRegex.test(val));
    };

    return (
        <ContainerComponent back isImageBackground isScroll>
            <SectionComponent>
                <TextComponent title text="Đặt lại mật khẩu" />
                <SpaceComponent height={12} />
                <TextComponent text="Vui lòng nhập địa chỉ email để yêu cầu đặt lại mật khẩu" />
                <SpaceComponent height={26} />
                <InputComponent
                    value={email}
                    onChange={(val) => {
                        setEmail(val);
                        handleCheckEmail(val);
                    }}
                    affix={<Sms size={20} color={appColors.gray} />}
                    placeholder="abc@gmail.com"
                    // onEnd={handleCheckEmail}
                />
            </SectionComponent>
            <SectionComponent>
                <ButtonComponent
                    // onPress={handleForgotPassword}
                    disable={false}
                    text="Gửi"
                    type="primary"
                    icon={<ArrowRight size={20} color={appColors.primary} />}
                    iconFlex="right"
                />
            </SectionComponent>
            {/* <LoadingModal visible={isLoading} /> */}
        </ContainerComponent>
    )
}

export default ForgotPassword
