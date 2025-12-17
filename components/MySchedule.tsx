import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { UserSession } from '../services/sessionService';
import { RootState, AppDispatch } from '../store/store';
import { fetchUserSessions, cancelUserSession } from '../store/sessionSlice';
import RescheduleModal from './RescheduleModal';

interface MyScheduleProps {
  onClose?: () => void;
  initialDate?: string;
  showLiveOnly?: boolean;
}

const MySchedule: React.FC<MyScheduleProps> = ({ onClose, initialDate, showLiveOnly }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, loading, cancelLoading, error, cancelResponse } = useSelector((state: RootState) => state.sessions);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || new Date().toISOString().split('T')[0]);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);

  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = -7; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0
      });
    }
    return dates;
  };

  const fetchSessions = (date: string) => {
    console.log('📅 Fetching sessions for date:', date);
    dispatch(fetchUserSessions({ limit: 20, offset: 0, date }));
  };
  
  // Filter sessions based on showLiveOnly prop
  const filteredSessions = React.useMemo(() => {
    if (!showLiveOnly) return sessions;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.sessionDate);
      const isToday = sessionDate.toDateString() === now.toDateString();
      
      if (isToday && session.status === 'SCHEDULED') {
        const [hours, minutes] = session.startTime.split(':').map(Number);
        const sessionTime = hours * 60 + minutes;
        return sessionTime <= currentTime + 30; // Show sessions starting within 30 minutes
      }
      return false;
    });
  }, [sessions, showLiveOnly]);

  useEffect(() => {
    fetchSessions(selectedDate);
  }, [selectedDate]);

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // "11:15:00" -> "11:15"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return '#16423C';
      case 'COMPLETED': return '#4CAF50';
      case 'CANCELLED': return '#F44336';
      default: return '#666666';
    }
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

  const handleRescheduleSession = (session: UserSession) => {
    setSelectedSession(session);
    setRescheduleModalVisible(true);
  };

  const handleRescheduleSuccess = () => {
    fetchSessions(selectedDate);
  };
  
  // Show success/error messages
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);
  
  // Show cancellation success with refund info
  useEffect(() => {
    if (cancelResponse) {
      let refundMessage;
      if (cancelResponse.refundEligible) {
        refundMessage = cancelResponse.refundProcessed 
          ? 'Refund has been processed.' 
          : 'You are eligible for a refund. It will be processed shortly.';
      } else {
        refundMessage = 'No refund applicable for this cancellation.';
      }
      
      Alert.alert(
        'Session Cancelled',
        `${cancelResponse.message}\n\n${refundMessage}`,
        [{ text: 'OK', onPress: () => dispatch({ type: 'sessions/clearCancelResponse' }) }]
      );
    }
  }, [cancelResponse, dispatch]);

  const renderSessionsContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      );
    }
    
    if (sessions.length > 0) {
      return (
        <ScrollView style={styles.sessionsList}>
          {filteredSessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.timeContainer}>
                  <MaterialIcons name="access-time" size={16} color="#666" />
                  <Text style={styles.timeText}>
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(session.status) }
                ]}>
                  <Text style={styles.statusText}>{session.status}</Text>
                </View>
              </View>
              
              <Text style={styles.sessionNotes}>{session.notes}</Text>
              
              <View style={styles.sessionFooter}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.durationText}>{session.duration} minutes</Text>
                  <Text style={styles.amountText}>${session.amount}</Text>
                </View>
                
                {session.status === 'SCHEDULED' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rescheduleButton]}
                      onPress={() => handleRescheduleSession(session)}
                      disabled={cancelLoading === session.id}
                    >
                      <MaterialIcons name="schedule" size={16} color="#16423C" />
                      <Text style={styles.rescheduleText}>Reschedule</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => handleCancelSession(session.id)}
                      disabled={cancelLoading === session.id}
                    >
                      {cancelLoading === session.id ? (
                        <ActivityIndicator size="small" color="#F44336" />
                      ) : (
                        <>
                          <MaterialIcons name="cancel" size={16} color="#F44336" />
                          <Text style={styles.cancelText}>Cancel</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="event-busy" size={48} color="#CCCCCC" />
        <Text style={styles.emptyText}>No sessions scheduled for this date</Text>
      </View>
    );
  };

  const calendarDates = generateCalendarDates();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Schedule</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#16423C" />
          </TouchableOpacity>
        )}
      </View>

      {/* Calendar */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.calendarContainer}
        contentContainerStyle={styles.calendarContent}
      >
        {calendarDates.map((dateItem) => (
          <TouchableOpacity
            key={dateItem.date}
            style={[
              styles.dateButton,
              selectedDate === dateItem.date && styles.selectedDateButton,
              dateItem.isToday && styles.todayButton
            ]}
            onPress={() => setSelectedDate(dateItem.date)}
          >
            <Text style={[
              styles.weekdayText,
              selectedDate === dateItem.date && styles.selectedText
            ]}>
              {dateItem.weekday}
            </Text>
            <Text style={[
              styles.dayText,
              selectedDate === dateItem.date && styles.selectedText
            ]}>
              {dateItem.day}
            </Text>
            <Text style={[
              styles.monthText,
              selectedDate === dateItem.date && styles.selectedText
            ]}>
              {dateItem.month}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sessions List */}
      <View style={styles.sessionsContainer}>
        <Text style={styles.sessionsTitle}>
          Sessions for {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>

        {renderSessionsContent()}
      </View>
      
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
  },
  closeButton: {
    padding: 4,
  },
  calendarContainer: {
    maxHeight: 100,
  },
  calendarContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dateButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    minWidth: 60,
  },
  selectedDateButton: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  todayButton: {
    borderColor: '#16423C',
    borderWidth: 2,
  },
  weekdayText: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '500',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 2,
  },
  monthText: {
    fontSize: 10,
    color: '#666666',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  sessionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sessionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16423C',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666666',
  },
  sessionsList: {
    flex: 1,
  },
  sessionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sessionNotes: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  sessionFooter: {
    flexDirection: 'column',
    gap: 12,
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#666666',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16423C',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  rescheduleButton: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#16423C',
  },
  cancelButton: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  rescheduleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16423C',
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
  },
});

export default MySchedule;