import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface RecordedSessionCardProps {
  type: 'video' | 'pdf';
  title: string;
  subtitle: string;
  date: string;
  onDownload: () => void;
  onView: () => void;
}

const RecordedSessionCard: React.FC<RecordedSessionCardProps> = ({
  type,
  title,
  subtitle,
  date,
  onDownload,
  onView,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={[styles.imageContainer, type === 'video' && styles.circularContainer, type === 'video' && styles.videoImageContainer]}>
          <Image
            source={type === 'video' ? require('../assets/recorded.png') : require('../assets/pdfnotes.png')}
            style={[styles.typeImage, type === 'video' && styles.circularImage, type === 'video' && styles.videoImage]}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={styles.date}>{date}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onDownload} style={styles.downloadButton}>
              <Image
                source={require('../assets/recordedvideolecture.png')}
                style={styles.downloadIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onView} style={styles.viewButton}>
              <Text style={styles.viewButtonText}>
                {type === 'video' ? 'Watch' : 'View'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 388,
    height: 108,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 8,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: 66,
    height: 66,
    backgroundColor: '#ffffffff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  typeImage: {
    width: 66,
    height: 66,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  downloadButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
  },
  downloadIcon: {
    width: 30,
    height: 30,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#16423C',
    borderRadius: 4,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  circularContainer: {
    borderRadius: 40,
  },
  circularImage: {
    borderRadius: 40,
  },
  videoImageContainer: {
    width: 80,
    height: 80,
  },
  videoImage: {
    width: 80,
    height: 80,
  },
});

export default RecordedSessionCard;