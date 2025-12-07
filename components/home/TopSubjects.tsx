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
import { fetchSubjects } from '../../store/subjectSlice';

const TopSubjects: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { subjects, loading } = useSelector((state: RootState) => state.subject);
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
    dispatch(fetchSubjects());
  }, [dispatch]);



  return (
    <View style={[styles.subjectsContainer, {
      paddingVertical: fontScale >= 1.6 ? 25 : fontScale >= 1.3 ? 22 : 20,
      marginBottom: fontScale >= 1.6 ? 25 : fontScale >= 1.3 ? 22 : 20,
    }]}>
      <View style={[styles.subjectsHeader, {
        marginBottom: fontScale >= 1.6 ? 20 : fontScale >= 1.3 ? 18 : 15,
      }]}>
        <Text style={[styles.subjectsTitle, {
          fontSize: getResponsiveFontSize(18),
        }]}
        numberOfLines={fontScale >= 1.6 ? 2 : 1}
        >Top Subjects</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CategorySubjectsPage')}>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectsGrid}>
          {subjects.slice(0, 6).map((subject) => (
            <TouchableOpacity 
              key={subject.id} 
              style={[styles.subjectItem, {
                width: fontScale >= 2.0 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
                marginRight: fontScale >= 1.6 ? 25 : fontScale >= 1.3 ? 22 : 20,
              }]} 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('AllTutors', { subject: subject.name })}
            >
              <View style={[styles.subjectIconContainer, {
                width: fontScale >= 2.0 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
                height: fontScale >= 2.0 ? 90 : fontScale >= 1.6 ? 85 : fontScale >= 1.3 ? 82 : 80,
                borderRadius: fontScale >= 2.0 ? 45 : fontScale >= 1.6 ? 42.5 : fontScale >= 1.3 ? 41 : 40,
                marginBottom: fontScale >= 1.6 ? 12 : fontScale >= 1.3 ? 10 : 8,
              }]}>
                <Image 
                  source={subject.image ? { uri: subject.image } : require('../../assets/subjects.png')} 
                  style={[styles.subjectIcon, {
                    width: fontScale >= 2.0 ? 40 : fontScale >= 1.6 ? 45 : fontScale >= 1.3 ? 47 : 50,
                    height: fontScale >= 2.0 ? 40 : fontScale >= 1.6 ? 45 : fontScale >= 1.3 ? 47 : 50,
                  }]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.subjectText, {
                fontSize: getResponsiveFontSize(11),
                minHeight: fontScale >= 1.6 ? 44 : fontScale >= 1.3 ? 36 : 'auto',
                lineHeight: fontScale >= 1.6 ? 22 : fontScale >= 1.3 ? 18 : undefined,
              }]}
              numberOfLines={fontScale >= 1.6 ? 2 : 1}
              >{subject.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subjectsContainer: {
    backgroundColor: '#F2FFFA',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#918d8dff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    borderColor:'#E4E4E4',
    borderWidth:1,
  },
  subjectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subjectsTitle: {
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
  subjectsGrid: {
    flexDirection: 'row',
  },
  subjectItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  subjectIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDFDFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#000',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subjectIcon: {
    width: 50,
    height: 50,
  },
  subjectText: {
    fontSize: 11,
    color: '#16423C',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default TopSubjects;