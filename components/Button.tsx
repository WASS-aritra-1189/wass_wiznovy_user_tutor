import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, PixelRatio } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  activeOpacity = 0.8,
  disabled = false,
}) => {
  const fontScale = PixelRatio.getFontScale();
  const isLargeFontScale = fontScale >= 1.3;
  const isExtraLargeFontScale = fontScale >= 1.6;
  const hasCustomStyle = style && (style.minHeight || style.paddingVertical);
  const numberOfLines = fontScale >= 2 ? 2 : isExtraLargeFontScale ? 2 : 1;
  const buttonVariantStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textVariantStyle = variant === 'primary' ? styles.primaryText : styles.secondaryText;
  const handlePress = disabled ? undefined : onPress;
  const buttonOpacity = disabled ? 1 : activeOpacity;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonVariantStyle,
        !hasCustomStyle && isLargeFontScale && styles.largeFontButton,
        !hasCustomStyle && isExtraLargeFontScale && styles.extraLargeFontButton,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={buttonOpacity}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          textVariantStyle,
          textStyle,
        ]}
        numberOfLines={numberOfLines}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 10,
  },
  primaryButton: {
    backgroundColor: '#16423c',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  largeFontButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  extraLargeFontButton: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 20,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#01004C',
    fontWeight: '500',
    textAlign: 'left',
  },
});

export default Button;