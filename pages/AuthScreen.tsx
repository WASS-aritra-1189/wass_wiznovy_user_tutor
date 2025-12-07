import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  BackHandler,
  PixelRatio,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width, height } = useWindowDimensions();
  const fontScale = PixelRatio.getFontScale();
  
  // Calculate if it's a very small device
  const isVerySmallDevice = height < 600;
  const isSmallDevice = height < 700;
  const isMediumDevice = height >= 700 && height < 800;
  const isLargeDevice = height >= 800;
  const isTablet = width >= 768;
  const isLandscape = width > height;
  
  // Calculate available height for content
  const statusBarHeight = Platform.OS === 'ios' ? 44 : 24;
  const safeAreaBottom = Platform.OS === 'ios' ? 34 : 0;
  const availableHeight = height - statusBarHeight - safeAreaBottom - 40; // 40 for extra padding
  
  // Responsive font size calculation
  const getResponsiveFontSize = (baseSize: number) => {
    const scale = isTablet ? 1.2 : 1;
    
    if (fontScale >= 2.0) return Math.max(baseSize * 0.5 * scale, 11);
    if (fontScale >= 1.6) return Math.max(baseSize * 0.65 * scale, 12);
    if (fontScale >= 1.3) return Math.max(baseSize * 0.8 * scale, 13);
    if (fontScale <= 0.85) return Math.min(baseSize * 1.2 * scale, baseSize + 4);
    if (fontScale <= 0.9) return Math.min(baseSize * 1.1 * scale, baseSize + 2);
    return baseSize * scale;
  };
  
  // Calculate proportional heights based on available space
  const calculateImageHeights = () => {
    let topRowHeight, fullImageHeight, textHeight, buttonHeight;
    
    if (isVerySmallDevice) {
      // iPhone SE, small Android phones
      topRowHeight = availableHeight * 0.25; // 25% of screen
      fullImageHeight = availableHeight * 0.35; // 35% of screen
      textHeight = availableHeight * 0.2; // 20% of screen
      buttonHeight = availableHeight * 0.15; // 15% of screen
    } else if (isSmallDevice) {
      // Standard phones
      topRowHeight = availableHeight * 0.22; // 22% of screen
      fullImageHeight = availableHeight * 0.38; // 38% of screen
      textHeight = availableHeight * 0.22; // 22% of screen
      buttonHeight = availableHeight * 0.13; // 13% of screen
    } else if (isMediumDevice) {
      // Larger phones
      topRowHeight = availableHeight * 0.2; // 20% of screen
      fullImageHeight = availableHeight * 0.4; // 40% of screen
      textHeight = availableHeight * 0.22; // 22% of screen
      buttonHeight = availableHeight * 0.13; // 13% of screen
    } else {
      // Large phones and tablets
      topRowHeight = availableHeight * 0.18; // 18% of screen
      fullImageHeight = availableHeight * 0.42; // 42% of screen
      textHeight = availableHeight * 0.22; // 22% of screen
      buttonHeight = availableHeight * 0.13; // 13% of screen
    }
    
    // Ensure minimum heights
    return {
      topRowHeight: Math.max(topRowHeight, 120),
      fullImageHeight: Math.max(fullImageHeight, 180),
      textHeight: Math.max(textHeight, 60),
      buttonHeight: Math.max(buttonHeight, 50),
    };
  };
  
  const imageHeights = calculateImageHeights();
  
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <View style={[styles.content, {
          paddingHorizontal: isTablet ? 40 : 20,
          paddingTop: isVerySmallDevice ? 10 : isSmallDevice ? 15 : 20,
          paddingBottom: isVerySmallDevice ? 10 : 15,
          height: availableHeight,
        }]}>
          {/* Header Section with Images */}
          <View style={[styles.headerSection, {
            flex: 0.65, // Takes 65% of available space
          }]}>
            {/* Top Row Images */}
            <View style={[styles.topRow, {
              height: imageHeights.topRowHeight,
              gap: isVerySmallDevice ? 5 : 8,
              flexDirection: isLandscape && !isTablet ? 'row' : 'row',
            }]}>
              <View style={[styles.leftHalf, {
                flex: isLandscape && !isTablet ? 1.2 : 1,
              }]}>
                <Image 
                  source={require('../assets/signinup_top_right.png')}
                  style={styles.imageStyle}
                  resizeMode="cover"
                />
              </View>
              
              <View style={[styles.rightHalf, {
                flex: isLandscape && !isTablet ? 1 : 1,
                gap: isVerySmallDevice ? 5 : 8,
              }]}>
                <View style={styles.topRightImage}>
                  <Image 
                    source={require('../assets/signinup_top_leftup.png')}
                    style={[styles.faceImageStyle, {
                      height: imageHeights.topRowHeight * 1.3,
                      marginTop: isVerySmallDevice ? -15 : isSmallDevice ? -20 : -25,
                    }]}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.bottomRightImage}>
                  <Image 
                    source={require('../assets/signinup_top_leftdown.png')}
                    style={styles.imageStyle}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>
            
            {/* Full Width Image */}
            <View style={[styles.fullWidthImage, {
              height: imageHeights.fullImageHeight,
              marginTop: isVerySmallDevice ? 5 : 8,
            }]}>
              <Image 
                source={require('../assets/main.png')}
                style={styles.imageStyle}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Welcome Text */}
          <View style={[styles.textContainer, {
            flex: 0.2, // Takes 20% of available space
          }]}>
            <Text style={[styles.loremText, {
              fontSize: getResponsiveFontSize(isVerySmallDevice ? 16 : isTablet ? 24 : 20),
              lineHeight: getResponsiveFontSize(isVerySmallDevice ? 20 : isTablet ? 28 : 24) * 1.3,
            }]}
            numberOfLines={isVerySmallDevice ? 3 : isSmallDevice ? 4 : isLargeDevice ? 5 : 4}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            >
              Lorem Ipsum - All the facts. Discover seamless learning with our comprehensive educational platform. Join thousands of students today.
            </Text>
          </View>

          {/* Buttons Section */}
          <View style={[styles.buttonSection, {
            flex: 0.15, // Takes 15% of available space
            flexDirection: isVerySmallDevice || (isLandscape && !isTablet) ? 'row' : 'row',
            gap: isVerySmallDevice ? 8 : 12,
            marginTop: 'auto',
          }]}>
            <Button
              title="Sign in"
              onPress={handleSignIn}
              variant="primary"
              style={[styles.button, {
                height: isVerySmallDevice ? 42 : isTablet ? 56 : 48,
                flex: 1,
              }]}
              textStyle={[styles.buttonText, {
                fontSize: getResponsiveFontSize(isVerySmallDevice ? 14 : isTablet ? 18 : 16),
              }]}
            />
            
            <Button
              title="Sign up"
              onPress={handleSignUp}
              variant="primary"
              style={[styles.signUpButton, {
                height: isVerySmallDevice ? 42 : isTablet ? 56 : 48,
                flex: 1,
              }]}
              textStyle={[styles.signUpText, {
                fontSize: getResponsiveFontSize(isVerySmallDevice ? 14 : isTablet ? 18 : 16),
              }]}
            />
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16423C',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerSection: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    width: '100%',
  },
  leftHalf: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  rightHalf: {
    flexDirection: 'column',
  },
  topRightImage: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
  },
  bottomRightImage: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flex: 1,
  },
  fullWidthImage: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  faceImageStyle: {
    width: '100%',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loremText: {
    fontFamily: Platform.OS === 'ios' ? 'Poppins' : 'Poppins-Bold',
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFFFFF',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  buttonSection: {
    width: '100%',
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
  signUpButton: {
    backgroundColor: '#3E5F44',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default AuthScreen;