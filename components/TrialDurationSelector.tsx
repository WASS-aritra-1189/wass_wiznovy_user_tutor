import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TrialDurationCard from './TrialDurationCard';

interface TrialDurationSelectorProps {
  onDurationSelect: (duration: 25 | 45) => void;
}

const TrialDurationSelector: React.FC<TrialDurationSelectorProps> = ({
  onDurationSelect,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<25 | 45 | null>(null);

  const handleDurationPress = (duration: 25 | 45) => {
    setSelectedDuration(duration);
    onDurationSelect(duration);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Which trial duration would you prefer?</Text>
      <View style={styles.cardsContainer}>
        <TrialDurationCard
          duration={25}
          onPress={() => handleDurationPress(25)}
          selected={selectedDuration === 25}
        />
        <TrialDurationCard
          duration={45}
          onPress={() => handleDurationPress(45)}
          selected={selectedDuration === 45}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 388,
    height: 210,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#01004C',
    borderRadius: 6,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default TrialDurationSelector;