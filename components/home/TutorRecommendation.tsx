import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  PixelRatio,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchTutors } from '../../store/tutorSlice';

const getResponsiveFontSize = (baseSize: number, fontScale: number) => {
  if (fontScale >= 2) return Math.max(baseSize * 0.5, 11);
  if (fontScale >= 1.6) return Math.max(baseSize * 0.65, 12);
  if (fontScale >= 1.3) return Math.max(baseSize * 0.8, 13);
  if (fontScale <= 0.85) return Math.min(baseSize * 1.2, baseSize + 4);
  if (fontScale <= 0.9) return Math.min(baseSize * 1.1, baseSize + 2);
  return baseSize;
};

const getResponsiveValue = (fontScale: number, large: number, medium: number, small: number, defaultValue: number) => {
  if (fontScale >= 2) return large;
  if (fontScale >= 1.6) return medium;
  if (fontScale >= 1.3) return small;
  return defaultValue;
};

const getRating = (averageRating: string) => {
  const rating = Number.parseFloat(averageRating);
  return rating > 0 ? rating.toFixed(1) : '4.5';
};

const TutorRecommendation: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { tutors, loading } = useSelector((state: RootState) => state.tutor);
  const fontScale = PixelRatio.getFontScale();

  useEffect(() => {
    dispatch(fetchTutors());
  }, [dispatch]);

  const getHeaderMarginBottom = () => {
    if (fontScale >= 1.6) return 20;
    if (fontScale >= 1.3) return 18;
    return 15;
  };

  const getOnlineDotSize = () => {
    if (fontScale >= 2) return 8;
    if (fontScale >= 1.6) return 9;
    return 12;
  };

  const getOnlineDotBorderRadius = () => {
    if (fontScale >= 2) return 4;
    if (fontScale >= 1.6) return 4.5;
    return 6;
  };

  const getTutorNameMarginBottom = () => {
    if (fontScale >= 2) return 8;
    if (fontScale >= 1.6) return 6;
    if (fontScale >= 1.3) return 4;
    return 2;
  };

  const getSmallGap = () => {
    if (fontScale >= 2) return 6;
    if (fontScale >= 1.6) return 5;
    return 4;
  };

  const getBadgeSize = () => {
    if (fontScale >= 2) return 10;
    if (fontScale >= 1.6) return 12;
    return 16;
  };

  const getElementMarginBottom = () => {
    if (fontScale >= 2) return 10;
    if (fontScale >= 1.6) return 8;
    if (fontScale >= 1.3) return 6;
    return 4;
  };

  const getRatingRowGap = () => {
    if (fontScale >= 2) return 8;
    if (fontScale >= 1.6) return 6;
    return 6;
  };

  const getLargePaddingHorizontal = () => {
    if (fontScale >= 2) return 12;
    if (fontScale >= 1.6) return 10;
    return 8;
  };

  const getSmallPaddingHorizontal = () => {
    if (fontScale >= 2) return 8;
    if (fontScale >= 1.6) return 7;
    return 6;
  };

  const getMediumPadding = () => {
    if (fontScale >= 2) return 6;
    if (fontScale >= 1.6) return 5;
    return 4;
  };

  const getContainerGap = () => {
    if (fontScale >= 2) return 4;
    if (fontScale >= 1.6) return 3;
    return 2;
  };

  const getDollarIconSize = () => {
    if (fontScale >= 2) return 6;
    if (fontScale >= 1.6) return 7;
    return 8;
  };

  const getTuitionTypePaddingVertical = () => {
    if (fontScale >= 2) return 3;
    if (fontScale >= 1.6) return 2.5;
    return 2;
  };

  const getFlexDirection = () => fontScale >= 1.6 ? 'column' : 'row';
  const getAlignment = () => fontScale >= 1.6 ? 'center' : 'flex-start';
  const getTextAlign = () => fontScale >= 1.6 ? 'center' : 'left';
  const getJustifyContent = () => fontScale >= 1.6 ? 'center' : 'flex-start';
  const getFlexWrap = () => fontScale >= 2 ? 'wrap' : 'nowrap';

  return (
    <View style={styles.recommendationContainer}>
      <View style={[styles.recommendationHeader, {
        marginBottom: getHeaderMarginBottom(),
      }]}>
        <Text style={[styles.recommendationTitle, {
          fontSize: getResponsiveFontSize(18, fontScale),
        }]}
        numberOfLines={fontScale >= 1.6 ? 2 : 1}
        >Tutor Recommendation</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllTutors')}>
          <Text style={[styles.viewAllButton, {
            fontSize: getResponsiveFontSize(15, fontScale),
          }]}>View All</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#16423C" />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tutorSlider}>
          {tutors.slice(0, 5).map((tutor) => (
            <TouchableOpacity 
              key={tutor.id} 
              style={[styles.tutorCard, {
                width: getResponsiveValue(fontScale, 280, 300, 320, 294),
                height: getResponsiveValue(fontScale, 280, 240, 180, 114),
                padding: getResponsiveValue(fontScale, 16, 15, 15, 15),
              }]}
              onPress={() => {
                navigation?.navigate('TutorDetailPage', { tutorId: tutor.account?.id || tutor.id, tutor });
              }}
            >
              <View style={[styles.tutorContent, {
                flexDirection: getFlexDirection(),
                alignItems: 'center',
                height: '100%',
              }]}>
                <View style={[styles.tutorImageContainer, {
                  marginRight: fontScale >= 1.6 ? 0 : 12,
                  marginBottom: fontScale >= 1.6 ? 12 : 0,
                  alignSelf: getAlignment(),
                }]}>
                  <Image 
                    source={tutor.profileImage ? { uri: tutor.profileImage } : require('../../assets/tutor.png')} 
                    style={[styles.tutorImage, {
                      width: getResponsiveValue(fontScale, 60, 70, 80, 90),
                      height: getResponsiveValue(fontScale, 60, 70, 80, 90),
                      borderRadius: getResponsiveValue(fontScale, 30, 35, 40, 45),
                    }]}
                    resizeMode="cover"
                  />
                  <View style={[styles.onlineDot, {
                    width: getOnlineDotSize(),
                    height: getOnlineDotSize(),
                    borderRadius: getOnlineDotBorderRadius(),
                  }]} />
                </View>
                <View style={[styles.tutorInfo, {
                  flex: 1,
                  alignItems: getAlignment(),
                  width: fontScale >= 1.6 ? '100%' : 'auto',
                }]}>
                  <View style={[styles.tutorNameRow, {
                    marginBottom: getTutorNameMarginBottom(),
                    gap: getSmallGap(),
                    justifyContent: getJustifyContent(),
                  }]}>
                    <Text style={[styles.tutorName, {
                      fontSize: getResponsiveFontSize(12, fontScale),
                      textAlign: getTextAlign(),
                    }]}
                    numberOfLines={fontScale >= 1.3 ? 2 : 1}
                    >{tutor.name}</Text>
                    <Image 
                      source={require('../../assets/tutor badge.png')} 
                      style={[styles.tutorBadge, {
                        width: getBadgeSize(),
                        height: getBadgeSize(),
                      }]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.tutorSubject, {
                    fontSize: getResponsiveFontSize(10, fontScale),
                    marginBottom: getElementMarginBottom(),
                    textAlign: getTextAlign(),
                    width: fontScale >= 1.6 ? '100%' : 'auto',
                  }]}
                  numberOfLines={fontScale >= 1.3 ? 3 : 1}
                  >Specialized in: {tutor.subject?.name || 'General'}</Text>
                  
                  <View style={[styles.ratingSessionRow, {
                    marginBottom: getElementMarginBottom(),
                    gap: getRatingRowGap(),
                    justifyContent: getJustifyContent(),
                    flexWrap: getFlexWrap(),
                  }]}>
                    <View style={[styles.sessionContainer, {
                      paddingHorizontal: getLargePaddingHorizontal(),
                      paddingVertical: getMediumPadding(),
                      gap: getContainerGap(),
                    }]}>
                      <Image 
                        source={require('../../assets/dollar.png')} 
                        style={[styles.dollarIcon, {
                          width: getDollarIconSize(),
                          height: getDollarIconSize(),
                        }]}
                        resizeMode="contain"
                      />
                      <Text style={[styles.sessionText, {
                        fontSize: getResponsiveFontSize(8, fontScale),
                      }]}>${tutor.hourlyRate}/hr</Text>
                    </View>
                    <View style={[styles.ratingContainer, {
                      paddingHorizontal: getLargePaddingHorizontal(),
                      paddingVertical: getMediumPadding(),
                    }]}>
                      <Text style={[styles.ratingText, {
                        fontSize: getResponsiveFontSize(8, fontScale),
                      }]}>★{getRating(tutor.averageRating)}</Text>
                    </View>
                  </View>

                  <View style={[styles.tuitionTypeRow, {
                    gap: getSmallGap(),
                    justifyContent: getJustifyContent(),
                    flexWrap: getFlexWrap(),
                  }]}>
                    <View style={[styles.tuitionType, {
                      paddingHorizontal: getSmallPaddingHorizontal(),
                      paddingVertical: getTuitionTypePaddingVertical(),
                    }]}>
                      <Text style={[styles.tuitionTypeText, {
                        fontSize: getResponsiveFontSize(8, fontScale),
                      }]}
                      numberOfLines={1}
                      >Group</Text>
                    </View>
                    <View style={[styles.tuitionType, {
                      paddingHorizontal: getSmallPaddingHorizontal(),
                      paddingVertical: getTuitionTypePaddingVertical(),
                    }]}>
                      <Text style={[styles.tuitionTypeText, {
                        fontSize: getResponsiveFontSize(8, fontScale),
                      }]}
                      numberOfLines={1}
                      >Private</Text>
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
  recommendationContainer: {
    paddingHorizontal: 20,
    marginBottom: 5,
    
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recommendationTitle: {
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
  tutorSlider: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tutorCard: {
    backgroundColor: '#F2FFFA',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    marginBottom: 8,
    width: 294,
    height: 114,
    elevation: 4,
    shadowColor: '#888585ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    borderColor:'#E4E4E4',
    borderWidth:1,
    
  },
  tutorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  tutorImageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  tutorImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  onlineDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0AAD2D',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tutorInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  tutorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  },
  tutorName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#01004C',
    textAlign: 'left',
  },
  tutorBadge: {
    width: 16,
    height: 16,
  },
  tutorSubject: {
    fontSize: 10,
    color: '#01004C',
    marginBottom: 4,
    textAlign: 'left',
  },
  ratingSessionRow: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 6,
  },
  sessionContainer: {
    backgroundColor: '#E8F4F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 25,
    minWidth: 40,
    borderWidth: .41,
    borderColor: '#01004C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dollarIcon: {
    width: 8,
    height: 8,
  },
  sessionText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#16423C',
  },
  ratingContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 25,
    minWidth: 40,
    borderWidth: .41,
    borderColor: '#01004C',
  },
  ratingText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#E6B301',
  },
  tuitionTypeRow: {
    flexDirection: 'row',
    gap: 4,
  },
  tuitionType: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#B9B9B9',
  },
  tuitionTypeText: {
    fontSize: 8,
    fontWeight: '400',
    color: '#666',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default TutorRecommendation;