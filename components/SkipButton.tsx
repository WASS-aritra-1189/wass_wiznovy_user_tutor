import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, PixelRatio } from 'react-native';

interface SkipButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
  disabled?: boolean;
}

const SkipButton: React.FC<SkipButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  activeOpacity = 0.8,
  disabled = false,
}) => {
  const fontScale = PixelRatio.getFontScale();
  const isLargeFontScale = fontScale > 1.3;
  
  return (
    <TouchableOpacity
      style={[styles.button, isLargeFontScale && styles.largeFontButton, style]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : activeOpacity}
      disabled={disabled}
    >
      <Text 
        style={[styles.buttonText, textStyle]}
        adjustsFontSizeToFit={isLargeFontScale}
        minimumFontScale={0.8}
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 0,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  largeFontButton: {
    paddingVertical: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#01004C',
    textAlign: 'left',
  },
});

export default SkipButton;