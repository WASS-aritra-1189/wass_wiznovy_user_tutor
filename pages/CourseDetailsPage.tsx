import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchCourseDetails, clearCourseDetails } from '../store/courseSlice';
import CourseCard from '../components/CourseCard';
import CourseDetailsCard from '../components/CourseDetailsCard';
import AuthorMessageCard from '../components/AuthorMessageCard';

interface CourseDetailsPageProps {
  navigation: any;
  route: any;
}

const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({ navigation, route }) => {
  const { course, courseId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { courseDetails, detailsLoading, detailsError } = useSelector((state: RootState) => state.course);
  const insets = useSafeAreaInsets();
  
  const actualCourseId = courseId || course?.id;
  
  useEffect(() => {
    if (actualCourseId) {
      dispatch(fetchCourseDetails(actualCourseId));
    }
    
    return () => {
      dispatch(clearCourseDetails());
    };
  }, [actualCourseId, dispatch]);
  
  // Use API data if available, fallback to route params
  const displayCourse = courseDetails || course;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleExploreCourse = () => {
    navigation.navigate('VideoDetailsPage', { course: displayCourse });
  };
  
  if (detailsLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#16423C" />
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#ffffff" />
            <Text style={styles.backText}>Course Details</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading course details...</Text>
        </View>
      </View>
    );
  }
  
  if (detailsError) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#16423C" />
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#ffffff" />
            <Text style={styles.backText}>Course Details</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>Failed to load course details</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => actualCourseId && dispatch(fetchCourseDetails(actualCourseId))}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  if (!displayCourse) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#16423C" />
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#ffffff" />
            <Text style={styles.backText}>Course Details</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Course not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#ffffff" />
          <Text style={styles.backText}>{displayCourse.name || displayCourse.title}</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.courseCardWrapper}>
          {(() => {
            let courseImage;
            if (displayCourse.thumbnailUrl) {
              courseImage = { uri: displayCourse.thumbnailUrl };
            } else if (displayCourse.imageUrl) {
              courseImage = { uri: displayCourse.imageUrl };
            } else {
              courseImage = displayCourse.image || require('../assets/coursemenu.png');
            }
            
            return (
              <CourseCard
                image={courseImage}
                title={displayCourse.name || displayCourse.title}
                description={displayCourse.description}
                duration={`${displayCourse.totalDuration || displayCourse.duration} min`}
                language={displayCourse.language?.name || "English"}
                price={`$${displayCourse.discountPrice || displayCourse.price}`}
                totalVideos={`${displayCourse.totalLectures || displayCourse.totalVideos} videos`}
                rating={displayCourse.averageRating || displayCourse.rating || '4.5'}
              />
            );
          })()}
        </View>
        
        <View style={styles.detailsCardWrapper}>
          {(() => {
            let detailsImage;
            if (displayCourse.tutor?.tutorDetail?.profileImage) {
              detailsImage = { uri: displayCourse.tutor.tutorDetail.profileImage };
            } else if (displayCourse.thumbnailUrl) {
              detailsImage = { uri: displayCourse.thumbnailUrl };
            } else {
              detailsImage = require('../assets/coursemenu.png');
            }
            
            return (
              <CourseDetailsCard
                image={detailsImage}
                authorName={displayCourse.tutor?.tutorDetail?.name || "Instructor"}
                expertise={displayCourse.tutor?.tutorDetail?.bio || "Expert instructor with years of experience."}
                startDate={displayCourse.startDate}
                endDate={displayCourse.endDate}
                courseName={displayCourse.name || displayCourse.title}
                price={displayCourse.price}
                discountPrice={displayCourse.discountPrice}
                subject={displayCourse.subject?.name}
                language={displayCourse.language?.name}
              />
            );
          })()}
        </View>
        
        <View style={styles.authorMessageWrapper}>
          <AuthorMessageCard message={displayCourse.authorMessage} />
        </View>
        
        <TouchableOpacity style={styles.exploreButton} onPress={handleExploreCourse}>
          <Text style={styles.exploreButtonText}>Explore The Course</Text>
        </TouchableOpacity>
      </ScrollView>
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
  detailsCardWrapper: {
    marginBottom: 16,
  },
  authorMessageWrapper: {
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 30,
  },
  exploreButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
});

export default CourseDetailsPage;