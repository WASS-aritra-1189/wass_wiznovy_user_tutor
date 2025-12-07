import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import NoteCard from './NoteCard';

const NotesSection: React.FC = () => {
  const sampleNotes = [
    {
      id: 1,
      title: 'Introduction Notes',
      content: 'Key points about course introduction and overview',
      timestamp: '2 min ago',
    },
    {
      id: 2,
      title: 'Chapter 1 Summary',
      content: 'Important concepts covered in the first chapter',
      timestamp: '5 min ago',
    },
    {
      id: 3,
      title: 'Advanced Topics',
      content: 'Complex topics that require additional attention',
      timestamp: '10 min ago',
    },
    {
      id: 4,
      title: 'Implementation Details',
      content: 'Step by step implementation guide and best practices',
      timestamp: '15 min ago',
    },
    {
      id: 5,
      title: 'Code Examples',
      content: 'Practical code examples and their explanations',
      timestamp: '20 min ago',
    },
    {
      id: 6,
      title: 'Common Mistakes',
      content: 'Frequently made errors and how to avoid them',
      timestamp: '25 min ago',
    },
    {
      id: 7,
      title: 'Performance Tips',
      content: 'Optimization techniques and performance improvements',
      timestamp: '30 min ago',
    },
  ];

  const handleDownload = (noteId: number) => {
    // Handle download functionality
    console.log('Downloading note:', noteId);
  };

  return (
    <View style={styles.container}>
      {sampleNotes.map((note) => (
        <NoteCard
          key={note.id}
          id={note.id}
          content={note.content}
          onPress={handleDownload}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
});

export default NotesSection;