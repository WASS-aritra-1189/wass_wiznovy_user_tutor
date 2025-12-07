import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../Button';
import { UserSession } from '../../services/sessionService';

interface ScheduleCardProps {
  scheduleImage: ImageSourcePropType;
  facultyName: string;
  className: string;
  price: string;
  timing: string;
  classDate: Date;
  status?: string;
  session?: UserSession;
  onPress?: () => void;
  onJoinCall?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  cancelLoading?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  scheduleImage,
  facultyName,
  className,
  price,
  timing,
  classDate,
  status,
  session,
  onPress,
  onJoinCall,
  onReschedule,
  onCancel,
  cancelLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeUntilClass, setTimeUntilClass] = useState('');

  useEffect(() => {
    if (!isExpanded) return;

    const calculateTimeUntilClass = () => {
      const now = new Date();
      const [timeRange] = timing.split(' - ');
      const [time, period] = timeRange.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      
      let classHours = hours;
      if (period === 'PM' && hours !== 12) {
        classHours += 12;
      } else if (period === 'AM' && hours === 12) {
        classHours = 0;
      }

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
    const interval = setInterval(calculateTimeUntilClass, 60000);

    return () => clearInterval(interval);
  }, [isExpanded, timing, classDate]);

  const handleCardPress = () => {
    setIsExpanded(!isExpanded);
    onPress?.();
  };
  return (
    <View style={[styles.card, isExpanded && styles.expandedCard]}>
      <TouchableOpacity style={styles.mainContent} onPress={handleCardPress}>
        <Image source={scheduleImage} style={styles.scheduleImage} resizeMode="cover" />
        
        <View style={styles.contentContainer}>
          <View style={styles.leftContent}>
            <Text style={styles.facultyName}>{facultyName}</Text>
            <Text style={styles.className}>{className}</Text>
          </View>
          
          <View style={styles.rightColumn}>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.timing}>{timing}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.zoomCallSection}>
            <View style={styles.leftTextContainer}>
              <Text style={styles.text}>zoom call</Text>
              <Text style={styles.timeUntilClass}>{timeUntilClass}</Text>
            </View>
            
            <Button
              title="Join Call"
              onPress={onJoinCall || (() => {})}
              variant="primary"
              style={styles.joinButton}
              textStyle={styles.joinButtonText}
            />
          </View>
          
          {/* Action Buttons for Scheduled Sessions */}
          {status === 'SCHEDULED' && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.rescheduleButton]}
                onPress={onReschedule}
                disabled={cancelLoading}
              >
                <MaterialIcons name="schedule" size={16} color="#16423C" />
                <Text style={styles.rescheduleText}>Reschedule</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={onCancel}
                disabled={cancelLoading}
              >
                {cancelLoading ? (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 388,
    minHeight: 65,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9F9F9F',
    backgroundColor: '#EEEEEE33',
    marginBottom: 10,
  },
  expandedCard: {
    minHeight: 130,
  },
  mainContent: {
    paddingTop: 9,
    paddingRight: 14,
    paddingBottom: 9,
    paddingLeft: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 65,
  },
  scheduleImage: {
    width: 47,
    height: 47,
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  facultyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  className: {
    fontSize: 12,
    color: '#666666',
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16423C',
  },
  timing: {
    fontSize: 11,
    color: '#999999',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16423C',
    textAlign: 'left',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  zoomCallSection: {
    width: 353.4,
    height: 75.6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  leftTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  timeUntilClass: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'left',
    marginTop: 18,
  },
  joinButton: {
    backgroundColor: '#16423C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
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
});

export default ScheduleCard;