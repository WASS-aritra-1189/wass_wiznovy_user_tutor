import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface DateTimeSelectorProps {
  onDateSelect: (date: string) => void;
  onTimeSlotSelect: (timeSlot: string) => void;
  onDurationSelect?: (duration: 25 | 45) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  onDateSelect,
  onTimeSlotSelect,
  onDurationSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<25 | 45 | null>(null);

  const generateNext7Days = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      dates.push({
        fullDate: date.toISOString().split('T')[0],
        display: `${dayName} ${dayNumber}`,
        month: monthName,
      });
    }
    return dates;
  };

  const timeSlots = [
    { id: 'morning', label: 'Morning', time: '8am - 12pm' },
    { id: 'afternoon', label: 'Afternoon', time: '12pm - 5pm' },
    { id: 'evening', label: 'Evening', time: '5pm - 7pm' },
    { id: 'night', label: 'Night', time: '7pm - 9pm' },
  ];

  const dates = generateNext7Days();

  const handleDatePress = (date: string) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const handleTimeSlotPress = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    onTimeSlotSelect(timeSlot);
  };

  const handleDurationPress = (duration: 25 | 45) => {
    setSelectedDuration(duration);
    onDurationSelect?.(duration);
  };

  return (
    <View style={styles.container}>
      {/* Duration Selection */}
      <View style={styles.durationSection}>
        <TouchableOpacity
          style={[
            styles.durationButton,
            selectedDuration === 25 && styles.selectedDurationButton
          ]}
          onPress={() => handleDurationPress(25)}
        >
          <Text style={[
            styles.durationText,
            selectedDuration === 25 && styles.selectedDurationText
          ]}>25 min</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.durationButton,
            selectedDuration === 45 && styles.selectedDurationButton
          ]}
          onPress={() => handleDurationPress(45)}
        >
          <Text style={[
            styles.durationText,
            selectedDuration === 45 && styles.selectedDurationText
          ]}>45 min</Text>
        </TouchableOpacity>
      </View>

      {/* Date Selection Section */}
      <View style={styles.dateSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.dateScrollView}
          contentContainerStyle={styles.dateScrollContent}
        >
          {dates.map((date) => (
            <TouchableOpacity
              key={date.fullDate}
              style={[
                styles.dateButton,
                selectedDate === date.fullDate && styles.selectedDateButton
              ]}
              onPress={() => handleDatePress(date.fullDate)}
            >
              <Text style={[
                styles.dateText,
                selectedDate === date.fullDate && styles.selectedDateText
              ]}>
                {date.display}
              </Text>
              <Text style={[
                styles.monthText,
                selectedDate === date.fullDate && styles.selectedMonthText
              ]}>
                {date.month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Time Slot Selection Section */}
      <View style={styles.timeSection}>
        <View style={styles.timeSlotRow}>
          {timeSlots.slice(0, 2).map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeSlotButton,
                selectedTimeSlot === slot.id && styles.selectedTimeSlotButton
              ]}
              onPress={() => handleTimeSlotPress(slot.id)}
            >
              <Text style={[
                styles.timeSlotLabel,
                selectedTimeSlot === slot.id && styles.selectedTimeSlotLabel
              ]}>
                {slot.label}
              </Text>
              <Text style={[
                styles.timeSlotTime,
                selectedTimeSlot === slot.id && styles.selectedTimeSlotTime
              ]}>
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.timeSlotRow}>
          {timeSlots.slice(2, 4).map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeSlotButton,
                selectedTimeSlot === slot.id && styles.selectedTimeSlotButton
              ]}
              onPress={() => handleTimeSlotPress(slot.id)}
            >
              <Text style={[
                styles.timeSlotLabel,
                selectedTimeSlot === slot.id && styles.selectedTimeSlotLabel
              ]}>
                {slot.label}
              </Text>
              <Text style={[
                styles.timeSlotTime,
                selectedTimeSlot === slot.id && styles.selectedTimeSlotTime
              ]}>
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 388,
    height: 344,
    borderWidth: 1,
    borderColor: '#01004C',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  durationSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectedDurationButton: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  selectedDurationText: {
    color: '#FFFFFF',
  },
  dateSection: {
    height: 80,
    paddingTop: 12,
  },
  dateScrollView: {
    paddingHorizontal: 16,
  },
  dateScrollContent: {
    alignItems: 'center',
  },
  dateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    height: 60,
  },
  selectedDateButton: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  monthText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  selectedMonthText: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  timeSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  timeSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeSlotButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    height: 60,
  },
  selectedTimeSlotButton: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  timeSlotLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  selectedTimeSlotLabel: {
    color: '#FFFFFF',
  },
  timeSlotTime: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  selectedTimeSlotTime: {
    color: '#FFFFFF',
  },
});

export default DateTimeSelector;