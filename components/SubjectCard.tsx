import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SubjectCardProps {
  id: string;
  name: string;
  image?: string;
  onPress?: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  id,
  name,
  image,
  onPress,
}) => {
  const getImageSource = () => {
    if (image && image.trim() !== '') {
      return { uri: image };
    }
    return require('../assets/subjects.png');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#16423C', '#31BD80']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.imageContainer}>
          <Image source={getImageSource()} style={styles.image} resizeMode="cover" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>{name}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 160,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 4,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default SubjectCard;