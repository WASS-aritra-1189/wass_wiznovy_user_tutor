import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  ViewToken,
  PixelRatio,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchWalkthrough } from '../store/walkthroughSlice';
import Button from '../components/Button';
import SkipButton from '../components/SkipButton';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isLargeScreen = width > 414;

// Import your local images - adjust paths according to your assets folder structure
const slide1Image = require('../assets/walkthrough1.png');
const slide2Image = require('../assets/walkthrough2.png');
const slide3Image = require('../assets/walkthrough3.png');

interface SlideItem {
  id: string;
  title: string | null;
  subtitle: string;
  image: string | null;
  imagePath: string | null;
}

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
}

interface WalkthroughScreenProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

interface FooterProps {
  slides: SlideItem[];
  currentSlide: number;
  handleSkip: () => void;
  goToNextSlide: () => void;
}

interface SlideProps {
  item: SlideItem;
  slides: SlideItem[];
}

const Slide: React.FC<SlideProps> = ({ item, slides }) => {
  const fontScale = PixelRatio.getFontScale();
  
  const getResponsiveFontSize = (baseSize: number) => {
    if (fontScale >= 2.0) return Math.max(baseSize * 0.5, 12);
    if (fontScale >= 1.6) return Math.max(baseSize * 0.65, 14);
    if (fontScale >= 1.3) return Math.max(baseSize * 0.8, 16);
    if (fontScale <= 0.85) return Math.min(baseSize * 1.2, baseSize + 4);
    if (fontScale <= 0.9) return Math.min(baseSize * 1.1, baseSize + 2);
    return baseSize;
  };

  const getImageSource = () => {
    if (item.image) {
      return { uri: item.image };
    } else if (item.imagePath) {
      return { uri: item.imagePath };
    }
    // Fallback to default images based on index
    const index = slides.findIndex(slide => slide.id === item.id);
    const defaultImages = [slide1Image, slide2Image, slide3Image];
    return defaultImages[index] || slide1Image;
  };

  const titleStyle = {
    fontSize: getResponsiveFontSize(24),
    lineHeight: getResponsiveFontSize(26),
    marginBottom: fontScale >= 2.0 ? 8 : fontScale >= 1.6 ? 10 : fontScale >= 1.3 ? 12 : fontScale <= 0.85 ? 18 : 15,
    marginTop: fontScale >= 2.0 ? 10 : fontScale >= 1.6 ? 12 : fontScale >= 1.3 ? 15 : fontScale <= 0.85 ? 25 : 20,
  };

  const subtitleStyle = {
    fontSize: getResponsiveFontSize(14),
    lineHeight: getResponsiveFontSize(18),
    marginBottom: fontScale >= 2.0 ? 15 : fontScale >= 1.6 ? 18 : fontScale >= 1.3 ? 20 : fontScale <= 0.85 ? 25 : 20,
  };

  const imageContainerStyle = {
    height: fontScale >= 2.0 ? height * 0.35 : fontScale >= 1.6 ? height * 0.4 : fontScale >= 1.3 ? height * 0.45 : fontScale <= 0.85 ? height * 0.65 : height * 0.6,
    marginBottom: fontScale >= 2.0 ? 8 : fontScale >= 1.6 ? 10 : fontScale >= 1.3 ? 12 : fontScale <= 0.85 ? 35 : 30,
  };

  return (
    <View style={styles.slide}>
      <View style={[styles.imageContainer, imageContainerStyle]}>
        <Image
          source={getImageSource()}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text 
          style={[styles.title, titleStyle]}
          numberOfLines={fontScale >= 2.0 ? 5 : fontScale >= 1.6 ? 4 : fontScale >= 1.3 ? 3 : 1}
        >
          {item.title || 'Walkthrough Screen'}
        </Text>
        
        <Text 
          style={[styles.mainDescription, subtitleStyle]}
          numberOfLines={fontScale >= 2.0 ? 10 : fontScale >= 1.6 ? 8 : fontScale >= 1.3 ? 6 : fontScale <= 0.85 ? 2 : 4}
        >
          {item.subtitle || 'Learn how to use this feature'}
        </Text>
      </View>
    </View>
  );
};

