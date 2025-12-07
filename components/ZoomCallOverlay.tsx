import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from './Button';

interface ZoomCallOverlayProps {
  visible: boolean;
  onClose: () => void;
  classTime: string;
  className: string;
  facultyName: string;
  classDate: Date;
  onJoinCall: () => void;
}

const ZoomCallOverlay: React.FC<ZoomCallOverlayProps> = ({
  visible,
  onClose,
  classTime,
  className,
  facultyName,
  classDate,
  onJoinCall,
}) => {
  const [timeUntilClass, setTimeUntilClass] = useState('');

  useEffect(() => {
    if (!visible) return;

    const calculateTimeUntilClass = () => {
      const now = new Date();
      const [timeRange] = classTime.split(' - ');
      const [time, period] = timeRange.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      
      let classHours = hours;
      if (period === 'PM' && hours !== 12) {
        classHours += 12;
      } else if (period === 'AM' && hours === 12) {
        classHours = 0;
      }

      // Create class datetime using the provided date and parsed time
      const classDateTime = new Date(classDate);
      classDateTime.setHours(classHours, minutes, 0, 0);

      const timeDiff = classDateTime.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setTimeUntilClass('Class has started');
        return;
      }

      const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (daysLeft > 0) {
        setTimeUntilClass(`${daysLeft}d ${hoursLeft}h until class`);
      } else if (hoursLeft > 0) {
        setTimeUntilClass(`${hoursLeft}h ${minutesLeft}m until class`);
      } else {
        setTimeUntilClass(`${minutesLeft}m until class`);
      }
    };

    calculateTimeUntilClass();
    const interval = setInterval(calculateTimeUntilClass, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [visible, classTime, classDate]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>

          {/* Zoom call icon */}
          <View style={styles.zoomIconContainer}>
            <Image 
              source={require('../assets/videocourse.png')} 
              style={styles.zoomIcon}
              resizeMode="contain"
            />
          </View>

          {/* Class info */}
          <Text style={styles.className}>{className}</Text>
          <Text style={styles.facultyName}>{facultyName}</Text>
          <Text style={styles.classTime}>{classTime}</Text>

          {/* Time until class */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeUntilClass}>{timeUntilClass}</Text>
          </View>

          {/* Join call button */}
          <Button
            title="Join Call"
            onPress={onJoinCall}
            variant="primary"
            style={styles.joinButton}
            textStyle={styles.joinButtonText}
          />
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
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  zoomIconContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  zoomIcon: {
    width: 60,
    height: 60,
    tintColor: '#16423C',
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  facultyName: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  classTime: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 20,
  },
  timeContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  timeUntilClass: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16423C',
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: '#16423C',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 120,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ZoomCallOverlay;