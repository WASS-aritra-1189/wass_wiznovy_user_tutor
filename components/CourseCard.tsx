import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

interface CourseCardProps {
  image: any;
  title: string;
  description: string;
  duration: string;
  language: string;
  price: string;
  totalVideos: string;
  rating: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  image,
  title,
  description,
  duration,
  language,
  price,
  totalVideos,
  rating,
}) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.courseImage} resizeMode="cover" />
      <View style={styles.rightContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Image source={require('../assets/imageforratingincoursecard.png')} style={styles.ratingIcon} resizeMode="contain" />
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/coursedurationmain.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>{duration}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/languagemain.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>{language}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/pricemain.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>{price}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/totalvideosmain.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>{totalVideos}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 140,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
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
  rightContent: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  buttonRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
  },
  button: {
    width: 90,
    height: 32,
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
  buttonIcon: {
    width: 12,
    height: 12,
  },
  ratingContainer: {
    width: 50,
    position: 'absolute',
    top: 12,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#16423C',
  },
  ratingIcon: {
    width: 12,
    height: 12,
    marginLeft: 4,
  },
  ratingText: {
    fontSize: 10,
    color: '#ffffffff',
    fontWeight: '500',
  },
  buttonText: {
    fontSize: 11,
    color: '#01004C',
    fontWeight: '500',
  },
  courseImage: {
    width: 80,
    height: 60,
    borderRadius: 4,
  },
});

export default CourseCard;