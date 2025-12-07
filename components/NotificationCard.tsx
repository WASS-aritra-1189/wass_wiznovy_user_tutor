import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface NotificationCardProps {
  title: string;
  description: string;
  timeAgo: string;
  onPress?: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  description,
  timeAgo,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
        <Image 
          source={require('../assets/notification.png')} 
          style={styles.notificationImage}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 396,
    minHeight: 88,
    borderRadius: 6,
    borderWidth: 0.41,
    borderColor: '#275956',
    paddingTop: 15,
    paddingRight: 13,
    paddingBottom: 15,
    paddingLeft: 13,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 26,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01004C',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  rightSection: {
    alignItems: 'center',
    paddingTop: 2,
  },
  timeAgo: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '400',
    marginBottom: 4,
  },
  notificationImage: {
    width: 16,
    height: 16,
  },
});

export default NotificationCard;