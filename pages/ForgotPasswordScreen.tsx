import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import TermsPopup from '../components/TermsPopup';
import TermsConditionsPopup from '../components/TermsConditionsPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';

import { forgotPassword } from '../services/authService';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showTermsConditionsPopup, setShowTermsConditionsPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPostSuccessTerms, setShowPostSuccessTerms] = useState(false);
 

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      setShowErrorPopup(true);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      setShowErrorPopup(true);
      return;
    }
    
    setLoading(true);
    try {
      const result = await forgotPassword({ email });
      if (result.success) {
        setShowSuccessPopup(true);

      } else {
        setErrorMessage(result.message || 'Failed to send reset password email');
        setShowErrorPopup(true);
      }
    } catch (error: any) {
      console.log('Error details:', error);
      setErrorMessage(error?.message || 'Something went wrong. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTerms = () => {
    setShowPopup(false);
    handleResetPassword();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleShowTermsPopup = (callback: () => void) => {
    setShowTermsConditionsPopup(true);
    
    (handleShowTermsPopup as any).callback = callback;
  };

  const handleTermsAccept = () => {
    setShowTermsConditionsPopup(false);
    
    if ((handleShowTermsPopup as any).callback) {
      (handleShowTermsPopup as any).callback();
    }
  };

  const handleTermsClose = () => {
    setShowTermsConditionsPopup(false);
  };



  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
            <Text style={styles.backText}>Forgot password</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      
          <View style={styles.appTitleSection}>
            <Text style={styles.appTitle}>Lipsum generator: Lorem Ipsum -</Text>
            <Text style={styles.appTitle}>All the facts</Text>
          </View>

          
          <View style={styles.formSection}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your email address</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Please enter your email address"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

          
            <Button
              title={loading ? "Sending..." : "Reset Password"}
              onPress={handleResetPassword}
              variant="primary"
              style={StyleSheet.flatten([styles.resetButton, loading && styles.buttonDisabled])}
              textStyle={styles.resetButtonText}
              disabled={loading}
            />

            
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.signInLink}>
              <Text style={styles.signInText}>Remember your password? </Text>
              <Text style={styles.signInLinkText}>sign in.</Text>
            </TouchableOpacity>
          </View>



          
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Sign up now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TermsPopup
          visible={showPopup}
          onAccept={handleAcceptTerms}
          onDecline={handleClosePopup}
        />
        
        <TermsConditionsPopup
          visible={showTermsConditionsPopup}
          onAccept={handleTermsAccept}
          onClose={handleTermsClose}
        />
        
        <SuccessPopup
          visible={showSuccessPopup}
          message="Password reset OTP sent to your email successfully"
          onClose={() => {
            setShowSuccessPopup(false);
            navigation.navigate('OtpVerification', { email });
          }}
          onShowTerms={() => setShowPostSuccessTerms(true)}
        />
        
        <ErrorPopup
          visible={showErrorPopup}
          message={errorMessage}
          onClose={() => setShowErrorPopup(false)}
        />
        
        <TermsPopup
          visible={showPostSuccessTerms}
          onAccept={() => {
            setShowPostSuccessTerms(false);
          }}
          onDecline={() => {
            setShowPostSuccessTerms(false);
          }}
          onOtpRedirect={() => {
            navigation.navigate('OtpVerification', { email });
          }}
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
    color: '#10004C',
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
  inputGroup: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#01004C',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signInLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#01004C',
  },
  signInLinkText: {
    fontSize: 14,
    color: '#01004C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
    marginTop: 20,
  },
  signUpText: {
    fontSize: 14,
    color: '#01004C',
  },
  signUpLink: {
    fontSize: 14,
    color: '#01004C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.6,
  },

});

export default ForgotPasswordScreen;