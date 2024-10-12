import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ButtonComponent } from '../../components'
import { globalStyles } from '../../style/globalStyles'
import { InputComponent } from '../../components'
import { Lock } from 'iconsax-react-native'
import { appColors } from '../../constants/appColors'

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(true);
  const [isDisable, setIsDisable] = useState(true);

  return (
    <View style={[
      globalStyles.container,
      {
        justifyContent: 'center',
        alignItems: 'center',
      }
      ]}>
        <InputComponent 
        value={email}
        placeholder="Email"
        onChange={val => setEmail(val)}
        allowClear
        affix={<Lock size={22} color={appColors.gray}/>}
        />
        <InputComponent 
        value={password}
        placeholder="Password"
        onChange={val => setPassword(val)}
        isPassword
        allowClear
        affix={<Lock size={22} color={appColors.gray}/>}
        />
    </View>
  )
}

export default LoginScreen
