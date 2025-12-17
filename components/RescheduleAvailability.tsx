import React, { useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { getTutorAvailableSlots, TimeSlot } from '../services/tutorAvailabilityService';

interface RescheduleAvailabilityProps {
  tutorId?: string;
  onDateSelect: (date: string) => void;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
}

const RescheduleAvailability: React.FC<RescheduleAvailabilityProps> = ({
  tutorId,
  onDateSelect,
  onTimeSlotSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const generateNext7Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        fullDate: date.toISOString().split('T')[0],
        display: date.getDate().toString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }
    return dates;
  };

  const fetchAvailableSlots = async (date: string) => {
    console.log('🔍 Fetching slots for tutorId:', tutorId, 'date:', date);
    if (!tutorId) {
      console.log('⚠️ No tutorId provided to fetchAvailableSlots');
      return;
    }
    
    setLoading(true);
    const response = await getTutorAvailableSlots(tutorId, date);
    console.log('📡 Slots API response:', response);
    
    if (response) {
      console.log('✅ Found', response.slots?.length || 0, 'available slots');
      setAvailableSlots(response.slots || []);
    } else {
      console.log('❌ No slots response received');
      setAvailableSlots([]);
    }
    setLoading(false);
  };

  const handleDatePress = (date: string) => {
    console.log('📅 Date button pressed:', date);
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    onDateSelect(date);
    fetchAvailableSlots(date);
  };

  const handleTimeSlotPress = (slot: TimeSlot) => {
    console.log('⏰ Time slot pressed:', {
      start: slot.start,
      end: slot.end,
      price: slot.price,
      duration: slot.sessionDuration
    });
    setSelectedTimeSlot(slot);
    onTimeSlotSelect(slot);
  };

  const dates = generateNext7Days();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Select New Date & Time</Text>
      
      {/* Date Selection */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.dateScrollView}
      >
        {dates.map((date) => {
          const isDateSelected = selectedDate === date.fullDate;
          const dateButtonStyle = isDateSelected ? styles.selectedDateButton : null;
          const selectedTextStyle = isDateSelected ? styles.selectedText : null;
          
          return (
            <TouchableOpacity
              key={date.fullDate}
              style={[
                styles.dateButton,
                dateButtonStyle
              ]}
              onPress={() => handleDatePress(date.fullDate)}
            >
              <Text style={[
                styles.dayText,
                selectedTextStyle
              ]}>
                {date.dayName}
              </Text>
              <Text style={[
                styles.dateText,
                selectedTextStyle
              ]}>
                {date.display}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Time Slots */}
      <View style={styles.timeSlotsContainer}>
        {(() => {
          if (loading) {
            return (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#16423C" />
                <Text style={styles.loadingText}>Loading available slots...</Text>
              </View>
            );
          }
          
          if (!selectedDate) {
            return (
              <Text style={styles.selectDateText}>Please select a date to view available slots</Text>
            );
          }
          
          if (availableSlots.length === 0) {
            return (
              <Text style={styles.noSlotsText}>No available slots for this date</Text>
            );
          }
          
          return (
            <ScrollView style={styles.slotsScrollView}>
              <View style={styles.slotsGrid}>
                {availableSlots.map((slot, index) => {
                  const isSelected = selectedTimeSlot?.start === slot.start && 
                                   selectedTimeSlot?.end === slot.end;
                  const timeSlotButtonStyle = isSelected ? styles.selectedTimeSlotButton : null;
                  const textStyle = isSelected ? styles.selectedText : null;
                  
                  return (
                    <TouchableOpacity
                      key={`${slot.start}-${slot.end}-${index}`}
                      style={[
                        styles.timeSlotButton,
                        timeSlotButtonStyle
                      ]}
                      onPress={() => handleTimeSlotPress(slot)}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        textStyle
                      ]}>
                        {slot.start} - {slot.end}
                      </Text>
                      <Text style={[
                        styles.priceText,
                        textStyle
                      ]}>
                        ${slot.price}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          );
        })()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16423C',
    marginBottom: 12,
    textAlign: 'center',
  },
  dateScrollView: {
    marginBottom: 16,
  },
  dateButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F8F9FA',
    minWidth: 50,
  },
  selectedDateButton: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  dayText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  timeSlotsContainer: {
    minHeight: 120,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  slotsScrollView: {
    maxHeight: 150,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    minWidth: 80,
  },
  selectedTimeSlotButton: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  timeSlotText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  priceText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  noSlotsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    paddingVertical: 20,
  },
  selectDateText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    paddingVertical: 20,
  },
});

export default RescheduleAvailability;