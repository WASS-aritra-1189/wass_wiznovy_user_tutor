import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VideoPlayerCard: React.FC = () => {
  const navigation = useNavigation();
  
  const handlePlayPress = () => {
    console.log('Play button pressed!');
    try {
      console.log('Attempting to navigate to YoutubeTypePlayer');
      (navigation as any).navigate('YoutubeTypePlayer');
      console.log('Navigation successful');
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/videoplay.png')}
        style={styles.videoPlayImage}
        resizeMode="cover"
      />
      <TouchableOpacity 
        style={styles.playButtonContainer}
        activeOpacity={0.8}
        onPress={handlePlayPress}
      >
        <Image
          source={require('../assets/video.png')}
          style={styles.playButton}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 4,
    marginVertical: 8,
  },
  videoPlayImage: {
    width: '100%',
    height: '100%',
  },
  playButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  playButton: {
    width: 50,
    height: 50,
  },
});

export default VideoPlayerCard;