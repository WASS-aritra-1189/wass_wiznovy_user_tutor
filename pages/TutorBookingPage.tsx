import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import SubjectTutorCard from '../components/SubjectTutorCard';

interface TutorBookingPageProps {
  navigation?: any;
  route?: any;
}

const TutorBookingPage: React.FC<TutorBookingPageProps> = ({
  navigation,
  route,
}) => {
  const { tutorData, selectedDate, selectedTime } = route?.params || {};
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const insets = useSafeAreaInsets();

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleContinue = useCallback(() => {
    if (selectedDuration) {
      navigation.navigate('PaymentPage', {
        tutorData,
        selectedDate,
        selectedTime,
        selectedDuration,
        bookingType: 'regular',
      });
    }
  }, [selectedDuration, tutorData, selectedDate, selectedTime, navigation]);

  const durations = [
    { value: 30, label: '30 minutes', price: tutorData?.hourlyRate ? (tutorData.hourlyRate * 0.5) : 25 },
    { value: 60, label: '1 hour', price: tutorData?.hourlyRate || 50 },
    { value: 90, label: '1.5 hours', price: tutorData?.hourlyRate ? (tutorData.hourlyRate * 1.5) : 75 },
    { value: 120, label: '2 hours', price: tutorData?.hourlyRate ? (tutorData.hourlyRate * 2) : 100 },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.headerText}>Book Tutor</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content */}
      <View style={styles.contentWrapper}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Tutor Card */}
          {tutorData && (
            <View style={styles.section}>
              <SubjectTutorCard 
                tutor={{
                  id: tutorData.id,
                  name: tutorData.name,
                  subject: tutorData.subject?.name || 'General',
                  rating: Number.parseFloat(tutorData.averageRating) || 0,
                  sessions: `$${tutorData.hourlyRate}/hr`,
                  totalRatings: tutorData.totalRatings?.toString() || '0',
                  totalHours: '0',
                  groupTuition: true,
                  privateTuition: true,
                  image: tutorData.profileImage,
                }} 
                onPress={() => {}} 
              />
            </View>
          )}

          {/* Selected Date & Time */}
          <View style={styles.selectionCard}>
            <Text style={styles.selectionTitle}>Selected Schedule</Text>
            <View style={styles.selectionRow}>
              <MaterialIcons name="calendar-today" size={20} color="#16423C" />
              <Text style={styles.selectionText}>{formatDate(selectedDate)}</Text>
            </View>
            <View style={styles.selectionRow}>
              <MaterialIcons name="access-time" size={20} color="#16423C" />
              <Text style={styles.selectionText}>{selectedTime}</Text>
            </View>
          </View>

          {/* Duration Selection */}
          <View style={styles.durationCard}>
            <Text style={styles.durationTitle}>Select Duration</Text>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration.value}
                style={[
                  styles.durationOption,
                  selectedDuration === duration.value && styles.selectedDuration
                ]}
                onPress={() => setSelectedDuration(duration.value)}
              >
                <View style={styles.durationInfo}>
                  <Text style={[
                    styles.durationLabel,
                    selectedDuration === duration.value && styles.selectedText
                  ]}>
                    {duration.label}
                  </Text>
                  <Text style={[
                    styles.durationPrice,
                    selectedDuration === duration.value && styles.selectedText
                  ]}>
                    ${duration.price}
                  </Text>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedDuration === duration.value && styles.radioButtonSelected
                ]}>
                  {selectedDuration === duration.value && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              !selectedDuration && styles.disabledButton
            ]} 
            onPress={handleContinue}
            disabled={!selectedDuration}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedDuration && styles.disabledButtonText
            ]}>
              Continue to Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#16423C',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 0,
    paddingRight: 4,
  },
  headerText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 32,
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 120,
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  selectionCard: {
    width: 388,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 12,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectionText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
  },
  durationCard: {
    width: 388,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  durationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 16,
  },
  durationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
  },
  selectedDuration: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  durationInfo: {
    flex: 1,
  },
  durationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  durationPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginTop: 2,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FFFFFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999999',
  },
});

export default TutorBookingPage;