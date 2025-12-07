import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import SubjectTutorCard from '../components/SubjectTutorCard';
import AboutAuthor from '../components/tutordetails/AboutAuthor';
import Speciality from '../components/tutordetails/Speciality';
import Availability from '../components/tutordetails/Availability';
import ReviewSection from '../components/tutordetails/ReviewSection';
import { getTutorDetails } from '../services/TutordetailsService';

interface TutorDetailPageProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

const TutorDetailPage: React.FC<TutorDetailPageProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const tutorId = route?.params?.tutorId || route?.params?.tutor?.account?.id || route?.params?.tutor?.id;
  const fallbackTutor = route?.params?.tutor;
  const [tutorData, setTutorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchTutorDetails = async () => {
      if (tutorId) {
        try {
          const response = await getTutorDetails(tutorId);
          if (response.success) {
            const mergedData = {
              ...response.data,
              account: response.data?.account || fallbackTutor?.account
            };
            setTutorData(mergedData);
          } else {
            setTutorData(fallbackTutor);
          }
        } catch (error) {
          console.error('Error fetching tutor details:', error);
          setTutorData(fallbackTutor);
        } finally {
          setLoading(false);
        }
      } else if (fallbackTutor) {
        setTutorData(fallbackTutor);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchTutorDetails();
  }, [tutorId]);

  const handleBackPress = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  }, [navigation, onBack]);

  const handleHomePress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Profile' });
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation]);

  const handleTrialSession = useCallback(() => {
    navigation.navigate('TrialBookingPage', { tutorData });
  }, [navigation, tutorData]);

  const handleBookClass = useCallback(() => {
   
    
    if (selectedDate && selectedTime && selectedDuration) {
      
      const navigationParams = {
        tutorData, 
        selectedDate, 
        selectedTime,
        selectedDuration,
        selectedSlot,
        bookingType: 'regular'
      };
    
      navigation.navigate('PaymentPage', navigationParams);
    } else {
      
      Alert.alert('Selection Required', 'Please select date, time slot, and duration before booking.');
    }
  }, [navigation, tutorData, selectedDate, selectedTime, selectedDuration, selectedSlot]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.headerText}>Tutor Details</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Main Content Area */}
        <View style={styles.contentWrapper}>
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.contentContainer}>
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#16423C" />
                  <Text style={styles.loadingText}>Loading tutor details...</Text>
                </View>
              )}
              {!loading && tutorData && (
                <>
                  {/* Tutor Card */}
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

                  {/* About Author */}
                  <View style={styles.section}>
                    <AboutAuthor 
                      authorName={tutorData.name}
                      aboutText={tutorData.bio || 'No bio available'}
                    />
                  </View>

                  {/* Speciality */}
                  <View style={styles.section}>
                    <Speciality 
                      title="Speciality"
                      specialities={[tutorData.subject?.name || 'General']}
                    />
                  </View>

                  {/* Availability */}
                  <View style={styles.section}>
                    <Availability 
                      tutorId={tutorData.account?.id || tutorData.id}
                      hourlyRate={tutorData.hourlyRate}
                      onDatePress={(date) => {
                       
                        setSelectedDate(date);
                      }}
                      onTimePress={(time, slot) => {
                        
                        setSelectedTime(time);
                        setSelectedSlot(slot);
                      }}
                      onDurationPress={(duration) => {
                        
                        setSelectedDuration(duration);
                      }}
                    />
                  </View>

                  {/* Reviews */}
                  <View style={styles.section}>
                    <ReviewSection title="Reviews" />
                  </View>

                  {/* Review Image */}
                  <View style={styles.imageSection}>
                    <Image 
                      source={require('../assets/reviewimage.png')} 
                      style={styles.reviewImage}
                      resizeMode="contain"
                    />
                  </View>
                </>
              )}
              {!loading && !tutorData && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>Failed to load tutor details</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Static Booking Buttons */}
          <View style={styles.staticButtonContainer}>
            <TouchableOpacity style={styles.trialButton} onPress={handleTrialSession}>
              <Text style={[styles.buttonText, { color: '#16423C' }]}>Book Trial Class</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.bookButton,
                (!selectedDate || !selectedTime || !selectedDuration) && styles.disabledButton
              ]} 
              onPress={handleBookClass}
            >
              <Text style={[
                styles.buttonText, 
                { color: '#FFFFFF' },
                (!selectedDate || !selectedTime || !selectedDuration) && styles.disabledButtonText
              ]}>
                Book the Tutor
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Footer 
          onHomePress={handleHomePress}
          onProfilePress={handleProfilePress}
          onSearchPress={handleSearchPress}
        />
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
    paddingBottom: 100, // Space for the static buttons
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  trialButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#16423C',
    marginBottom: 10,
  },
  imageSection: {
    marginBottom: 20,
  },
  reviewImage: {
    width: 388,
    height: 200,
    borderRadius: 6,
  },
  // Static Button Styles
  staticButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  bookButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  disabledButtonText: {
    color: '#999999',
  },
});

export default React.memo(TutorDetailPage);