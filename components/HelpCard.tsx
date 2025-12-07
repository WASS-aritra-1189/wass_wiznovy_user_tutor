import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface HelpCardProps {
  navigation?: any;
}

const HelpCard: React.FC<HelpCardProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/help2.png')} style={[styles.helpImage, { top: 20, left: -10, zIndex: 1 }]} />
        <Image source={require('../assets/help3.png')} style={[styles.helpImage, { top: 20, right: -10, zIndex: 2 }]} />
        <View style={styles.help1Container}>
          <Image source={require('../assets/help1.png')} style={styles.help1Image} />
        </View>
      </View>
      
      <Text style={styles.title}>Still have questions?</Text>
      
      <Text style={styles.description}>
        Can't find the answer you're looking for? Please chat to our friendly team.
      </Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation?.navigate('HelpForm')}
      >
        <Text style={styles.buttonText}>Get in touch</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
  },
  imageContainer: {
    width: 120,
    height: 80,
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  helpImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
  },
  help1Container: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F9FAFB',
    position: 'absolute',
    top: 8,
    left: 28,
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  help1Image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#16423C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HelpCard;