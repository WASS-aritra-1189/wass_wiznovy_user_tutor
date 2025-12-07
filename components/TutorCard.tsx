import React from 'react';
import {Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface TutorCardProps {
  image: string;
  title: string;
  expertCount: string;
  onPress?: () => void;
}

const TutorCard: React.FC<TutorCardProps> = ({
  image,
  title,
  expertCount,
  onPress,
}) => {
  // Handle image source - if it's a string and not empty, use URI, otherwise use as local asset
  const getImageSource = () => {
    if (typeof image === 'string' && image.trim() !== '') {
      return { uri: image };
    } else if (typeof image === 'number') {
      return image; // Local asset
    } else {
      return require('../assets/subjects.png'); // Default fallback
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={getImageSource()} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{title || 'Unknown'}</Text>
      <Text style={styles.expertText}>({expertCount || '0'} expert)</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 124,
    height: 176,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C5C5C5',
    paddingTop: 9,
    paddingRight: 11,
    paddingBottom: 9,
    paddingLeft: 11,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '700',
    color: '#01004C',
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 12,
    letterSpacing: 0,
  },
  expertText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default TutorCard;