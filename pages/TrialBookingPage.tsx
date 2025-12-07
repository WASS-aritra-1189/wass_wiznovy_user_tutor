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
import TrialDurationSelector from '../components/TrialDurationSelector';
import Availability from '../components/tutordetails/Availability';

interface TrialBookingPageProps {
  navigation?: any;
  route?: any;
}

const TrialBookingPage: React.FC<TrialBookingPageProps> = ({
  navigation,
  route,
}) => {
  const tutorData = route?.params?.tutorData;
  const [selectedDuration, setSelectedDuration] = useState<25 | 45 | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const insets = useSafeAreaInsets();

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleContinue = useCallback(() => {
    if (selectedDuration && selectedDate && selectedTimeSlot) {
      navigation.navigate('TrialCheckoutPage', {
        tutorData,
        selectedDuration,
        selectedDate,
        selectedTimeSlot,
        selectedSlot,
      });
    }
  }, [selectedDuration, selectedDate, selectedTimeSlot, selectedSlot, tutorData, navigation]);

  const isFormValid = selectedDuration && selectedDate && selectedTimeSlot;

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.headerText}>Book Trial Class</Text>
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

          {/* Trial Duration Selector */}
          <View style={styles.section}>
            <TrialDurationSelector 
              onDurationSelect={setSelectedDuration}
            />
          </View>

          {/* Availability Selector */}
          <View style={styles.section}>
            <Availability 
              tutorId={tutorData?.account?.id || tutorData?.id}
              hourlyRate={tutorData?.hourlyRate}
              onDatePress={setSelectedDate}
              onTimePress={(time, slot) => {
                setSelectedTimeSlot(time);
                setSelectedSlot(slot);
              }}
            />
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              !isFormValid && styles.disabledButton
            ]} 
            onPress={handleContinue}
            disabled={!isFormValid}
          >
            <Text style={[
              styles.continueButtonText,
              !isFormValid && styles.disabledButtonText
            ]}>
              Continue
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

export default TrialBookingPage;