const Footer: React.FC<FooterProps> = ({ slides, currentSlide, handleSkip, goToNextSlide }) => {
  const fontScale = PixelRatio.getFontScale();
  const isLargeFontScale = fontScale >= 1.3;
  const isExtraLargeFontScale = fontScale >= 1.6;
  
  const getResponsiveFontSize = (baseSize: number) => {
    if (fontScale >= 2.0) return Math.max(baseSize * 0.5, 11);
    if (fontScale >= 1.6) return Math.max(baseSize * 0.65, 12);
    if (fontScale >= 1.3) return Math.max(baseSize * 0.8, 13);
    if (fontScale <= 0.85) return Math.min(baseSize * 1.2, baseSize + 4);
    if (fontScale <= 0.9) return Math.min(baseSize * 1.1, baseSize + 2);
    return baseSize;
  };

  const skipButtonStyle = {
    paddingVertical: fontScale >= 1.6 ? 6 : fontScale >= 1.3 ? 8 : 12,
    paddingHorizontal: fontScale >= 1.6 ? 4 : fontScale >= 1.3 ? 6 : (isSmallScreen ? 8 : 16),
    minWidth: fontScale >= 1.6 ? 45 : fontScale >= 1.3 ? 50 : (isSmallScreen ? 60 : 80),
  };

  const skipTextStyle = {
    fontSize: getResponsiveFontSize(16),
  };

  const nextButtonStyle = {
    paddingVertical: fontScale >= 2.0 ? 8 : fontScale >= 1.6 ? 10 : fontScale >= 1.3 ? 12 : 12,
    paddingHorizontal: fontScale >= 2.0 ? 12 : fontScale >= 1.6 ? 14 : fontScale >= 1.3 ? 16 : (isSmallScreen ? 16 : 24),
    minWidth: fontScale >= 2.0 ? 80 : fontScale >= 1.6 ? 90 : fontScale >= 1.3 ? 100 : (isSmallScreen ? 100 : 120),
    flex: (isSmallScreen || isLargeFontScale) ? 1 : 0,
    maxWidth: fontScale >= 2.0 ? 150 : fontScale >= 1.6 ? 160 : fontScale >= 1.3 ? 170 : (isLargeScreen ? 200 : undefined),
    minHeight: fontScale >= 2.0 ? 40 : fontScale >= 1.6 ? 44 : fontScale >= 1.3 ? 48 : undefined,
  };

  const nextTextStyle = {
    fontSize: getResponsiveFontSize(16),
    textAlign: 'center' as const,
    textAlignVertical: 'center' as const,
    includeFontPadding: false,
  };

  return (
    <View style={styles.footer}>
      {/* Pagination */}
      <View style={styles.pagination}>
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            style={[
              styles.paginationDot,
              currentSlide === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      {/* Bottom Section */}
      <View style={[styles.bottomSection, {
        flexDirection: fontScale >= 1.6 ? 'column' : 'row',
        justifyContent: fontScale >= 1.6 ? 'center' : 'space-between',
        minHeight: fontScale >= 2.0 ? 100 : fontScale >= 1.6 ? 90 : fontScale >= 1.3 ? 70 : 48,
        gap: fontScale >= 2.0 ? 16 : fontScale >= 1.6 ? 14 : fontScale >= 1.3 ? 12 : 8,
        paddingVertical: fontScale >= 2.0 ? 8 : fontScale >= 1.6 ? 6 : 4,
      }]}>
        <SkipButton
          title="SKIP"
          onPress={handleSkip}
          style={skipButtonStyle}
          textStyle={skipTextStyle}
        />
        
        <Button
          title={currentSlide === slides.length - 1 ? 'GET STARTED' : 'NEXT'}
          onPress={goToNextSlide}
          variant="primary"
          style={nextButtonStyle}
          textStyle={nextTextStyle}
        />
      </View>
    </View>
  );
};

const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({ 
  onComplete, 
  onSkip 
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const { slides, loading } = useSelector((state: RootState) => state.walkthrough);
  const flatListRef = useRef<FlatList>(null);

  React.useEffect(() => {
    dispatch(fetchWalkthrough());
  }, [dispatch]);

  const defaultSlides: SlideItem[] = [
    {
      id: '1',
      title: 'Walkthrough Screen',
      subtitle: 'ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: null,
      imagePath: null,
    },
    {
      id: '2',
      title: 'Walkthrough Screen',
      subtitle: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: null,
      imagePath: null,
    },
    {
      id: '3',
      title: 'Walkthrough Screen',
      subtitle: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      image: null,
      imagePath: null,
    },
  ];



  const goToNextSlide = (): void => {
    const currentSlides = slides.length > 0 ? slides : defaultSlides;
    if (currentSlide < currentSlides.length - 1) {
      const nextSlide = currentSlide + 1;
      flatListRef.current?.scrollToIndex({ index: nextSlide, animated: true });
      setCurrentSlide(nextSlide);
    } else {
      onComplete?.();
    }
  };

  const handleSkip = (): void => {
    onSkip?.();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: ViewableItemsChanged) => {
    if (viewableItems[0]) {
      setCurrentSlide(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;



  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      


      {/* FlatList for Slides */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={slides.length > 0 ? slides : defaultSlides}
          renderItem={({ item }) => <Slide item={item} slides={slides.length > 0 ? slides : defaultSlides} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      )}

      <Footer 
        slides={slides.length > 0 ? slides : defaultSlides}
        currentSlide={currentSlide}
        handleSkip={handleSkip}
        goToNextSlide={goToNextSlide}
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

  slide: {
    width: width - 40,
    marginHorizontal: 20,
    alignItems: 'center',
    paddingTop: 20,
    flex: 1,
  },
  imageContainer: {
    width: width * 0.9,
    height: height * 0.6,
    marginTop: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    paddingHorizontal: 0,
  },
  description: {
    fontSize: 22,
    color: '#140101ff',
    textAlign: 'left',
    marginBottom: 30,
    lineHeight: 22,
    fontWeight: 'bold',
    paddingHorizontal: 0,
  },
  mainDescription: {
    fontSize: 14,
    color: '#01004C',
    textAlign: 'left',
    paddingHorizontal: 0,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 30,
  },
  footer: {
    minHeight: Math.max(height * 0.15, 130),
    justifyContent: 'flex-end',
    paddingHorizontal: width * 0.05,
    paddingBottom: Math.max(height * 0.05, 30),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.02,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#16423c',
    width: 20,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default WalkthroughScreen;