import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';

interface OtpInputProps {
  length: number;
  onOtpChange: (otp: string) => void;
  value: string;
}

const OtpInput: React.FC<OtpInputProps> = ({ length, onOtpChange, value }) => {
  const [otp, setOtp] = useState(value.split(''));
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onOtpChange(newOtp.join(''));

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputs.current[index] = ref;
          }}
          style={[
            styles.input,
            otp[index] ? styles.inputFilled : null,
          ]}
          value={otp[index] || ''}
          onChangeText={(text) => handleChange(text.replace(/[^0-9]/g, ''), index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          keyboardType="numeric"
          maxLength={1}
          textAlign="center"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  input: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    fontSize: 18,
    fontWeight: '600',
    color: '#01004C',
  },
  inputFilled: {
    borderColor: '#16423C',
    backgroundColor: '#FFFFFF',
  },
});

export default OtpInput;