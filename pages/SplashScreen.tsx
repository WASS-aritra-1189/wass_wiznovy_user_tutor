import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [scaleAnim1] = useState(new Animated.Value(0));
  const [scaleAnim2] = useState(new Animated.Value(0));
  const [scaleAnim3] = useState(new Animated.Value(0));
  const [opacityAnim1] = useState(new Animated.Value(1));
  const [opacityAnim2] = useState(new Animated.Value(1));
  const [opacityAnim3] = useState(new Animated.Value(1));

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    const createRipple = (scaleAnim: Animated.Value, opacityAnim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    const ripple1 = createRipple(scaleAnim1, opacityAnim1, 0);
    const ripple2 = createRipple(scaleAnim2, opacityAnim2, 300);
    const ripple3 = createRipple(scaleAnim3, opacityAnim3, 600);

    ripple1.start();
    ripple2.start();
    ripple3.start();

    return () => {
      clearTimeout(timer);
      ripple1.stop();
      ripple2.stop();
      ripple3.stop();
    };
  }, [onComplete, scaleAnim1, scaleAnim2, scaleAnim3, opacityAnim1, opacityAnim2, opacityAnim3]);

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <StatusBar style="light" />
      <Image 
        source={require('../assets/wiznovylogo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.loaderContainer}>
        <Animated.View 
          style={[
            styles.ripple,
            {
              transform: [{ scale: scaleAnim1 }],
              opacity: opacityAnim1,
            },
          ]} 
        />
        <Animated.View 
          style={[
            styles.ripple,
            {
              transform: [{ scale: scaleAnim2 }],
              opacity: opacityAnim2,
            },
          ]} 
        />
        <Animated.View 
          style={[
            styles.ripple,
            {
              transform: [{ scale: scaleAnim3 }],
              opacity: opacityAnim3,
            },
          ]} 
        />
        <View style={styles.centerDot} />
      </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16423C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  loaderContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});

export default SplashScreen;