import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  PixelRatio,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import GoogleLoginTermsPopup from '../components/GoogleLoginTermsPopup';
import TermsConditionsPopup from '../components/TermsConditionsPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import OtpVerificationScreen from './OtpVerificationScreen';
import { registerUser } from '../services/authService';

const validateName = (name: string) => {
  // Only allows letters (including international characters), spaces, hyphens, and apostrophes
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-'.]+$/;
  
  // Additional check for consecutive special characters
  const consecutiveSpecialChars = /[\s\-'.]{2,}/;
  
  // Check for valid characters and no consecutive special characters
  return nameRegex.test(name) && !consecutiveSpecialChars.test(name);
};

const validateEmail = (email: string) => {
  // Allows only letters, numbers, @ and . as special characters
  const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;
  
  // Additional validation for proper email format
  // No special characters except @ and .
  // No consecutive dots
  // No @ at beginning or end
  // No dot at beginning or end of local part or domain
  
  const noSpecialChars = /^[A-Za-z0-9@.]+$/;
  const noConsecutiveDots = /\.\./;
  
  // Check for @ symbol
  if (!email.includes('@')) return false;
  
  const [localPart, domain] = email.split('@');
  
  // Check for valid local part and domain
  if (!localPart || !domain?.includes('.')) return false;
  
  // No special characters except @ and .
  if (!noSpecialChars.test(email)) return false;
  
  // No consecutive dots
  if (noConsecutiveDots.test(email)) return false;
  
  // Local part shouldn't start or end with dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  
  // Domain shouldn't start or end with dot
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  
  // Domain should have at least one dot but not too many
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;
  
  // Last part (TLD) should be at least 2 characters
  if (domainParts.at(-1)?.length ?? 0 < 2) return false;
  
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 6 && password.length <= 12; // Fixed: Added max length check
};

const validatePhone = (phone: string) => {
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone.replaceAll(/\D/g, ''));
};

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const fontScale = PixelRatio.getFontScale();
  
  const getResponsiveFontSize = (baseSize: number) => {
    if (fontScale >= 2) return Math.max(baseSize * 0.5, 11);
    if (fontScale >= 1.6) return Math.max(baseSize * 0.65, 12);
    if (fontScale >= 1.3) return Math.max(baseSize * 0.8, 13);
    if (fontScale <= 0.85) return Math.min(baseSize * 1.2, baseSize + 4);
    if (fontScale <= 0.9) return Math.min(baseSize * 1.1, baseSize + 2);
    return baseSize;
  };

  const getAppTitlePaddingVertical = () => {
    if (fontScale >= 1.6) return 15;
    if (fontScale >= 1.3) return 18;
    if (fontScale <= 0.85) return 25;
    return 20;
  };

  const getAppTitleMarginBottom = () => {
    if (fontScale >= 1.6) return 2;
    if (fontScale <= 0.85) return 6;
    return 4;
  };

  const getInputGroupMarginBottom = () => {
    if (fontScale >= 1.6) return 15;
    if (fontScale >= 1.3) return 20;
    if (fontScale <= 0.85) return 30;
    return 25;
  };

  const getInputLabelMarginBottom = () => {
    if (fontScale >= 1.6) return 4;
    if (fontScale >= 1.3) return 6;
    if (fontScale <= 0.85) return 10;
    return 8;
  };

  const getInputPaddingVertical = () => {
    if (fontScale >= 1.6) return 8;
    if (fontScale >= 1.3) return 10;
    return 12;
  };

  const getButtonPaddingVertical = () => {
    if (fontScale >= 1.6) return 10;
    if (fontScale >= 1.3) return 12;
    return 15;
  };

  const getTermsNumberOfLines = () => {
    if (fontScale >= 2) return 4;
    if (fontScale >= 1.6) return 3;
    if (fontScale <= 0.85) return 1;
    return 2;
  };

  const getSocialSectionMarginBottom = () => {
    if (fontScale >= 1.6) return 20;
    return 30;
  };

  const getSocialTitleMarginBottom = () => {
    if (fontScale >= 1.6) return 15;
    return 20;
  };

  const getSignInContainerMarginTop = () => {
    if (fontScale >= 1.6) return 15;
    return 20;
  };

  const getSignInContainerMarginBottom = () => {
    if (fontScale >= 1.6) return 30;
    return 40;
  };
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGoogleTermsPopup, setShowGoogleTermsPopup] = useState(false);
  const [showAppleTermsPopup, setShowAppleTermsPopup] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{name?: string; phone?: string; email?: string; password?: string; confirmPassword?: string; terms?: string}>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  const validateForm = () => {
    const newErrors: {name?: string; phone?: string; email?: string; password?: string; confirmPassword?: string; terms?: string} = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!validateName(name)) {
      newErrors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address (only @ and . are allowed as special characters)';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be 6-12 characters'; // Fixed: Updated error message
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!acceptTerms) newErrors.terms = 'Please accept terms and conditions';
    
    return newErrors;
  };

  const handleSignUp = async () => {
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const result = await registerUser({
          name,
          phoneNumber: phone,
          email,
          password,
        });
        
        if (result.success) {
          setShowOtpVerification(true);
        } else {
          setErrorMessage(result.message);
          setShowErrorPopup(true);
        }
      } catch (error) {
        console.error('Sign up error:', error);
        setErrorMessage('Something went wrong. Please try again.');
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignUp = () => {
    setShowGoogleTermsPopup(true);
  };

  const handleGoogleTermsContinue = () => {
    setShowGoogleTermsPopup(false);
    // Handle Google sign up logic here
  };

  const handleAppleSignUp = () => {
    setShowAppleTermsPopup(true);
  };

  const handleAppleTermsContinue = () => {
    setShowAppleTermsPopup(false);
    // Handle Apple sign up logic here
  };

  const handleTermsAccept = () => {
    setAcceptTerms(true);
    setShowTermsPopup(false);
    if (errors?.terms) {
      setErrors(prev => ({...prev, terms: undefined}));
    }
  };

  if (showOtpVerification) {
    return (
      <OtpVerificationScreen
        email={email}
        isRegistration={true}
        onBack={() => setShowOtpVerification(false)}
        onVerifySuccess={() => {
          setShowOtpVerification(false);
          setShowSuccessPopup(true);
        }}
      />
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <StatusBar style="dark" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#000" />
          <Text style={[styles.backText, {
            fontSize: getResponsiveFontSize(16),
          }]}>Sign up</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      


      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollViewContent}
        >
        {/* App Title Section */}
        <View style={[styles.appTitleSection, {
          paddingVertical: getAppTitlePaddingVertical(),
        }]}>
          <Text style={[styles.appTitle, {
            fontSize: getResponsiveFontSize(18),
            marginBottom: getAppTitleMarginBottom(),
          }]}
          numberOfLines={fontScale >= 1.6 ? 2 : 1}
          >
            Lipsum generator: Lorem Ipsum -
          </Text>
          <Text style={[styles.appTitle, {
            fontSize: getResponsiveFontSize(18),
          }]}
          numberOfLines={1}
          >
            All the facts
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={[styles.inputGroup, {
            marginBottom: getInputGroupMarginBottom(),
          }]}>
            <Text style={[styles.inputLabel, {
              fontSize: getResponsiveFontSize(16),
              marginBottom: getInputLabelMarginBottom(),
            }]}>Please enter your name</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIcon, errors.name && styles.inputError, {
                  fontSize: getResponsiveFontSize(16),
                  paddingVertical: getInputPaddingVertical(),
                }]}
                placeholder="Please enter your name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={(text) => {
                  
                  const validChars = text.replaceAll(/[^A-Za-zÀ-ÖØ-öø-ÿ\s\-'.]/g, '');
                
                  const cleanedText = validChars.replaceAll(/([\s\-'.])\1+/g, '$1');
                  setName(cleanedText);
                  if (errors.name) {
                    setErrors(prev => ({...prev, name: undefined}));
                  }
                }}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Phone Field */}
          <View style={[styles.inputGroup, {
            marginBottom: getInputGroupMarginBottom(),
          }]}>
            <Text style={[styles.inputLabel, {
              fontSize: getResponsiveFontSize(16),
              marginBottom: getInputLabelMarginBottom(),
            }]}>Your phone number</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="phone" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIcon, errors.phone && styles.inputError, {
                  fontSize: getResponsiveFontSize(16),
                  paddingVertical: getInputPaddingVertical(),
                }]}
                placeholder="Please enter your phone number"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={(text) => {
                  const numericText = text.replaceAll(/\D/g, '');
                  if (numericText.length <= 10) {
                    setPhone(numericText);
                    if (errors.phone) {
                      setErrors(prev => ({...prev, phone: undefined}));
                    }
                  }
                }}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          {/* Email Field */}
          <View style={[styles.inputGroup, {
            marginBottom: getInputGroupMarginBottom(),
          }]}>
            <Text style={[styles.inputLabel, {
              fontSize: getResponsiveFontSize(16),
              marginBottom: getInputLabelMarginBottom(),
            }]}>Your email address</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIcon, errors.email && styles.inputError, {
                  fontSize: getResponsiveFontSize(16),
                  paddingVertical: getInputPaddingVertical(),
                }]}
                placeholder="Please enter your email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  // Only allow letters, numbers, @ and .
                  const cleanedText = text.replaceAll(/[^A-Za-z0-9@.]/g, '');
                  setEmail(cleanedText);
                  if (errors.email) {
                    setErrors(prev => ({...prev, email: undefined}));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password Field */}
          <View style={[styles.inputGroup, {
            marginBottom: getInputGroupMarginBottom(),
          }]}>
            <Text style={[styles.inputLabel, {
              fontSize: getResponsiveFontSize(16),
              marginBottom: getInputLabelMarginBottom(),
            }]}>Your password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIcon, errors.password && styles.inputError, {
                  fontSize: getResponsiveFontSize(16),
                  paddingVertical: getInputPaddingVertical(),
                }]}
                placeholder="Please enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({...prev, password: undefined}));
                  }
                  if (errors.confirmPassword && confirmPassword && text === confirmPassword) {
                    setErrors(prev => ({...prev, confirmPassword: undefined}));
                  }
                }}
                secureTextEntry={!showPassword} // Fixed: use state variable
                textContentType="none"
                autoComplete="off"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.visibilityToggle}
              >
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Confirm Password Field */}
          <View style={[styles.inputGroup, {
            marginBottom: getInputGroupMarginBottom(),
          }]}>
            <Text style={[styles.inputLabel, {
              fontSize: getResponsiveFontSize(16),
              marginBottom: getInputLabelMarginBottom(),
            }]}>Confirm your password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIcon, errors.confirmPassword && styles.inputError, {
                  fontSize: getResponsiveFontSize(16),
                  paddingVertical: getInputPaddingVertical(),
                }]}
                placeholder="Please confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors(prev => ({...prev, confirmPassword: undefined}));
                  }
                }}
                secureTextEntry={!showConfirmPassword} // Fixed: use state variable
                textContentType="none"
                autoComplete="off"
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.visibilityToggle}
              >
                <MaterialIcons 
                  name={showConfirmPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsSection}>
            <View style={styles.termsContainer}>
              <TouchableOpacity 
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                  {acceptTerms && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                console.log('Terms text pressed');
                setShowTermsPopup(true);
              }}>
                <Text style={[styles.termsText, {
                  fontSize: getResponsiveFontSize(14),
                }]}
                numberOfLines={getTermsNumberOfLines()}
                >
                  I accept the terms and conditions of this app
                </Text>
              </TouchableOpacity>
            </View>
            {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
          </View>

          {/* Sign Up Button */}
          <Button
            title={loading ? "Signing up..." : "Sign up"}
            onPress={handleSignUp}
            variant="primary"
            style={StyleSheet.flatten([styles.signUpButton, loading && styles.buttonDisabled, {
              paddingVertical: getButtonPaddingVertical(),
            }])}
            textStyle={[styles.signUpButtonText, {
              fontSize: getResponsiveFontSize(16),
            }]}
            disabled={loading}
          />
        </View>

        {/* Social Login Section */}
        <View style={[styles.socialSection, {
          marginBottom: getSocialSectionMarginBottom(),
        }]}>
          <Text style={[styles.socialTitle, {
            fontSize: getResponsiveFontSize(16),
            marginBottom: getSocialTitleMarginBottom(),
          }]}>Sign up with social media</Text>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity onPress={handleGoogleSignUp} style={styles.socialButton}>
              <Image 
                source={require('../assets/google.png')} 
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={[styles.socialButtonText, {
                fontSize: getResponsiveFontSize(16),
              }]}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleAppleSignUp} style={styles.socialButton}>
              <Image 
                source={require('../assets/apple.png')} 
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={[styles.socialButtonText, {
                fontSize: getResponsiveFontSize(16),
              }]}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Link */}
        <View style={[styles.signInContainer, {
          marginTop: getSignInContainerMarginTop(),
          marginBottom: getSignInContainerMarginBottom(),
        }]}>
          <Text style={[styles.signInText, {
            fontSize: getResponsiveFontSize(14),
          }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={[styles.signInLink, {
              fontSize: getResponsiveFontSize(14),
            }]}>Sign in now</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <GoogleLoginTermsPopup
        visible={showGoogleTermsPopup}
        onContinue={handleGoogleTermsContinue}
        action="signup"
      />
      
      <GoogleLoginTermsPopup
        visible={showAppleTermsPopup}
        onContinue={handleAppleTermsContinue}
        provider="apple"
        action="signup"
      />
      
      <TermsConditionsPopup
        visible={showTermsPopup}
        onAccept={handleTermsAccept}
        onClose={() => setShowTermsPopup(false)}
      />
      
      <SuccessPopup
        visible={showSuccessPopup}
        message="Registration successful!"
        onClose={() => {
          setShowSuccessPopup(false);
          navigation.navigate('OverviewDetails');
        }}
      />
      
      <ErrorPopup
        visible={showErrorPopup}
        message={errorMessage}
        onClose={() => setShowErrorPopup(false)}
      />
      </View>
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
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  appTitleSection: {
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 25,
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
    color: '#01004C',
  },
  termsSection: {
    marginBottom: 25,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#01004C',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#01004C',
  },
  termsText: {
    fontSize: 14,
    color: '#01004C',
    flex: 1,
  },
  signUpButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  socialSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#01004C',
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
    marginTop: 20,
  },
  signInText: {
    fontSize: 14,
    color: '#01004C',
  },
  signInLink: {
    fontSize: 14,
    color: '#01004C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  socialIcon: {
    width: 13,
    height: 13,
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  visibilityToggle: {
    padding: 4,
    marginLeft: 8,
  },
});

export default SignUpScreen;