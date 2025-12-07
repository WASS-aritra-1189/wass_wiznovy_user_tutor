import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface FooterProps {
  onSearchPress?: () => void;
  onHomePress?: () => void;
  onProfilePress?: () => void;
}

// Preload images
const ICONS = {
  home: require('../assets/home.png'),
  learning: require('../assets/learning.png'),
  download: require('../assets/download.png'),
  search: require('../assets/earchforfooter.png'),
  profile: require('../assets/profile.png'),
};

const Footer: React.FC<FooterProps> = React.memo(({ 
  onSearchPress, 
  onHomePress, 
  onProfilePress 
}) => {
  return (
    <View style={styles.footerWrapper}>
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.footerItem} onPress={onHomePress}>
          <Image source={ICONS.home} style={styles.footerIcon} />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerItem}>
          <Image source={ICONS.learning} style={styles.footerIcon} />
          <Text style={styles.footerText}>Learning</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerItem}>
          <Image source={ICONS.download} style={styles.footerIcon} />
          <Text style={styles.footerText}>Download</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerItem} onPress={onSearchPress}>
          <Image source={ICONS.search} style={styles.footerIcon} />
          <Text style={styles.footerText}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerItem} onPress={onProfilePress}>
          <Image source={ICONS.profile} style={styles.footerIcon} />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  footerWrapper: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 30,
  },
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: '#C4DAD2',
    width: '100%',
    height: 80,
    borderWidth: 1,
    borderColor: '#16423C',
    borderRadius: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerItem: {
    alignItems: 'center',
    flex: 1,
  },
  footerIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Footer;