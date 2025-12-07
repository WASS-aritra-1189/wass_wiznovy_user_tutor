import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface BookCardProps {
  title: string;
  author: string;
  description: string;
  onPress?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  description,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={require('../assets/book.png')} 
        style={styles.bookImage} 
        resizeMode="cover" 
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 187,
    height: 257,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textContainer: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontFamily: 'Manrope',
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#4B5768',
    marginBottom: 4,
    borderRadius: 2,
    paddingTop: 6,
    paddingRight: 8,
    paddingBottom: 6,
    paddingLeft: 8,
    backgroundColor: '#F7F8F9',
    alignSelf: 'flex-start',
  },
  author: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  description: {
    fontSize: 11,
    color: '#999999',
    lineHeight: 16,
    flex: 1,
  },
});

export default BookCard;