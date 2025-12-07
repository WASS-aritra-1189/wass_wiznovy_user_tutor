import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import SubjectTutorCard, { SubjectTutor } from '../components/SubjectTutorCard';

const { width: screenWidth } = Dimensions.get('window');

const BANNER_IMAGES = [
  { id: 'banner-1', image: require('../assets/categorymain.png') },
  { id: 'banner-2', image: require('../assets/categorymain.png') },
  { id: 'banner-3', image: require('../assets/categorymain.png') },
];

interface SubjectTeachersPageProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}



// Mock tutors data - replace with API data
const MOCK_TUTORS: SubjectTutor[] = [
  {
    id: '1',
    name: 'Mr. Alabar Anthoney',
    subject: 'SPANISH LANGUAGE',
    rating: 4.8,
    sessions: '4 PH',
    totalRatings: '150',
    totalHours: '200',
    groupTuition: true,
    privateTuition: true,
    isNew: true,
  },
  {
    id: '2',
    name: 'John Smith',
    subject: 'Mathematics',
    rating: 4.7,
    sessions: '3 PH',
    totalRatings: '120',
    totalHours: '180',
    groupTuition: true,
    privateTuition: true,
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    subject: 'English Literature',
    rating: 4.9,
    sessions: '5 PH',
    totalRatings: '200',
    totalHours: '250',
    groupTuition: true,
    privateTuition: true,
    isNew: true,
  },
  {
    id: '4',
    name: 'David Wilson',
    subject: 'Physics',
    rating: 4.6,
    sessions: '6 PH',
    totalRatings: '90',
    totalHours: '150',
    groupTuition: true,
    privateTuition: false,
  },
  {
    id: '5',
    name: 'Emily Davis',
    subject: 'Chemistry',
    rating: 4.8,
    sessions: '4 PH',
    totalRatings: '110',
    totalHours: '170',
    groupTuition: false,
    privateTuition: true,
    isNew: true,
  },
];

const SubjectTeachersPage: React.FC<SubjectTeachersPageProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const subjectTitle = route?.params?.subjectTitle || 'Subject';
  const tutors = route?.params?.tutors || MOCK_TUTORS;
  const insets = useSafeAreaInsets();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageWidth = screenWidth - 40;

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    if (isMounted) {
      intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % BANNER_IMAGES.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * imageWidth,
            animated: true,
          });
          return nextIndex;
        });
      }, 5000);
    }

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [imageWidth]);

  const handleBackPress = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  }, [navigation, onBack]);

  const handleHomePress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Profile' });
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation]);

  const renderBanner = () => (
    <View style={styles.categoryBannerContainer}>
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
        {BANNER_IMAGES.map((banner, index) => (
          <Image 
            key={banner.id}
            source={banner.image} 
            style={[styles.categoryImage, { width: imageWidth }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      <View style={styles.paginationOverlay}>
        <View style={styles.paginationContainer}>
          {BANNER_IMAGES.map((banner, index) => (
            <View
              key={`dot-${banner.id}`}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );



  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.headerText}>{subjectTitle} Teachers</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <View style={styles.teachersContainer}>
              {tutors.slice(0, 2).map((tutor: SubjectTutor) => (
                <SubjectTutorCard 
                  key={tutor.id} 
                  tutor={tutor} 
                  onPress={() => navigation.navigate('TutorDetailPage', { tutor })}
                />
              ))}
            </View>
            {renderBanner()}
            <View style={styles.teachersContainer}>
              {tutors.slice(2).map((tutor: SubjectTutor) => (
                <SubjectTutorCard 
                  key={tutor.id} 
                  tutor={tutor} 
                  onPress={() => navigation.navigate('TutorDetailPage', { tutor })}
                />
              ))}
            </View>
          </View>
        </ScrollView>
        
        <Footer 
          onHomePress={handleHomePress}
          onProfilePress={handleProfilePress}
          onSearchPress={handleSearchPress}
        />
    </View>
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
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#16423C',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 0,
    paddingRight: 4,
  },
  headerText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  teachersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryBannerContainer: {
    paddingHorizontal: 20,
    marginVertical: 25,
    alignItems: 'center',
    position: 'relative',
  },
  bannerScrollView: {
    height: 191,
  },
  categoryImage: {
    width: '100%',
    height: 191,
    borderRadius: 12,
    marginRight: 0,
    backgroundColor: '#f0f0f0',
  },
  paginationOverlay: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    width: 50,
    height: 18,
    borderRadius: 13.5,
    borderWidth: 0.41,
    borderColor: '#01004C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  paginationDot: {
    width: 5.48,
    height: 5.48,
    borderRadius: 2.74,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#01004C',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#01004C',
    width: 5.48,
    height: 5.48,
    borderRadius: 2.74,
    borderWidth: 1,
    borderColor: '#01004C',
  },
});

export default React.memo(SubjectTeachersPage);