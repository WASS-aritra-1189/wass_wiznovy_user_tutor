import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScheduleCard from '../components/schedule/ScheduleCard';
import RecordedSessionsPage from '../pages/RecordedSessionsPage';

interface ErrorClassProps {
  visible: boolean;
  onClose: () => void;
  status?: 'starts_soon' | 'ended';
  schedule?: any;
  timeRemaining?: string;
  scheduleImage?: any;
}

const ErrorClass: React.FC<ErrorClassProps> = ({ 
  visible, 
  onClose, 
  status = 'starts_soon',
  schedule,
  timeRemaining,
  scheduleImage
}) => {
  const [showRecordedSessions, setShowRecordedSessions] = useState(false);
  
  console.log('ErrorClass render - visible:', visible, 'showRecordedSessions:', showRecordedSessions, 'status:', status);
  
  if (!visible) return null;
  
  if (showRecordedSessions) {
    console.log('Rendering RecordedSessionsPage');
    return (
      <RecordedSessionsPage
        visible={true}
        onClose={() => {
          console.log('Closing RecordedSessionsPage');
          setShowRecordedSessions(false);
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Back to Schedule</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Schedule Card at Top */}
          {schedule && (
            <View style={styles.scheduleCardContainer}>
              <ScheduleCard
                scheduleImage={scheduleImage}
                facultyName={schedule.facultyName}
                className={schedule.className}
                price={schedule.price}
                timing={schedule.timing}
                classDate={schedule.date}
                onJoinCall={() => {}} // Empty function since we're already on this page
              />
            </View>
          )}

          <View style={styles.content}>
             <View style={styles.subcontainer}>
            <Image 
              source={require('../assets/error.png')} 
              style={styles.errorImage}
              resizeMode="contain"
            />
            
            {/* Warning Button with Icon */}
            <View style={styles.warningButton}>
              <MaterialIcons 
                name="warning" 
                size={18} 
                color="#991B1B" 
                style={styles.warningIcon}
              />
              <Text style={styles.warningText}>
                {status === 'starts_soon' ? 'Starts Soon' : 'Ended'}
              </Text>
            </View>
            
            {/* Time Remaining for Future Classes */}
            {status === 'starts_soon' && timeRemaining && (
              <View style={styles.timeRemainingContainer}>
                <Text style={styles.timeRemainingLabel}>Class starts in:</Text>
                <Text style={styles.timeRemainingText}>{timeRemaining}</Text>
              </View>
            )}

            <Text style={styles.messageText}>
              {status === 'starts_soon' 
                ? 'This class hasn\'t started yet. Please check the schedule and come back when it\'s time.'
                : 'This class has already ended. Please check your schedule for upcoming classes.'}
            </Text>
            
            {/* View Resources Button for Ended Classes */}
            {status === 'ended' && (
              <TouchableOpacity 
                style={styles.resourcesButton}
                onPress={() => {
                  console.log('Button pressed, setting showRecordedSessions to true');
                  setShowRecordedSessions(true);
                }}
              >
                <Text style={styles.resourcesButtonText}>View Class Resources</Text>
              </TouchableOpacity>
            )}
            
           
              
           
            </View>

            {/* Additional Info */}
            <View style={styles.additionalInfo}>
              <Text style={styles.infoTitle}>
                {status === 'starts_soon' ? 'What to do next?' : 'Missed this class?'}
              </Text>
              <Text style={styles.infoText}>
                {status === 'starts_soon' 
                  ? '• Make sure you have a stable internet connection\n• Test your audio and video settings\n• Join 5 minutes before the class starts\n• Have your materials ready'
                  : '• Check for class recordings in your dashboard\n• Review the study materials provided\n• Contact the faculty for any questions\n• Schedule a one-on-one session if needed'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  subcontainer:{
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    borderColor: '#020000ff',
    borderWidth: 1,
    paddingBottom: 40,
    backgroundColor: '#ffffffff',
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  scheduleCardContainer: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 40,
  },
  errorImage: {
    width: 182.6,
    height: 118.5,
    marginBottom: 40,
    marginTop: 40,
  },
  warningButton: {
    backgroundColor: '#f4e2e2ff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIcon: {
    marginRight: 8,
  },
  warningText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '600',
  },
  timeRemainingContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#100d00ff',
  },
  timeRemainingLabel: {
    fontSize: 14,
    color: '#000000ff',
    marginBottom: 8,
    fontWeight: '500',
  },
  timeRemainingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#991B1B',
    fontFamily: 'monospace',
  },
  messageText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  additionalInfo: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#16423C',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16423C',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  resourcesButton: {
    backgroundColor: '#16423C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  resourcesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ErrorClass;