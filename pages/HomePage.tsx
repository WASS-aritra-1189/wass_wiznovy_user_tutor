import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AiChatBanner from '../components/home/AiChatBanner';
import Categories from '../components/home/Categories';
import Navbar from '../components/home/Navbar';
import PopularCourses from '../components/home/PopularCourses';
import QuickOfferings from '../components/home/QuickOfferings';
import TopSubjects from '../components/home/TopSubjects';
import TutorRecommendation from '../components/home/TutorRecommendation';



interface HomePageProps {
  userGender?: string;
  userName?: string;
}

const HomePage: React.FC<HomePageProps> = ({ userGender = 'Male', userName = 'User' }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
 
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const bannerImages = [
    { id: 'banner-1', src: require('../assets/mainbanner.jpg') },
    { id: 'banner-2', src: require('../assets/mainbanner.jpg') },
    { id: 'banner-3', src: require('../assets/mainbanner.jpg') },
  ];
  
  const { width } = Dimensions.get('window');
  const imageWidth = width - 40;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % bannerImages.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * imageWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [imageWidth, bannerImages.length]);

 

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      <Navbar userGender={userGender} userName={userName} navigation={navigation} />

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScrollView}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / imageWidth);
              setCurrentIndex(newIndex);
            }}
          >
            {bannerImages.map((item) => (
              <Image 
                key={item.id}
                source={item.src} 
                style={[styles.bannerImage, { width: imageWidth }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {bannerImages.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        </View>
        
        <QuickOfferings />
        
        <TopSubjects />
        
        <TutorRecommendation />
        
        <AiChatBanner />
        
        <PopularCourses />
        
        <Categories navigation={navigation} />
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },


  content: {
    flex: 1,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerScrollView: {
    height: 200,
  },
  bannerImage: {
    height: 200,
    borderRadius: 12,
    marginRight: 0,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C4DAD2',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#16423C',
    width: 12,
    height: 8,
    borderRadius: 4,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  spacer: {
    height: 30,
  },
});

export default HomePage;