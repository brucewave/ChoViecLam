import { View, Text, StyleProp, TextStyle, Platform } from 'react-native';
import React from 'react';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { globalStyles } from '../style/globalStyles';

interface Props {
  text: string;
  size?: number;
  flex?: number;
  font?: string;
  color?: string;
  style?: StyleProp<TextStyle>;
  title?: boolean
}

const TextComponent = (props: Props) => {
  const { text, size, flex, font, color, style,title } = props;

  return (
    <Text
      style={[
        globalStyles.text,
        {
          color: color ?? appColors.text,
          flex: flex ?? 0,
          fontSize: size ?? title ? 24 : 14,
          fontFamily: font
            ? fontFamilies.semiBold
            : fontFamilies.regular,
        },
        style, 
      ]}
    >
      {text}
    </Text>
  );
};

export default TextComponent;
