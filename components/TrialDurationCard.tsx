import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface TrialDurationCardProps {
  duration: 25 | 45;
  onPress: () => void;
  selected?: boolean;
}

const TrialDurationCard: React.FC<TrialDurationCardProps> = ({
  duration,
  onPress,
  selected = false,
}) => {
  const imageSource = duration === 25 
    ? require('../assets/25img.png') 
    : require('../assets/45img.png');

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        selected && styles.selectedCard
      ]} 
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
      </View>
      <Text style={styles.durationText}>{duration} minute</Text>
      <Text style={styles.descriptionText}>
        {duration} Min Get to know the tutor, discuss the goals & Learning
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 173,
    height: 124,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingRight: 8,
    paddingBottom: 6,
    paddingLeft: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedCard: {
    borderColor: '#16423C',
    backgroundColor: '#F8F9FA',
  },
  imageContainer: {
    alignSelf: 'flex-start',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 12,
    flexShrink: 1,
  },
});

export default TrialDurationCard;