import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  PixelRatio,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchCourses } from '../../store/courseSlice';

const { width } = Dimensions.get('window');

const PopularCourses: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.course);
  const fontScale = PixelRatio.getFontScale();

  const getResponsiveFontSize = (baseSize: number) => {
    if (fontScale >= 2.0) return Math.max(baseSize * 0.5, 11);
    if (fontScale >= 1.6) return Math.max(baseSize * 0.65, 12);
    if (fontScale >= 1.3) return Math.max(baseSize * 0.8, 13);
    if (fontScale <= 0.85) return Math.min(baseSize * 1.2, baseSize + 4);
    if (fontScale <= 0.9) return Math.min(baseSize * 1.1, baseSize + 2);
    return baseSize;
  };

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const getRating = (averageRating: string) => {
    const rating = parseFloat(averageRating);
    return rating > 0 ? rating.toFixed(1) : '4.5';
  };

  return (
    <View style={[styles.coursesContainer, {
      marginBottom: fontScale >= 1.6 ? 15 : 10,
    }]}>
      <View style={[styles.coursesHeader, {
        marginBottom: fontScale >= 1.6 ? 20 : fontScale >= 1.3 ? 18 : 15,
      }]}>
        <Text style={[styles.coursesTitle, {
          fontSize: getResponsiveFontSize(18),
        }]}
        numberOfLines={fontScale >= 1.6 ? 2 : 1}
        >Popular Course</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllCourses')}>
          <Text style={[styles.viewAllButton, {
            fontSize: getResponsiveFontSize(15),
          }]}>View All</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#16423C" />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesSlider}>
          {courses.slice(0, 5).map((course) => (
            <TouchableOpacity 
              key={course.id} 
              style={[styles.courseCard, {
                width: fontScale >= 2.0 ? 220 : fontScale >= 1.6 ? 240 : fontScale >= 1.3 ? 260 : fontScale <= 0.85 ? 280 : 250,
                marginRight: fontScale >= 1.6 ? 18 : 15,
              }]}
              onPress={() => navigation.navigate('CourseDetails', { courseId: course.id, course })}
            >
              <View style={[styles.courseImageContainer, {
                height: fontScale >= 2.0 ? 110 : fontScale >= 1.6 ? 120 : 130,
                padding: fontScale >= 1.6 ? 10 : 8,
              }]}>
                <Image 
                  source={course.imageUrl ? { uri: course.imageUrl } : require('../../assets/courses.png')} 
                  style={styles.courseImage}
                  resizeMode="cover"
                />
                <TouchableOpacity style={[styles.reactionButton, {
                  top: fontScale >= 1.6 ? 20 : 18,
                  right: fontScale >= 1.6 ? 20 : 18,
                  padding: fontScale >= 1.6 ? 8 : 6,
                }]}>
                  <Image 
                    source={require('../../assets/reaction.png')} 
                    style={[styles.reactionIcon, {
                      width: fontScale >= 1.6 ? 16 : 18,
                      height: fontScale >= 1.6 ? 16 : 18,
                    }]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.courseInfo, {
                padding: fontScale >= 1.6 ? 15 : 12,
              }]}>
                <Text style={[styles.courseTitle, {
                  fontSize: getResponsiveFontSize(16),
                  marginBottom: fontScale >= 1.6 ? 6 : 4,
                }]}
                numberOfLines={fontScale >= 1.6 ? 2 : 1}
                >{course.name}</Text>
                <Text style={[styles.courseSubtitle, {
                  fontSize: getResponsiveFontSize(12),
                  marginBottom: fontScale >= 1.6 ? 15 : 12,
                }]}
                numberOfLines={fontScale >= 1.6 ? 2 : 1}
                >{course.totalLectures} Lectures ({course.totalDuration})</Text>
                
                <View style={[styles.detailsRow, {
                  gap: fontScale >= 1.6 ? 10 : 8,
                  flexDirection: fontScale >= 2.0 ? 'column' : 'row',
                }]}>
                  <View style={[styles.detailItemContainer, {
                    paddingVertical: fontScale >= 1.6 ? 8 : 6,
                    paddingHorizontal: fontScale >= 1.6 ? 10 : 8,
                    flex: fontScale >= 2.0 ? 0 : 1,
                    width: fontScale >= 2.0 ? '100%' : 'auto',
                  }]}>
                    <View style={[styles.durationContainer, {
                      gap: fontScale >= 1.6 ? 3 : 2,
                    }]}>
                      <Image 
                        source={require('../../assets/clock.png')} 
                        style={[styles.clockIcon, {
                          width: fontScale >= 1.6 ? 8 : 10,
                          height: fontScale >= 1.6 ? 8 : 10,
                        }]}
                        resizeMode="contain"
                      />
                      <Text style={[styles.durationText, {
                        fontSize: getResponsiveFontSize(10),
                      }]}>{course.totalDuration}</Text>
                    </View>
                  </View>
                  <View style={[styles.detailItemContainer, {
                    paddingVertical: fontScale >= 1.6 ? 8 : 6,
                    paddingHorizontal: fontScale >= 1.6 ? 10 : 8,
                    flex: fontScale >= 2.0 ? 0 : 1,
                    width: fontScale >= 2.0 ? '100%' : 'auto',
                  }]}>
                    <View style={[styles.priceContainer, {
                      gap: fontScale >= 1.6 ? 3 : 2,
                    }]}>
                      <Image 
                        source={require('../../assets/dollarforcourse.png')} 
                        style={[styles.dollarCourseIcon, {
                          width: fontScale >= 1.6 ? 8 : 10,
                          height: fontScale >= 1.6 ? 8 : 10,
                        }]}
                        resizeMode="contain"
                      />
                      <Text style={[styles.priceText, {
                        fontSize: getResponsiveFontSize(10),
                      }]}>{course.discountPrice || course.price}</Text>
                    </View>
                  </View>
                  <View style={[styles.ratingItemContainer, {
                    paddingVertical: fontScale >= 1.6 ? 8 : 6,
                    paddingHorizontal: fontScale >= 1.6 ? 10 : 8,
                    flex: fontScale >= 2.0 ? 0 : 1,
                    width: fontScale >= 2.0 ? '100%' : 'auto',
                  }]}>
                    <View style={[styles.ratingContainer, {
                      gap: fontScale >= 1.6 ? 3 : 2,
                    }]}>
                      <Image 
                        source={require('../../assets/imageforratingincoursecard.png')} 
                        style={[styles.ratingIcon, {
                          width: fontScale >= 1.6 ? 8 : 10,
                          height: fontScale >= 1.6 ? 8 : 10,
                        }]}
                        resizeMode="contain"
                      />
                      <Text style={[styles.ratingText, {
                        fontSize: getResponsiveFontSize(10),
                      }]}>{getRating(course.averageRating)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  coursesContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  coursesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: -5,
  },
  coursesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
  },
  viewAllButton: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: 0,
    color: '#16423C',
  },
  coursesSlider: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 15,
    width: 250,
    borderWidth: 1,
    borderColor: '#D3CDCD',
    marginBottom: 8,
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
    gap: 8,
  },
  detailItemContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#C4DAD2',
    paddingVertical: 6,
    paddingHorizontal: 8,
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
    width: 10,
    height: 10,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    
    
  },
  clockIcon: {
    width: 10,
    height: 10,
  },
  ratingItemContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  durationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16423C', // Green color for duration
  },
  priceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16423C', // Same color as duration
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingIcon: {
    width: 10,
    height: 10,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default PopularCourses;