import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { rescheduleSession, UserSession } from '../services/sessionService';
import RescheduleAvailability from './RescheduleAvailability';
import { TimeSlot } from '../services/tutorAvailabilityService';

interface RescheduleModalProps {
  visible: boolean;
  session: UserSession | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  visible,
  session,
  onClose,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Debug session data when modal opens
  React.useEffect(() => {
    if (visible && session) {
      console.log('🔍 Reschedule modal opened for session:', {
        id: session.id,
        tutorId: session.tutorId,
        currentDate: session.sessionDate,
        currentTime: `${session.startTime} - ${session.endTime}`,
        status: session.status,
        notes: session.notes
      });
    }
  }, [visible, session]);

  const handleReschedule = async () => {
    console.log('🔄 Reschedule button pressed');
    console.log('📋 Session:', session ? {
      id: session.id,
      tutorId: session.tutorId,
      currentDate: session.sessionDate,
      currentStart: session.startTime,
      currentEnd: session.endTime
    } : 'null');
    console.log('📅 Selected date:', selectedDate);
    console.log('⏰ Selected time slot:', selectedTimeSlot);
    
    if (!session || !selectedDate || !selectedTimeSlot) {
      console.log('❌ Validation failed - missing data');
      Alert.alert('Error', 'Please select a date and time slot');
      return;
    }

    const rescheduleData = {
      sessionId: session.id,
      newSessionDate: selectedDate,
      newStartTime: selectedTimeSlot.start,
      newEndTime: selectedTimeSlot.end,
    };
    
    console.log('📤 Preparing reschedule request:', rescheduleData);

    setLoading(true);
    try {
      console.log('🚀 Calling reschedule API...');
      const result = await rescheduleSession(rescheduleData);
      console.log('📥 Reschedule API result:', result);

      if (result) {
        console.log('✅ Reschedule successful');
        Alert.alert('Success', result.message || 'Session rescheduled successfully');
        onSuccess();
        onClose();
        resetForm();
      } else {
        console.log('❌ Reschedule failed - no result returned');
        Alert.alert('Error', 'Failed to reschedule session. Please try again.');
      }
    } catch (error) {
      console.error('💥 Reschedule catch error:', error);
      Alert.alert('Error', 'Something went wrong. Please check your connection and try again.');
    } finally {
      console.log('🏁 Reschedule process completed');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Reschedule Session</Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {session && (
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>Current Session</Text>
              <Text style={styles.sessionDetails}>
                Date: {new Date(session.sessionDate).toLocaleDateString()}
              </Text>
              <Text style={styles.sessionDetails}>
                Time: {session.startTime} - {session.endTime}
              </Text>
            </View>
          )}

          <View style={styles.availabilityContainer}>
            <RescheduleAvailability
              tutorId={session?.tutorId}
              onDateSelect={(date) => {
                console.log('📅 Date selected:', date);
                setSelectedDate(date);
              }}
              onTimeSlotSelect={(slot) => {
                console.log('⏰ Time slot selected:', slot);
                setSelectedTimeSlot(slot);
              }}
            />
          </View>
          
          {selectedDate && selectedTimeSlot && (
            <View style={styles.selectionSummary}>
              <Text style={styles.summaryTitle}>Selected Slot:</Text>
              <Text style={styles.summaryText}>
                Date: {new Date(selectedDate).toLocaleDateString()}
              </Text>
              <Text style={styles.summaryText}>
                Time: {selectedTimeSlot.start} - {selectedTimeSlot.end}
              </Text>
              <Text style={styles.summaryText}>
                Price: ${selectedTimeSlot.price}
              </Text>
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.rescheduleButton,
                (!selectedDate || !selectedTimeSlot) && styles.disabledButton
              ]} 
              onPress={handleReschedule}
              disabled={loading || !selectedDate || !selectedTimeSlot}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.rescheduleText}>Reschedule</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
  },
  sessionInfo: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16423C',
    marginBottom: 8,
  },
  sessionDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  availabilityContainer: {
    marginBottom: 20,
  },
  selectionSummary: {
    backgroundColor: '#F0F8F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#16423C',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16423C',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  rescheduleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#16423C',
    alignItems: 'center',
  },
  rescheduleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default RescheduleModal;