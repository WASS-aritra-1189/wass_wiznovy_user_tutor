import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PixelRatio,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const getResponsiveFontSize = (baseSize: number, fontScale: number) => {
  if (fontScale >= 2) return Math.max(baseSize * 0.5, 11);
  if (fontScale >= 1.6) return Math.max(baseSize * 0.65, 12);
  if (fontScale >= 1.3) return Math.max(baseSize * 0.8, 13);
  if (fontScale <= 0.85) return Math.min(baseSize * 1.2, baseSize + 4);
  if (fontScale <= 0.9) return Math.min(baseSize * 1.1, baseSize + 2);
  return baseSize;
};

const getResponsiveValue = (fontScale: number, large: number, medium: number, small: number, defaultValue: number) => {
  if (fontScale >= 2) return large;
  if (fontScale >= 1.6) return medium;
  if (fontScale >= 1.3) return small;
  return defaultValue;
};

const AiChatBanner: React.FC = () => {
  const navigation = useNavigation();
  const fontScale = PixelRatio.getFontScale();

  const handlePress = () => {
    navigation.navigate('AiChatHelp' as never);
  };
  return (
    <View style={[styles.container, {
      marginBottom: getResponsiveValue(fontScale, 25, 25, 22, 20),
    }]}>
      <TouchableOpacity 
        style={[styles.bannerContainer, {
          height: getResponsiveValue(fontScale, 120, 110, 95, 83),
        }]}
        onPress={handlePress}
      >
        <LinearGradient
          colors={['#03A9F4', '#31BD80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          <View style={[styles.contentContainer, {
            paddingHorizontal: fontScale >= 1.6 ? 18 : 15,
            paddingVertical: fontScale >= 1.6 ? 12 : 10,
          }]}>
            <View style={[styles.textContainer, {
              paddingRight: fontScale >= 1.6 ? 12 : 10,
            }]}>
              <Text style={[styles.mainText, {
                fontSize: getResponsiveFontSize(16, fontScale),
                marginBottom: fontScale >= 1.6 ? 6 : 4,
              }]}
              numberOfLines={fontScale >= 1.6 ? 2 : 1}
              >Ask anything to AI Chat</Text>
              <Text style={[styles.subText, {
                fontSize: getResponsiveFontSize(12, fontScale),
                lineHeight: getResponsiveValue(fontScale, 18, 18, 17, 16),
              }]}
              numberOfLines={getResponsiveValue(fontScale, 4, 3, 2, 2)}
              >
                Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image 
                source={require('../../assets/robot.png')} 
                style={[styles.robotImage, {
                  width: getResponsiveValue(fontScale, 40, 45, 50, 50),
                  height: getResponsiveValue(fontScale, 40, 45, 50, 50),
                }]}
                resizeMode="contain"
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bannerContainer: {
    width: '100%',
    height: 83,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  mainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 16,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotImage: {
    width: 50,
    height: 50,
  },
});

export default AiChatBanner;