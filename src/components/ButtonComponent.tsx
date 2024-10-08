import {View, Text, StyleProp, ViewStyle, TextStyle, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import TextComponent from './TextComponent';
//   import {globalStyles} from '../styles/globalStyles';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
  
interface Props {
    icon?: ReactNode;
    text: string;
    type?: 'primary' | 'text' | 'link';
    color?: string;
    styles?: StyleProp<ViewStyle>;
    textColor?: string;
    textStyles?: StyleProp<TextStyle>;
    onPress?: () => void;
    iconFlex?: 'right' | 'left';
  }
  
  const ButtonComponent = (props: Props) => {
    const {
      icon, text, textColor, textStyles, color, styles, onPress, iconFlex
    } = props;
  
    return (
      <TouchableOpacity>
        {icon && iconFlex === 'left' && icon}
        <TextComponent text={text} style={textStyles} color='primary'/>
        {icon && iconFlex === 'right' && icon}
      </TouchableOpacity>
    );
  };
  
  export default ButtonComponent;
  