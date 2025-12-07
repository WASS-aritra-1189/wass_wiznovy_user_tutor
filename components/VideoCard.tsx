import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

interface VideoCardProps {
  title: string;
  description: string;
  duration: string;
  chapter: string;
  videoNumber: string;
  isWatched: boolean;
  onPress?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  description,
  duration,
  chapter,
  videoNumber,
  isWatched,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={1}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isWatched ? 'Watched' : 'New'}
        </Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/videocourse.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.rightContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/time.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>{duration}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/chapter.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>{chapter}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/videonumber.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>{videoNumber}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
    height: 165,
  },
  statusContainer: {
    position: 'absolute',
    top: 12,
    right: 0,
    zIndex: 1,
    backgroundColor: '#16423C',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '500',
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  rightContent: {
    flex: 1,
    paddingLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
    paddingBottom: 20,
  },
  separator: {
    position: 'absolute',
    bottom: 57,
    left: 16,
    right: 16,
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    borderStyle: 'dotted',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: 118,
    height: 25,
    backgroundColor: '#E7E7E7',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  buttonIcon: {
    width: 10,
    height: 10,
  },
  buttonText: {
    fontSize: 10,
    color: '#01004C',
    fontWeight: '500',
    textAlign: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default VideoCard;