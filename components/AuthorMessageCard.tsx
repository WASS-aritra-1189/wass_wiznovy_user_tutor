import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

interface AuthorMessageCardProps {
  message?: string;
}

const AuthorMessageCard: React.FC<AuthorMessageCardProps> = ({ message }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/coursefinalimage.png')} style={styles.courseImage} resizeMode="cover" />
        <Image source={require('../assets/video.png')} style={styles.videoIcon} resizeMode="contain" />
      </View>
      <Text style={styles.title}>Author Message about the course</Text>
      <Text style={styles.description}>
        {message || 'Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.'}
      </Text>
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
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderRadius: 6,
  },
  videoIcon: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#01004C',
    lineHeight: 16,
  },
});

export default AuthorMessageCard;