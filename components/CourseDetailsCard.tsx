import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import CourseDatePopup from './CourseDatePopup';
import CourseReceiptPopup from './CourseReceiptPopup';

interface CourseDetailsCardProps {
  image: any;
  authorName: string;
  expertise: string;
  startDate?: string;
  endDate?: string;
  courseName?: string;
  price?: string;
  discountPrice?: string;
  subject?: string;
  language?: string;
}

const CourseDetailsCard: React.FC<CourseDetailsCardProps> = ({
  image,
  authorName,
  expertise,
  startDate,
  endDate,
  courseName,
  price,
  discountPrice,
  subject,
  language,
}) => {
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);
  
  const handleStartDatePress = () => {
    setShowDatePopup(true);
  };
  
  const handleReceiptPress = () => {
    setShowReceiptPopup(true);
  };
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Image source={image} style={styles.courseImage} resizeMode="cover" />
        <View style={styles.rightContent}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.expertise}>{expertise}</Text>
        </View>
      </View>
      <View style={styles.courseInfoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Subject:</Text>
          <Text style={styles.infoValue}>{subject || 'General'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Language:</Text>
          <Text style={styles.infoValue}>{language || 'English'}</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleStartDatePress}>
          <Image source={require('../assets/coursestartdate.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>Start Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/faqcourse.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReceiptPress}>
          <Image source={require('../assets/receipt.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>Receipt</Text>
        </TouchableOpacity>
      </View>
      
      <CourseDatePopup
        visible={showDatePopup}
        onClose={() => setShowDatePopup(false)}
        startDate={startDate}
        endDate={endDate}
      />
      
      <CourseReceiptPopup
        visible={showReceiptPopup}
        onClose={() => setShowReceiptPopup(false)}
        courseName={courseName}
        price={price}
        discountPrice={discountPrice}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  rightContent: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  expertise: {
    fontSize: 14,
    fontWeight: '500',
    color: '#01004C',
    marginBottom: 8,
    paddingTop: 20,
  },
  courseInfoContainer: {
    marginBottom: 16,
    paddingTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#01004C',
    fontWeight: '600',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    height: 32,
    backgroundColor: '#E7E7E7',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#DFDFDF',
    borderWidth: 1,
    paddingHorizontal: 8,
    gap: 4,
  },
  buttonIcon: {
    width: 12,
    height: 12,
  },
  buttonText: {
    fontSize: 12,
    color: '#01004C',
    fontWeight: '400',
  },
  separator: {
    height: 1,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
});

export default CourseDetailsCard;