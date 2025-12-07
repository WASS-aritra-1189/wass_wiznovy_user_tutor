import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBannerProps {
  mainText?: string;
  subText?: string;
  imageSource?: any;
  onPress?: () => void;
}

const GradientBanner: React.FC<GradientBannerProps> = ({
  mainText = "Profile Banner",
  subText = "Complete your profile to unlock more features",
  imageSource = require('../assets/containerimg.png'),
  onPress
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bannerContainer} onPress={onPress}>
        <LinearGradient
          colors={['#0D0B74', '#4A4A4A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>{mainText}</Text>
              <Text style={styles.subText}>{subText}</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image 
                source={imageSource}
                style={styles.bannerImage}
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
    marginTop: 0,
    
  },
  bannerContainer: {
    width: 390,
    height: 72,
    borderTopEndRadius:8,
    borderTopStartRadius:8,
    
    borderBottomStartRadius:8,
   
    borderWidth: 0.21,
    borderColor: '#000',
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
  bannerImage: {
    width: 92,
    height: 69,
    // transform: [{ rotate: '180deg' }],
    opacity: 1,
  },
});

export default GradientBanner;