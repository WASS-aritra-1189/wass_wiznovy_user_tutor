import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface SpecialityProps {
  title?: string;
  specialities?: string[];
  onSpecialityPress?: (speciality: string) => void;
}

const Speciality: React.FC<SpecialityProps> = ({ 
  title = "Speciality", 
  specialities = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'],
  onSpecialityPress 
}) => {
  const [selectedSpeciality, setSelectedSpeciality] = useState<string | null>(null);

  const handleSpecialityPress = (speciality: string) => {
    setSelectedSpeciality(speciality);
    onSpecialityPress?.(speciality);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.specialitiesContainer}
      >
        {specialities.map((speciality) => (
          <TouchableOpacity
            key={speciality}
            style={[
              styles.specialityButton,
              selectedSpeciality === speciality && styles.specialityButtonSelected
            ]}
            onPress={() => handleSpecialityPress(speciality)}
          >
            <Text style={[
              styles.specialityText,
              selectedSpeciality === speciality && styles.specialityTextSelected
            ]}>
              {speciality}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 388,
    height: 103,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  specialitiesContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  specialityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F8F8F8',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialityButtonSelected: {
    backgroundColor: '#01004C',
    borderColor: '#01004C',
  },
  specialityText: {
    fontSize: 12,
    color: '#01004C',
    fontWeight: '500',
  },
  specialityTextSelected: {
    color: '#FFFFFF',
  },
});

export default Speciality;