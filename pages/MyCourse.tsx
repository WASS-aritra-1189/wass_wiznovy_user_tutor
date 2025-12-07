import React, { useState} from 'react';
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
import InfoCard from '../components/InfoCard';
import CourseCard from '../components/CourseCard';
import { getPaginatedCourses } from '../services/searchService';

interface MyCourseProps {
  navigation: any;
}

const MyCourse: React.FC<MyCourseProps> = ({ navigation }) => {
  const [showCourses, setShowCourses] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleShowCourses = async () => {
    setLoading(true);
    try {
      console.log('Fetching courses...');
      const response = await getPaginatedCourses(50, 0);
      console.log('API Response:', response);
      
      if (response?.success) {
        if (response.data && response.data.length > 0) {
          console.log('Courses found:', response.data.length);
          setCourses(response.data);
          setShowCourses(true);
        } else {
          console.log('No courses in response data');
          setCourses([]);
          setShowCourses(true);
        }
      } else {
        console.log('API call failed:', response?.message);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      );
    }
    
    if (showCourses) {
      if (courses.length === 0) {
        return (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No courses available</Text>
          </View>
        );
      }
      
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {courses.map((course) => (
            <TouchableOpacity key={course.id} style={styles.courseWrapper} onPress={() => navigation.navigate('CourseDetails', { course })} activeOpacity={1}>
              <CourseCard
                image={course.imageUrl ? { uri: course.imageUrl } : require('../assets/coursemenu.png')}
                title={course.name}
                description={course.description}
                duration={`${course.totalDuration} min`}
                language="English"
                price={`$${course.discountPrice || course.price}`}
                totalVideos={`${course.totalLectures} videos`}
                rating={course.averageRating || '4.5'}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }
    
    return (
      <InfoCard
        image={require('../assets/gotodashboard.png')}
        title="No Course Found!"
        description="Please read the terms carefully before accepting. Review the permissions requested by the app."
        buttonTitle="Show Courses"
        onButtonPress={handleShowCourses}
        buttonColor="#16423C"
      />
    );
  };



  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#ffffffff" />
          <Text style={styles.backText}>My Courses</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Content */}
      <View style={[styles.content, showCourses && styles.contentWithCourses]}>
        {renderContent()}
      </View>
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
    backgroundColor:'#16423C',
    borderBottomRightRadius:20,
    borderBottomLeftRadius:20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 0,
    paddingRight: 4,
  },
  backText: {
    fontSize: 16,
    color: '#ffffffff',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 200,
    paddingBottom: 20,
    alignItems: 'center',
  },
  contentWithCourses: {
    paddingTop: 20,
    alignItems: 'stretch',
  },
  courseWrapper: {
    marginBottom: 12,
    marginHorizontal: 4,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
});

export default MyCourse;