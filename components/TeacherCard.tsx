import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  rating: number;
  sessions: string;
  groupTuition: boolean;
  privateTuition: boolean;
  image?: string;
  isNew?: boolean;
}

interface TeacherCardProps {
  teacher: Teacher;
  onPress?: () => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onPress }) => {
  return (
    <TouchableOpacity style={styles.tutorCard} onPress={onPress}>
      {teacher.isNew && (
        <Image 
          source={require('../assets/new.png')} 
          style={styles.newBadge}
          resizeMode="contain"
        />
      )}
      <View style={styles.tutorContent}>
        <View style={styles.tutorImageContainer}>
          <Image 
            source={require('../assets/tutor.png')} 
            style={styles.tutorImage}
            resizeMode="cover"
          />
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.tutorInfo}>
          <View style={styles.tutorNameRow}>
            <Text style={styles.tutorName}>{teacher.name}</Text>
            <Image 
              source={require('../assets/tutor badge.png')} 
              style={styles.tutorBadge}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.tutorSubject}>Specialized in: {teacher.subject}</Text>
          
          <View style={styles.ratingSessionRow}>
            <View style={styles.sessionContainer}>
              <Image 
                source={require('../assets/dollar.png')} 
                style={styles.dollarIcon}
                resizeMode="contain"
              />
              <Text style={styles.sessionText}>{teacher.sessions}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>★{teacher.rating}</Text>
            </View>
          </View>

          <View style={styles.tuitionTypeRow}>
            {teacher.groupTuition && (
              <View style={styles.tuitionType}>
                <Text style={styles.tuitionTypeText}>Group Tuition</Text>
              </View>
            )}
            {teacher.privateTuition && (
              <View style={styles.tuitionType}>
                <Text style={styles.tuitionTypeText}>Private Tuition</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tutorCard: {
    backgroundColor: '#F2FFFA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    height: 114,
    elevation: 4,
    shadowColor: '#888585ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    borderColor: '#E4E4E4',
    borderWidth: 1,
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
    borderWidth: 0.41,
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
    borderWidth: 0.41,
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
  newBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    zIndex: 1,
  },
});

export default TeacherCard;