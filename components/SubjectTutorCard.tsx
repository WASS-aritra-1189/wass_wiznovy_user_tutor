import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export interface SubjectTutor {
  id: string;
  name: string;
  subject: string;
  rating: number;
  sessions: string;
  totalRatings: string;
  totalHours: string;
  groupTuition: boolean;
  privateTuition: boolean;
  image?: string;
  isNew?: boolean;
}

interface SubjectTutorCardProps {
  tutor: SubjectTutor;
  onPress?: () => void;
}

const SubjectTutorCard: React.FC<SubjectTutorCardProps> = ({ tutor, onPress }) => {
  return (
    <TouchableOpacity style={[styles.tutorCard, tutor.isNew && styles.newTutorCard]} onPress={onPress}>
      {tutor.isNew && (
        <Image 
          source={require('../assets/new.png')} 
          style={styles.newBadge}
          resizeMode="contain"
        />
      )}
      <View style={styles.tutorContent}>
        <View style={styles.tutorImageContainer}>
          <Image 
            source={tutor.image && tutor.image.trim() !== '' ? { uri: tutor.image } : require('../assets/tutor.png')} 
            style={styles.tutorImage}
            resizeMode="cover"
          />
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.tutorInfo}>
          <View style={styles.tutorNameRow}>
            <Text style={styles.tutorName}>{tutor.name}</Text>
            <Image 
              source={require('../assets/tutor badge.png')} 
              style={styles.tutorBadge}
              resizeMode="contain"
            />
            <View style={styles.sessionContainer}>
              <Image 
                source={require('../assets/dollar.png')} 
                style={styles.dollarIcon}
                resizeMode="contain"
              />
              <Text style={styles.sessionText}>{tutor.sessions}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>★{tutor.rating}</Text>
            </View>
          </View>
          <Text style={styles.tutorSubject}>Specialized in: {tutor.subject}</Text>
        </View>
      </View>

      <View style={styles.tuitionTypeRow}>
        {tutor.groupTuition && (
          <View style={styles.tuitionType}>
            <Text style={styles.tuitionTypeText}>Group Tuition</Text>
          </View>
        )}
        {tutor.privateTuition && (
          <View style={styles.tuitionType}>
            <Text style={styles.tuitionTypeText}>Private Tuition</Text>
          </View>
        )}
        <View style={styles.statButton}>
          <Text style={styles.statText}>Total Ratings: {tutor.totalRatings}</Text>
        </View>
        <View style={styles.statButton}>
          <Text style={styles.statText}>Total Hours: {tutor.totalHours}</Text>
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
    width: 388,
    height: 130,
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
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: 5,
  },
  tutorImageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  tutorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    top:-5,
    left: 0,
    
  },
  onlineDot: {
    position: 'absolute',
    top: -5,
    right: 3,
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
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 6,
    paddingHorizontal:10,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01004C',
    textAlign: 'left',
  },
  tutorBadge: {
    width: 16,
    height: 16,
  },
  tutorSubject: {
    fontSize: 14,
    color: '#01004C',
    marginBottom: 4,
    textAlign: 'left',
  },
  statButton: {
    backgroundColor: '#E8F4F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 0.41,
    borderColor: '#01004C',
  },
  statText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#16423C',
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
    marginTop: 5,
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
  newTutorCard: {
    backgroundColor: '#FCEFFF',
  },
});

export default SubjectTutorCard;