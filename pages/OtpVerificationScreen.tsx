import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import OtpInput from '../components/OtpInput';
import { verifyOtp, verifyRegistration, forgotPassword } from '../services/authService';
import { storeToken } from '../services/storage';

interface OtpVerificationScreenProps {
  onBack?: () => void;
  onVerifySuccess?: () => void;
  email: string;
  isRegistration?: boolean;
}

const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  onBack,
  onVerifySuccess,
  email,
  isRegistration = false,
}) => {
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErrorMessage('Please enter the OTP');
      setShowErrorPopup(true);
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      setShowErrorPopup(true);
      return;
    }

    setLoading(true);
    try {
      const result = isRegistration 
        ? await verifyRegistration({ email, otp })
        : await verifyOtp({ email, otp });
      if (result.success) {
        // Store token if it's registration verification and token is provided
        if (isRegistration && result.data?.token) {
          await storeToken(result.data.token);
        }
        setShowSuccessPopup(true);
      } else {
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      setErrorMessage(error?.message || 'Something went wrong. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const result = await forgotPassword({ email });
      if (result.success) {
        setTimer(30);
        setCanResend(false);
        setOtp('');
      } else {
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      setErrorMessage(error?.message || 'Failed to resend OTP. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
      
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
            <Text style={styles.backText}>Verify OTP</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* App Title Section */}
          <View style={styles.appTitleSection}>
            <Text style={styles.appTitle}>Lipsum generator: Lorem Ipsum -</Text>
            <Text style={styles.appTitle}>All the facts</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.instructionText}>
              We've sent a 6-digit verification code to {email}
            </Text>
            
            <View style={styles.timerContainer}>
              {canResend ? (
                <TouchableOpacity 
                  onPress={handleResendOtp}
                  disabled={resendLoading}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendText}>
                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>
                  Resend OTP in {timer} seconds
                </Text>
              )}
            </View>

            {/* OTP Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Enter OTP</Text>
              <OtpInput
                length={6}
                value={otp}
                onOtpChange={setOtp}
              />
            </View>

            {/* Verify Button */}
            <Button
              title={loading ? "Verifying..." : "Verify OTP"}
              onPress={handleVerifyOtp}
              variant="primary"
              style={StyleSheet.flatten([styles.verifyButton, loading && styles.buttonDisabled])}
              textStyle={styles.verifyButtonText}
              disabled={loading}
            />
          </View>
        </ScrollView>

        <SuccessPopup
          visible={showSuccessPopup}
          message="OTP verified successfully"
          onClose={() => {
            setShowSuccessPopup(false);
            if (isRegistration) {
              onVerifySuccess?.();
            } else {
              // Navigate to reset password screen for forgot password flow
              navigation.navigate('ResetPassword', { email });
            }
          }}
        />
        
        <ErrorPopup
          visible={showErrorPopup}
          message={errorMessage}
          onClose={() => setShowErrorPopup(false)}
        />
      </SafeAreaView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#01004C',
    marginLeft: 4,
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  appTitleSection: {
    alignItems: 'flex-start',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 4,
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#01004C',
    marginBottom: 8,
  },

  verifyButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: {
    fontSize: 14,
    color: '#16423C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default OtpVerificationScreen;