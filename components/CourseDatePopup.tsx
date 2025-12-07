import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CourseDatePopupProps {
  visible: boolean;
  onClose: () => void;
  startDate?: string;
  endDate?: string;
}

const CourseDatePopup: React.FC<CourseDatePopupProps> = ({
  visible,
  onClose,
  startDate,
  endDate,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
    };
  };

  const startDateFormatted = startDate ? formatDate(startDate) : null;
  const endDateFormatted = endDate ? formatDate(endDate) : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#666666" />
          </TouchableOpacity>
          
          <View style={styles.header}>
            <MaterialIcons name="event" size={32} color="#16423C" />
            <Text style={styles.title}>Course Duration</Text>
          </View>

          <View style={styles.datesContainer}>
            <View style={styles.dateCard}>
              <View style={styles.dateHeader}>
                <View style={styles.dateIcon}>
                  <MaterialIcons name="play-arrow" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.dateLabel}>Start Date</Text>
              </View>
              {startDateFormatted ? (
                <View style={styles.dateContent}>
                  <Text style={styles.dateDay}>{startDateFormatted.day}</Text>
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateMonth}>{startDateFormatted.month}</Text>
                    <Text style={styles.dateYear}>{startDateFormatted.year}</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.noDate}>Not Available</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.dateCard}>
              <View style={styles.dateHeader}>
                <View style={[styles.dateIcon, styles.endDateIcon]}>
                  <MaterialIcons name="stop" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.dateLabel}>End Date</Text>
              </View>
              {endDateFormatted ? (
                <View style={styles.dateContent}>
                  <Text style={styles.dateDay}>{endDateFormatted.day}</Text>
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateMonth}>{endDateFormatted.month}</Text>
                    <Text style={styles.dateYear}>{endDateFormatted.year}</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.noDate}>Not Available</Text>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okButtonText}>Got it</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16423C',
    marginTop: 8,
  },
  datesContainer: {
    marginBottom: 24,
  },
  dateCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    marginBottom: 12,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16423C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  endDateIcon: {
    backgroundColor: '#FF6B6B',
  },
  dateLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateDay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#16423C',
  },
  dateInfo: {
    alignItems: 'flex-end',
  },
  dateMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16423C',
  },
  dateYear: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  noDate: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginVertical: 8,
  },
  okButton: {
    backgroundColor: '#16423C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CourseDatePopup;