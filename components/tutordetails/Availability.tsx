import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getTutorAvailableSlots, TimeSlot } from '../../services/tutorAvailabilityService';

interface AvailabilityProps {
  onDayPress?: (day: string) => void;
  onTimePress?: (time: string, slot?: TimeSlot) => void;
  onDatePress?: (date: string) => void;
  onDurationPress?: (duration: number) => void;
  tutorId?: string;
  hourlyRate?: number;
}

const Availability: React.FC<AvailabilityProps> = ({ onDayPress, onTimePress, onDatePress, onDurationPress, tutorId, hourlyRate }) => {
  
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  
  
  const fetchAvailableSlots = async (date: string) => {
    
    if (!tutorId) {
      
      return;
    }
    
    setIsLoading(true);
    
    const response = await getTutorAvailableSlots(tutorId, date);
    
    if (response) {
      
      setAvailableSlots(response.slots);
    } else {
      
      setAvailableSlots([]);
    }
    setIsLoading(false);
  };
  
  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        display: `${date.getDate()}/${date.getMonth() + 1}`,
        full: date.toISOString().split('T')[0]
      });
    }
    return dates;
  };
  
  const dates = generateDates();

  const renderEmptyState = () => {
    if (selectedDate) {
      return <Text style={styles.noSlotsText}>No available slots for this date</Text>;
    }
    return <Text style={styles.selectDateText}>Please select a date to view available slots</Text>;
  };

  const renderTimeSlots = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#01004C" />
          <Text style={styles.loadingText}>Loading slots...</Text>
        </View>
      );
    }
    
    if (availableSlots.length > 0) {
      return (
        <View style={styles.slotsGrid}>
          {availableSlots.map((slot) => {
            const timeDisplay = `${slot.start}-${slot.end}`;
            const isTimeSelected = selectedTime === timeDisplay;
            return (
              <TouchableOpacity
                key={`${slot.start}-${slot.end}-${slot.price}`}
                style={[styles.timeButton, isTimeSelected && styles.selectedButton]}
                onPress={() => {
                
                  setSelectedTime(timeDisplay);
                  setSelectedSlot(slot);
                  setSelectedDuration(slot.sessionDuration);
                  
                  onTimePress?.(timeDisplay, slot);
                  
                  onDurationPress?.(slot.sessionDuration);
                }}
              >
                <Text style={[styles.timeText, isTimeSelected && styles.selectedText]}>
                  {timeDisplay}
                </Text>
                <Text style={[styles.priceText, isTimeSelected && styles.selectedText]}>
                  ${slot.price}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    
    return renderEmptyState();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Availability</Text>
      
      {/* Date Selection */}
      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.dateScrollView}
        contentContainerStyle={styles.dateContainer}
      >
        {dates.map((date) => {
          const isSelected = selectedDate === date.full;
          return (
            <TouchableOpacity
              key={date.full}
              style={[styles.dateButton, isSelected && styles.selectedButton]}
              onPress={() => {
                
                setSelectedDate(date.full);
                setSelectedTime(null);
                setSelectedSlot(null);
                setSelectedDuration(null);
                
                onDatePress?.(date.full);
                
                fetchAvailableSlots(date.full);
              }}
            >
              <Text style={[styles.dateText, isSelected && styles.selectedText]}>{date.display}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Time Slots */}
      <Text style={styles.sectionTitle}>Select Time</Text>
      <View style={styles.timeContainer}>
        {renderTimeSlots()}
      </View>
      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 388,
    minHeight: 280,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 12,
  },

  timeContainer: {
    flex: 1,
    marginTop: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeButton: {
    minWidth: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 15,
    color: '#01004C',
    fontWeight: '600',
  },
  selectedButton: {
    backgroundColor: '#01004C',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 4,
  },
  dateScrollView: {
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dateButton: {
    width: 80,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F8F8F8',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 15,
    color: '#01004C',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginVertical: 8,
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
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 6,
  },
  priceText: {
    fontSize: 15,
    color: '#666',
    marginTop: 2,
    fontWeight: '500',
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
 
  durationText: {
    fontSize: 13,
    color: '#01004C',
    fontWeight: '600',
  },
  durationPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontWeight: '500',
  },
});

export default Availability;