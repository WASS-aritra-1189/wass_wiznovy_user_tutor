import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchCourseUnits, clearUnits } from '../store/unitSlice';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import CourseCard from '../components/CourseCard';
import UnitCard from '../components/UnitCard';

interface VideoDetailsPageProps {
  navigation: any;
  route: any;
}

const VideoDetailsPage: React.FC<VideoDetailsPageProps> = ({ navigation, route }) => {
  const { course } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { units, loading, error } = useSelector((state: RootState) => state.unit);
  
  const courseId = course?.id;
  
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseUnits(courseId));
    }
    
    return () => {
      dispatch(clearUnits());
    };
  }, [courseId, dispatch]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleUnitPress = (unit: any) => {
    // Navigate to unit details or videos page
    navigation.navigate('CourseVideoPage', { unit });
  };

  const renderUnits = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading units...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>Failed to load units</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => courseId && dispatch(fetchCourseUnits(courseId))}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (units.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="video-library" size={48} color="#CCCCCC" />
          <Text style={styles.emptyText}>No units available for this course</Text>
        </View>
      );
    }
    
    return units.map((unit) => (
      <UnitCard
        key={unit.id}
        id={unit.id}
        name={unit.name}
        description={unit.description}
        imageUrl={unit.imgUrl}
        courseName={unit.course.name}
        onPress={() => handleUnitPress(unit)}
      />
    ));
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#ffffff" />
          <Text style={styles.backText}>Course Units</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.courseCardWrapper}>
          <CourseCard
            image={course.imageUrl ? { uri: course.imageUrl } : course.image || require('../assets/coursemenu.png')}
            title={course.name || course.title || 'Course Title'}
            description={course.description || 'Course description'}
            duration={`${course.totalDuration || course.duration || 0} min`}
            language="English"
            price={`$${course.discountPrice || course.price || 0}`}
            totalVideos={`${course.totalLectures || course.totalVideos || 0} videos`}
            rating={course.averageRating || course.rating || '4.5'}
          />
        </View>
        
        {renderUnits()}
      </ScrollView>
      </View>
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
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#16423C',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  backText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 0,
    flex: 1,
  },
  headerPlaceholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 50,
  },
  courseCardWrapper: {
    marginTop: 20,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#16423C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});

export default VideoDetailsPage;