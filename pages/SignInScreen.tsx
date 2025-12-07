import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  PixelRatio,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import GoogleLoginTermsPopup from '../components/GoogleLoginTermsPopup';
import TermsConditionsPopup from '../components/TermsConditionsPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import { useNavigationContext } from '../navigation/NavigationContext';
import { loginUser } from '../services/authService';
import { storeToken } from '../services/storage';

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

const validateInputs = (email: string, password: string, acceptTerms: boolean) => {
  const errors: { email?: string; password?: string; terms?: string } = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password.trim()) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!acceptTerms) {
    errors.terms = 'Please accept terms and conditions';
  }

  return errors;
};

const SignInScreen: React.FC = () => {
  const navigation = useNavigation();
  const { onAuthSuccess } = useNavigationContext();
  const fontScale = PixelRatio.getFontScale();
  
  const getResponsiveFontSize = (baseSize: number) => {
    if (fontScale >= 2.0) return Math.max(baseSize * 0.5, 11);
    if (fontScale >= 1.6) return Math.max(baseSize * 0.65, 12);
    if (fontScale >= 1.3) return Math.max(baseSize * 0.8, 13);
    if (fontScale <= 0.85) return Math.min(baseSize * 1.2, baseSize + 4);
    if (fontScale <= 0.9) return Math.min(baseSize * 1.1, baseSize + 2);
    return baseSize;
  };
  
  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showGoogleTermsPopup, setShowGoogleTermsPopup] = useState(false);
  const [showAppleTermsPopup, setShowAppleTermsPopup] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; terms?: string }>({});

  // Clear specific error when user starts typing
  const clearError = (field: 'email' | 'password' | 'terms') => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Main sign in handler
  const handleSignIn = async () => {
    console.log('Sign in attempt with:', { email, password, acceptTerms });

    // Validate all inputs
    const newErrors = validateInputs(email, password, acceptTerms);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let token: string | undefined;

      // Handle both bypass and normal login
      if (email.trim() === 'aritrasharma@gmail.com' && password.trim() === '123456') {
        console.log('Bypass login triggered');
        // Use a more realistic bypass token or skip token validation
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJ5cGFzcyBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      } else {
        // Normal API login
        const result = await loginUser({ email, password });
        
        if (!result.success) {
          setErrorMessage(result.message || 'Login failed');
          setShowErrorPopup(true);
          return;
        }
        
        token = result.data?.token;
      }

      // Store token and show success
      if (token) {
        await storeToken(token);
      }

      // Show success popup for both flows
      setShowSuccessPopup(true);

    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleSignIn = () => {
    setShowGoogleTermsPopup(true);
  };

  const handleGoogleTermsContinue = () => {
    setShowGoogleTermsPopup(false);
    
  };

  const handleAppleSignIn = () => {
    setShowAppleTermsPopup(true);
  };

  const handleAppleTermsContinue = () => {
    setShowAppleTermsPopup(false);
  
  };

  // Terms acceptance handler
  const handleTermsAccept = () => {
    setAcceptTerms(true);
    setShowTermsPopup(false);
    clearError('terms');
  };

  // Success popup close handler - navigates to home
  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    console.log('Navigating to home via onAuthSuccess');
    onAuthSuccess();
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
      
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#000" />
            <Text style={[styles.backText, {
              fontSize: getResponsiveFontSize(16),
            }]}>Sign in</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* App Title Section */}
          <View style={[styles.appTitleSection, {
            paddingVertical: fontScale >= 1.6 ? 15 : fontScale >= 1.3 ? 18 : fontScale <= 0.85 ? 25 : 20,
          }]}>
            <Text style={[styles.appTitle, {
              fontSize: getResponsiveFontSize(18),
              marginBottom: fontScale >= 1.6 ? 2 : fontScale <= 0.85 ? 6 : 4,
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
            {/* Email Field */}
            <View style={[styles.inputGroup, {
              marginBottom: fontScale >= 1.6 ? 15 : fontScale >= 1.3 ? 20 : fontScale <= 0.85 ? 30 : 25,
            }]}>
              <Text style={[styles.inputLabel, {
                fontSize: getResponsiveFontSize(16),
                marginBottom: fontScale >= 1.6 ? 4 : fontScale >= 1.3 ? 6 : fontScale <= 0.85 ? 10 : 8,
              }]}>Your email address</Text>
              <View style={[
                styles.inputContainer, 
                errors.email && styles.inputError
              ]}>
                <MaterialIcons name="email" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={[styles.inputWithIcon, {
                    fontSize: getResponsiveFontSize(16),
                    paddingVertical: fontScale >= 1.6 ? 8 : fontScale >= 1.3 ? 10 : fontScale <= 0.85 ? 14 : 12,
                  }]}
                  placeholder={fontScale >= 2.0 ? "Email" : fontScale >= 1.6 ? "Enter email" : "Please enter your email address"}
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearError('email');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password Field */}
            <View style={[styles.inputGroup, {
              marginBottom: fontScale >= 1.6 ? 15 : fontScale >= 1.3 ? 20 : fontScale <= 0.85 ? 30 : 25,
            }]}>
              <Text style={[styles.inputLabel, {
                fontSize: getResponsiveFontSize(16),
                marginBottom: fontScale >= 1.6 ? 4 : fontScale >= 1.3 ? 6 : fontScale <= 0.85 ? 10 : 8,
              }]}>Your password</Text>
              <View style={[
                styles.inputContainer, 
                errors.password && styles.inputError
              ]}>
                <MaterialIcons name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={[styles.inputWithIcon, {
                    fontSize: getResponsiveFontSize(16),
                    paddingVertical: fontScale >= 1.6 ? 8 : fontScale >= 1.3 ? 10 : fontScale <= 0.85 ? 14 : 12,
                  }]}
                  placeholder={fontScale >= 2.0 ? "Password" : fontScale >= 1.6 ? "Enter password" : "Please enter your Password"}
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError('password');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}

                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)} 
                  style={styles.eyeIcon}
                  disabled={loading}
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

            {/* Forgot Password */}
            <TouchableOpacity 
              onPress={() => (navigation as any).navigate('ForgotPassword')} 
              style={[styles.forgotPassword, {
                marginBottom: fontScale >= 1.6 ? 15 : fontScale >= 1.3 ? 20 : fontScale <= 0.85 ? 30 : 25,
              }]}
              disabled={loading}
            >
              <Text style={[styles.forgotPasswordText, {
                fontSize: getResponsiveFontSize(14),
              }]}>Forgot password ?</Text>
            </TouchableOpacity>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity 
                onPress={() => {
                  if (!loading) {
                    setAcceptTerms(!acceptTerms);
                    clearError('terms');
                  }
                }}
                disabled={loading}
              >
                <View style={[
                  styles.checkbox, 
                  acceptTerms && styles.checkboxChecked
                ]}>
                  {acceptTerms && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  if (!loading) {
                    setShowTermsPopup(true);
                  }
                }}
                disabled={loading}
              >
                <Text style={[styles.termsText, {
                  fontSize: getResponsiveFontSize(14),
                }]}
                numberOfLines={fontScale >= 2.0 ? 4 : fontScale >= 1.6 ? 3 : fontScale <= 0.85 ? 1 : 2}
                >
                  I accept the terms and conditions of this app
                </Text>
              </TouchableOpacity>
            </View>
            {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              style={[styles.signInButton, loading && styles.buttonDisabled, {
                paddingVertical: fontScale >= 1.6 ? 10 : fontScale >= 1.3 ? 12 : fontScale <= 0.85 ? 18 : 15,
                marginTop: fontScale >= 1.6 ? 15 : fontScale <= 0.85 ? 25 : 20,
              }]}
              disabled={loading}
            >
              <Text style={[styles.signInButtonText, {
                fontSize: getResponsiveFontSize(16),
              }]}
              numberOfLines={fontScale >= 1.6 ? 2 : 1}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Login Section */}
          <View style={[styles.socialSection, {
            marginBottom: fontScale >= 1.6 ? 15 : fontScale <= 0.85 ? 25 : 20,
          }]}>
            <Text style={[styles.socialTitle, {
              fontSize: getResponsiveFontSize(16),
              marginBottom: fontScale >= 1.6 ? 15 : fontScale <= 0.85 ? 25 : 20,
            }]}>Login with social media</Text>
            
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                onPress={handleGoogleSignIn} 
                style={styles.socialButton}
                disabled={loading}
              >
                <Image 
                  source={require('../assets/google.png')} 
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.socialButtonText, {
                  fontSize: getResponsiveFontSize(16),
                }]}>Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleAppleSignIn} 
                style={styles.socialButton}
                disabled={loading}
              >
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

          {/* Sign Up Link */}
          <View style={[styles.signUpContainer, {
            marginTop: fontScale >= 1.6 ? 20 : fontScale <= 0.85 ? 30 : 25,
            marginBottom: fontScale >= 1.6 ? 40 : fontScale <= 0.85 ? 60 : 50,
          }]}>
            <Text style={[styles.signUpText, {
              fontSize: getResponsiveFontSize(14),
            }]}>Don't have an account? </Text>
            <TouchableOpacity 
              onPress={() => (navigation as any).navigate('SignUp')}
              disabled={loading}
            >
              <Text style={[styles.signUpLink, {
                fontSize: getResponsiveFontSize(14),
              }]}>Sign up now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Popup Components */}
        <GoogleLoginTermsPopup
          visible={showGoogleTermsPopup}
          onContinue={handleGoogleTermsContinue}
        />
        
        <GoogleLoginTermsPopup
          visible={showAppleTermsPopup}
          onContinue={handleAppleTermsContinue}
          provider="apple"
        />
        
        <TermsConditionsPopup
          visible={showTermsPopup}
          onAccept={handleTermsAccept}
          onClose={() => setShowTermsPopup(false)}
        />
        
        <SuccessPopup
          visible={showSuccessPopup}
          message="Login successful!"
          onClose={handleSuccessClose}
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
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
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
    color: '#000000',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#01004C',
    fontSize: 14,
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
  signInButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  signInButtonText: {
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
  socialIcon: {
    width: 13,
    height: 13,
    opacity: 1,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
    marginTop:-0,
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
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default SignInScreen;