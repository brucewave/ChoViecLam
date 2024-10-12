import {View, Text, StyleProp, ViewStyle, TextStyle, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import TextComponent from './TextComponent';
//   import {globalStyles} from '../styles/globalStyles';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import { globalStyles } from '../style/globalStyles';
  
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
      icon, text, textColor, textStyles, color, styles, onPress, iconFlex, type // Added type here
    } = props;
  
    return type === 'primary' ? (
      <TouchableOpacity 
        onPress={onPress}
        style={[globalStyles.button, {
        }, styles]}>
          {icon && icon}
          <TextComponent 
            text={text}  
            style={[textStyles,{
              marginLeft: icon  ? 12 : 0,
            }]} 
            color={textColor ?? appColors.white}
            flex={icon && iconFlex === 'right' ? 1 : 0}
          />
          {icon && iconFlex === 'right' && icon}
      </TouchableOpacity>
    ) : (
      <TouchableOpacity>
        <TextComponent 
          text={text} 
          color={type === 'link' ? appColors.primary : appColors.text} 
        />
      </TouchableOpacity>
    );
  };
  
  
  export default ButtonComponent;
  