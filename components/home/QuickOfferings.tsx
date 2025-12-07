import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  PixelRatio,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface OfferingItem {
  id: string;
  title: string;
  icon: any;
  onPress: () => void;
  isLarge?: boolean;
}

const getResponsiveFontSize = (baseSize: number, fontScale: number) => {
  if (fontScale >= 2) return Math.max(baseSize * 0.5, 11);
  if (fontScale >= 1.6) return Math.max(baseSize * 0.65, 12);
  if (fontScale >= 1.3) return Math.max(baseSize * 0.8, 13);
  if (fontScale <= 0.85) return Math.min(baseSize * 1.2, baseSize + 4);
  if (fontScale <= 0.9) return Math.min(baseSize * 1.1, baseSize + 2);
  return baseSize;
};

const getResponsiveSize = (fontScale: number) => {
  if (fontScale >= 2) return 90;
  if (fontScale >= 1.6) return 85;
  return 80;
};

const getResponsiveBorderRadius = (fontScale: number) => {
  if (fontScale >= 2) return 45;
  if (fontScale >= 1.6) return 42.5;
  return 40;
};

const getResponsiveDimensions = (fontScale: number) => {
  const size = getResponsiveSize(fontScale);
  return {
    width: size,
    height: size,
    borderRadius: getResponsiveBorderRadius(fontScale),
    marginRight: fontScale >= 1.6 ? 25 : 20,
    marginBottom: fontScale >= 1.6 ? 12 : 8,
  };
};

const getIconDimension = (fontScale: number, isLarge: boolean) => {
  if (isLarge) {
    if (fontScale >= 2) return 60;
    if (fontScale >= 1.6) return 65;
    return 70;
  }
  if (fontScale >= 2) return 50;
  if (fontScale >= 1.6) return 55;
  return 60;
};

const getIconSize = (fontScale: number, isLarge: boolean) => {
  const dimension = getIconDimension(fontScale, isLarge);
  return {
    width: dimension,
    height: dimension,
  };
};

const getTextMinHeight = (fontScale: number) => {
  if (fontScale >= 1.6) return 44;
  if (fontScale >= 1.3) return 36;
  return 'auto';
};

const getTextLineHeight = (fontScale: number) => {
  if (fontScale >= 1.6) return 22;
  if (fontScale >= 1.3) return 18;
  return undefined;
};

const getContainerMarginBottom = (fontScale: number) => {
  if (fontScale >= 1.6) return 25;
  if (fontScale >= 1.3) return 22;
  return 20;
};

const getTitleMarginBottom = (fontScale: number) => {
  if (fontScale >= 1.6) return 20;
  if (fontScale >= 1.3) return 18;
  return 15;
};

const OfferingButton: React.FC<{ item: OfferingItem; fontScale: number }> = ({ item, fontScale }) => {
  const dimensions = getResponsiveDimensions(fontScale);
  const iconSize = getIconSize(fontScale, item.isLarge || false);
  
  return (
    <TouchableOpacity 
      style={[styles.offeringItem, { width: dimensions.width, marginRight: dimensions.marginRight }]}
      onPress={item.onPress}
    >
      <View style={[
        item.isLarge ? styles.findTutorIconContainer : styles.offeringIconContainer,
        {
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: dimensions.borderRadius,
          marginBottom: dimensions.marginBottom,
        }
      ]}>
        <Image 
          source={item.icon}
          style={[
            item.isLarge ? styles.largeOfferingIcon : styles.offeringIcon,
            {
              width: iconSize.width,
              height: iconSize.height,
              ...(item.isLarge && { bottom: fontScale >= 2 ? -8 : -10 })
            }
          ]}
          resizeMode="contain"
        />
      </View>
      <Text 
        style={[
          styles.offeringText,
          {
            fontSize: getResponsiveFontSize(11, fontScale),
            minHeight: getTextMinHeight(fontScale),
            lineHeight: getTextLineHeight(fontScale),
          }
        ]}
        numberOfLines={fontScale >= 1.6 ? 2 : 1}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

const QuickOfferings: React.FC = () => {
  const navigation = useNavigation<any>();
  const fontScale = PixelRatio.getFontScale();

  const offerings: OfferingItem[] = [
    {
      id: 'tutor',
      title: 'Find Tutor',
      icon: require('../../assets/findtutor.png'),
      onPress: () => navigation.navigate('AllTutors'),
      isLarge: true,
    },
    {
      id: 'liveclass',
      title: 'Live Class',
      icon: require('../../assets/liveclass.png'),
      onPress: () => {
        const today = new Date().toISOString().split('T')[0];
        navigation.navigate('MySchedule', { selectedDate: today, showLiveOnly: true });
      },
      isLarge: true,
    },
    {
      id: 'schedule',
      title: 'Schedule',
      icon: require('../../assets/schedule.png'),
      onPress: () => {
        const today = new Date().toISOString().split('T')[0];
        navigation.navigate('MySchedule', { selectedDate: today });
      },
    },
    {
      id: 'library',
      title: 'Open Library',
      icon: require('../../assets/library.png'),
      onPress: () => navigation.navigate('OpenLibrary'),
    },
    {
      id: 'courses',
      title: 'Courses',
      icon: require('../../assets/course.png'),
      onPress: () => navigation.navigate('AllCourses'),
    },
  ];

  return (
    <View style={[styles.offeringsContainer, {
      marginBottom: getContainerMarginBottom(fontScale),
    }]}>
      <Text 
        style={[
          styles.offeringsTitle,
          {
            fontSize: getResponsiveFontSize(18, fontScale),
            marginBottom: getTitleMarginBottom(fontScale),
          }
        ]}
        numberOfLines={fontScale >= 1.6 ? 2 : 1}
      >
        Quick Offerings
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offeringsGrid}>
        {offerings.map((item) => (
          <OfferingButton key={item.id} item={item} fontScale={fontScale} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  offeringsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  offeringsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 15,
  },
  offeringsGrid: {
    flexDirection: 'row',
  },
  offeringItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  offeringIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16423C',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
    overflow: 'hidden',
  },
  findTutorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16423C',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  offeringIcon: {
    width: 60,
    height: 60,
  },
  largeOfferingIcon: {
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: -10,
  },
  offeringText: {
    fontSize: 11,
    color: '#16423C',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default QuickOfferings;