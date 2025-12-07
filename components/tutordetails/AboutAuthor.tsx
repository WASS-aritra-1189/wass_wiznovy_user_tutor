import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AboutAuthorProps {
  authorName?: string;
  aboutText?: string;
}

const AboutAuthor: React.FC<AboutAuthorProps> = ({ 
  authorName = "Author Name",
  aboutText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.authorName}>{authorName}</Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.aboutText}>{aboutText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 388,
    height: 244,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  authorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginBottom: 15,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  aboutText: {
    fontSize: 14,
    color: '#01004C',
    lineHeight: 20,
    textAlign: 'justify',
    flex: 1,
  },
});

export default AboutAuthor;