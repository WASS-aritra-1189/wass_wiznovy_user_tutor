import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchPaginatedCourses } from '../store/courseSlice';

interface AllCoursesProps {
  onClose?: () => void;
}

const AllCourses: React.FC<AllCoursesProps> = ({ onClose }) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.course);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllCourses = () => {
    console.log('🔍 Fetching all courses...');
    dispatch(fetchPaginatedCourses({ limit: 100, offset: 0 }));
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchQuery.trim()) {
      filtered = filtered.filter(course =>
        course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
    console.log('🔍 Filtered to', filtered.length, 'courses');
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    const delayedFilter = setTimeout(() => {
      filterCourses();
    }, 300);

    return () => clearTimeout(delayedFilter);
  }, [searchQuery, courses]);

  useEffect(() => {
    if (courses.length > 0) {
      setFilteredCourses(courses);
    }
  }, [courses]);

  const handleCoursePress = (course: any) => {
    navigation.navigate('CourseDetails', { courseId: course.id, course });
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
    
    if (filteredCourses.length > 0) {
      return (
        <ScrollView style={styles.coursesList} showsVerticalScrollIndicator={false}>
          <View style={styles.coursesGrid}>
            {filteredCourses.map((course) => (
              <TouchableOpacity key={course.id} style={styles.courseCard} onPress={() => handleCoursePress(course)}>
                <View style={styles.courseImageContainer}>
                  <Image 
                    source={course.imageUrl ? { uri: course.imageUrl } : require('../assets/courses.png')} 
                    style={styles.courseImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity style={styles.reactionButton}>
                    <Image 
                      source={require('../assets/reaction.png')} 
                      style={styles.reactionIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.name}</Text>
                  <Text style={styles.courseSubtitle}>{course.totalLectures} Lectures ({course.totalDuration} min)</Text>
                  
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItemContainer}>
                      <View style={styles.durationContainer}>
                        <Image 
                          source={require('../assets/clock.png')} 
                          style={styles.clockIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.durationText}>{course.totalDuration}min</Text>
                      </View>
                    </View>
                    <View style={styles.detailItemContainer}>
                      <View style={styles.priceContainer}>
                        <Image 
                          source={require('../assets/dollarforcourse.png')} 
                          style={styles.dollarCourseIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.priceText}>${course.discountPrice || course.price}</Text>
                      </View>
                    </View>
                    <View style={styles.ratingItemContainer}>
                      <View style={styles.ratingContainer}>
                        <Image 
                          source={require('../assets/imageforratingincoursecard.png')} 
                          style={styles.ratingIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.ratingText}>{(Number.parseFloat(course.averageRating) || 4.5).toFixed(1)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="school" size={48} color="#CCCCCC" />
        <Text style={styles.emptyText}>No courses found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your search</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Courses</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#16423C" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Courses List */}
      <View style={styles.coursesContainer}>
        <Text style={styles.coursesTitle}>
          {loading ? 'Loading...' : `${filteredCourses.length} Courses Found`}
        </Text>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  coursesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  coursesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16423C',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666666',
  },
  coursesList: {
    flex: 1,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '48%',
    borderWidth: 1,
    borderColor: '#D3CDCD',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#c4c1c1ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
  },
  courseImageContainer: {
    width: '100%',
    height: 130,
    padding: 8,
    position: 'relative',
  },
  courseImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  reactionButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: '#F2FFFA',
    borderRadius: 15,
    padding: 6,
  },
  reactionIcon: {
    width: 18,
    height: 18,
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#01004C',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  detailItemContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#C4DAD2',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 25,
    borderColor:'#16423C',
    borderWidth: .41,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dollarCourseIcon: {
    width: 8,
    height: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  clockIcon: {
    width: 8,
    height: 8,
  },
  ratingItemContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  durationText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#16423C',
  },
  priceText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#16423C',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingIcon: {
    width: 8,
    height: 8,
  },
  ratingText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#000000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
});

export default AllCourses;