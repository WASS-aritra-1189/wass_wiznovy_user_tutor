import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface NoteCardProps {
  id: number;
  content: string;
  onPress: (id: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ id, content, onPress }) => {
  return (
    <TouchableOpacity style={styles.noteCard} onPress={() => onPress(id)}>
      <View style={styles.cardContent}>
        <Text style={styles.noteContent}>{content}</Text>
      </View>
      <Image source={require('../assets/timeline.png')} style={styles.timelineImage} resizeMode="contain" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  noteCard: {
    backgroundColor: '#E7E7E7',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFDFDF',
  },
  cardContent: {
    flex: 1,
  },
  noteContent: {
    fontSize: 14,
    color: '#01004C',
    lineHeight: 20,
  },
  timelineImage: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
});

export default NoteCard;