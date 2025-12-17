import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import TutorCard from '../components/TutorCard';
import Footer from '../components/Footer';
import { getAllSubjects } from '../services/searchService';

interface CategorySubjectsPageProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const BANNER_IMAGES = [
  require('../assets/categorymain.png'),
  require('../assets/categorymain.png'),
  require('../assets/categorymain.png'),
];
const CategorySubjectsPage: React.FC<CategorySubjectsPageProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await getAllSubjects();
        if (response.success && response.data) {
        
          const transformedSubjects = response.data.map((subject: any) => {
            let subjectName = 'Unknown';
            if (typeof subject.name === 'string') {
              subjectName = subject.name;
            } else if (subject.name && typeof subject.name === 'object') {
              subjectName = subject.name.name || subject.name.title || 'Unknown';
            }
            const transformed = {
              id: String(subject.id),
              image: subject.image || require('../assets/subjects.png'),
              title: `${subjectName} Tutor`,
              expertCount: '5',
            };
            console.log('Transformed subject:', transformed);
            return transformed;
          });
          setSubjects(transformedSubjects);
          console.log('All subjects set:', transformedSubjects);
        } else {
          console.log('API failed:', response);
          setSubjects([
            { id: '1', image: require('../assets/subjects.png'), title: 'Mathematics Tutor', expertCount: '5' },
            { id: '2', image: require('../assets/subjects.png'), title: 'Science Tutor', expertCount: '8' },
            { id: '3', image: require('../assets/subjects.png'), title: 'English Tutor', expertCount: '12' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([
          { id: '1', image: require('../assets/subjects.png'), title: 'Mathematics Tutor', expertCount: '5' },
          { id: '2', image: require('../assets/subjects.png'), title: 'Science Tutor', expertCount: '8' },
          { id: '3', image: require('../assets/subjects.png'), title: 'English Tutor', expertCount: '12' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);
  const tutors = route?.params?.tutors || subjects;
  const handleTutorPress = useCallback((tutorTitle: string) => {
    console.log('handleTutorPress called with:', tutorTitle, typeof tutorTitle);
    const titleString = typeof tutorTitle === 'string' ? tutorTitle : String(tutorTitle);
    const subjectName = titleString.replace(' Tutor', '');
    navigation.navigate('AllTutors', {
      subject: subjectName,
    });
  }, [navigation]);
  
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

  
  const handleHomePress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Profile' });
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation]);

  const handleBackPress = useCallback(() => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  }, [navigation, onBack]);
  const bannerComponent = useMemo(() => (
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
        {BANNER_IMAGES.map((image, index) => (
          <Image 
            key={`banner-${index}-${image}`}
            source={image} 
            style={[styles.categoryImage, { width: imageWidth }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      <View style={styles.paginationOverlay}>
        <View style={styles.paginationContainer}>
          {BANNER_IMAGES.map((image, index) => (
            <View
              key={`dot-${image}-${index}`}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  ), [imageWidth, currentIndex]);
  const renderTutorRow = useCallback((slice: typeof tutors, rowKey: string, isLastRow = false) => (
    <View key={rowKey} style={[styles.tutorsRow, isLastRow && styles.lastRow]}>
      {slice.map((tutor: any) => (
        <View key={tutor.id} style={styles.tutorCardWrapper}>
          <TutorCard
            image={tutor.image}
            title={typeof tutor.title === 'string' ? tutor.title : String(tutor.title)}
            expertCount={typeof tutor.expertCount === 'string' ? tutor.expertCount : String(tutor.expertCount)}
            onPress={() => handleTutorPress(tutor.title)}
          />
        </View>
      ))}
    </View>
  ), [handleTutorPress]);
 const tutorRows = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <View style={styles.tutorsContainer}>
          {renderTutorRow(tutors.slice(0, 3), 'row-1')}
        </View>
        {bannerComponent}
        <View style={styles.tutorsContainer}>
          {renderTutorRow(tutors.slice(3, 6), 'row-2')}
          {renderTutorRow(tutors.slice(6, 9), 'row-3', true)}
        </View>
      </View>
    );
  }, [tutors, bannerComponent, renderTutorRow, loading]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.headerText}>My Categories</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
        >
          {tutorRows}
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
  tutorsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tutorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingHorizontal: 0,
  },
  lastRow: {
    marginBottom: 10,
  },
  tutorCardWrapper: {
    alignItems: 'center',
    flex: 1,
    maxWidth: '33.33%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#16423C',
  },
});

export default React.memo(CategorySubjectsPage);