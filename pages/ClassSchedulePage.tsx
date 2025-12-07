import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScheduleCard from '../components/schedule/ScheduleCard';
import ErrorClass from '../components/ErrorClass';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

interface ClassSchedulePageProps {
  onBack: () => void;
}

const ClassSchedulePage: React.FC<ClassSchedulePageProps> = ({ onBack }) => {
  const [showError, setShowError] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'starts_soon' | 'ended'>('starts_soon');

  const scheduleData = [
    {
      id: 1,
      title: 'Mathematics Class',
      instructor: 'John Smith',
      time: '10:00 AM - 11:00 AM',
      date: 'Today',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'English Literature',
      instructor: 'Sarah Johnson',
      time: '2:00 PM - 3:00 PM',
      date: 'Today',
      status: 'live',
    },
    {
      id: 3,
      title: 'Physics Lab',
      instructor: 'Mike Wilson',
      time: '4:00 PM - 5:00 PM',
      date: 'Tomorrow',
      status: 'scheduled',
    },
  ];

  const handleJoinClass = (classId: number) => {
    // Simulate different error states
    const status = Math.random() > 0.5 ? 'starts_soon' : 'ended';
    setErrorStatus(status);
    setShowError(true);
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Schedule</Text>
        </View>

        {/* Schedule List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {scheduleData.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              scheduleImage={require('../assets/default-avatar.png')}
              facultyName={schedule.instructor}
              className={schedule.title}
              price="Free"
              timing={schedule.time}
              classDate={new Date()}
              onJoinCall={() => handleJoinClass(schedule.id)}
            />
          ))}
        </ScrollView>

        {/* Error Modal */}
        <ErrorClass
          visible={showError}
          onClose={() => setShowError(false)}
          status={errorStatus}
        />
      </SafeAreaView>
    </SafeAreaWrapper>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#16423C',
  },
  backButton: {
    marginRight: 20,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginRight: 60, // Compensate for back button
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default ClassSchedulePage;