import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import ScheduleCard from '../components/schedule/ScheduleCard';
import Calendar from '../components/global/calender';
import ErrorClass from '../components/ErrorClass';
import RescheduleModal from '../components/RescheduleModal';
import { RootState, AppDispatch } from '../store/store';
import { fetchUserSessions, cancelUserSession } from '../store/sessionSlice';
import { UserSession } from '../services/sessionService';

interface MyScheduledProps {
  navigation?: any;
  onBack?: () => void;
}

const MyScheduled: React.FC<MyScheduledProps> = ({ navigation, onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, loading, cancelLoading, error } = useSelector((state: RootState) => state.sessions);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showError, setShowError] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'starts_soon' | 'ended'>('starts_soon');
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const insets = useSafeAreaInsets();

  // Static image for all schedule cards
  const staticScheduleImage = require('../assets/chedule.png');

  const fetchSessions = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    dispatch(fetchUserSessions({ limit: 20, offset: 0, date: dateString }));
  };

  useEffect(() => {
    fetchSessions(selectedDate);
  }, [selectedDate]);

  const handleRescheduleSession = (session: UserSession) => {
    setSelectedSession(session);
    setRescheduleModalVisible(true);
  };

  const handleCancelSession = (sessionId: string) => {
    Alert.alert(
      'Cancel Session',
      'Are you sure you want to cancel this session?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            dispatch(cancelUserSession(sessionId));
          },
        },
      ]
    );
  };

  const handleRescheduleSuccess = () => {
    fetchSessions(selectedDate);
  };

  // Transform API sessions to schedule format
  const filteredSchedules = sessions.map(session => {
    const sessionDate = new Date(session.sessionDate);
    const startTime = new Date(`${session.sessionDate}T${session.startTime}`);
    const endTime = new Date(`${session.sessionDate}T${session.endTime}`);
    
    return {
      id: session.id,
      date: sessionDate,
      facultyName: session.tutor?.name || 'Tutor',
      className: session.notes || 'Session',
      price: `$${session.amount}`,
      timing: `${session.startTime.substring(0, 5)} - ${session.endTime.substring(0, 5)}`,
      startTime,
      endTime,
      status: session.status,
      session: session // Pass the full session object
    };
  });

  // Calculate time remaining for future classes
  const calculateTimeRemaining = (startTime: Date) => {
    const now = new Date();
    const difference = startTime.getTime() - now.getTime();
    
    if (difference <= 0) return '';

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  const handleJoinCall = (scheduleId: string) => {
    const schedule = filteredSchedules.find(s => s.id === scheduleId);
    console.log('Joining call for:', schedule?.className);
    
    if (schedule) {
      setSelectedSchedule(schedule);
      
      // Determine status based on current time and schedule timing
      const now = new Date();
      if (now < schedule.startTime) {
        setErrorStatus('starts_soon');
        // Calculate initial time remaining
        setTimeRemaining(calculateTimeRemaining(schedule.startTime));
      } else if (now > schedule.endTime) {
        setErrorStatus('ended');
        setTimeRemaining('');
      } else {
        // If current time is between start and end time, show as active (you can modify this)
        setErrorStatus('starts_soon');
        setTimeRemaining('Class is in progress');
      }
      
      setShowError(true);
    }
  };

  // Update time remaining every second for future classes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showError && selectedSchedule && errorStatus === 'starts_soon') {
      interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(selectedSchedule.startTime));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showError, selectedSchedule, errorStatus]);

  // Get section title based on selected date
  const getSectionTitle = () => {
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    return isToday ? "Today's Schedule" : `Schedule for ${selectedDate.toLocaleDateString()}`;
  };

  // Render schedule content based on loading state and data
  const renderScheduleContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      );
    }

    if (filteredSchedules.length > 0) {
      return filteredSchedules.map((schedule) => (
        <ScheduleCard
          key={schedule.id}
          scheduleImage={staticScheduleImage}
          facultyName={schedule.facultyName}
          className={schedule.className}
          price={schedule.price}
          timing={schedule.timing}
          classDate={schedule.date}
          status={schedule.status}
          session={schedule.session}
          onJoinCall={() => handleJoinCall(schedule.id)}
          onReschedule={() => handleRescheduleSession(schedule.session)}
          onCancel={() => handleCancelSession(schedule.id)}
          cancelLoading={cancelLoading === schedule.id}
        />
      ));
    }

    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="event-busy" size={48} color="#CCCCCC" />
        <Text style={styles.emptyText}>No sessions scheduled for this date</Text>
      </View>
    );
  };

  // If error page is shown, render only the ErrorClass component
  if (showError && selectedSchedule) {
    return (
      <ErrorClass
        visible={showError}
        onClose={() => setShowError(false)}
        status={errorStatus}
        schedule={selectedSchedule}
        timeRemaining={timeRemaining}
        scheduleImage={staticScheduleImage}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={onBack || (() => navigation?.goBack())} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>My Scheduled</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Calendar Section */}
          <View style={styles.calendarContainer}>
            <Calendar
              onDateSelect={setSelectedDate}
            />
          </View>

          {/* Schedule Cards Section */}
          <View style={styles.schedulesContainer}>
            <Text style={styles.sectionTitle}>
              {getSectionTitle()}
            </Text>
            
            {renderScheduleContent()}

          </View>
        </ScrollView>
        
        <RescheduleModal
          visible={rescheduleModalVisible}
          session={selectedSession}
          onClose={() => setRescheduleModalVisible(false)}
          onSuccess={handleRescheduleSuccess}
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
    backgroundColor: '#16423C',
    borderRadius: 18,
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
    paddingBottom: 80,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  schedulesContainer: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  noScheduleContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noScheduleText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});

export default MyScheduled;