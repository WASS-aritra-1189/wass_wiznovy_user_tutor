import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface UnitCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  courseName: string;
  onPress: () => void;
}

const UnitCard: React.FC<UnitCardProps> = ({
  name,
  description,
  imageUrl,
  courseName,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={imageUrl ? { uri: imageUrl } : require('../assets/coursemenu.png')} 
        style={styles.unitImage} 
        resizeMode="cover" 
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.unitName}>{name}</Text>
          <MaterialIcons name="play-circle-filled" size={24} color="#16423C" />
        </View>
        <Text style={styles.courseName}>{courseName}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  unitImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    flex: 1,
  },
  courseName: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
});

export default UnitCard;