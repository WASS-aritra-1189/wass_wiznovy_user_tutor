import React, { useCallback } from 'react';
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
import TrialCheckout from '../components/TrialCheckout';

interface TrialCheckoutPageProps {
  navigation?: any;
  route?: any;
}

const TrialCheckoutPage: React.FC<TrialCheckoutPageProps> = ({
  navigation,
  route,
}) => {
  const { tutorData, selectedDuration, selectedDate, selectedTimeSlot, selectedSlot } = route?.params || {};
  const insets = useSafeAreaInsets();

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleProceedToPay = useCallback(() => {
    navigation.navigate('PaymentPage', {
      tutorData,
      selectedDate,
      selectedTime: selectedTimeSlot,
      selectedDuration,
      selectedSlot,
      bookingType: 'trial',
    });
  }, [navigation, tutorData, selectedDate, selectedTimeSlot, selectedDuration, selectedSlot]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.headerText}>Trial Checkout</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content */}
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

        {/* Checkout Component */}
        <TrialCheckout
          tutorData={tutorData}
          selectedDuration={selectedDuration}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onProceedToPay={handleProceedToPay}
        />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default TrialCheckoutPage;