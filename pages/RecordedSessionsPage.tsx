import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import RecordedSessionCard from '../components/RecordedSessionCard';

interface RecordedSessionsPageProps {
  visible: boolean;
  onClose: () => void;
}

const RecordedSessionsPage: React.FC<RecordedSessionsPageProps> = ({
  visible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'notes'>('video');

  if (!visible) return null;

  const recordedSessions = [
    {
      id: '1',
      title: 'Mathematics Algebra Session',
      subtitle: 'Advanced Algebra Concepts',
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'Physics Mechanics',
      subtitle: 'Newton\'s Laws of Motion',
      date: '2024-01-14',
    },
     {
      id: '3',
      title: 'Physics Mechanics',
      subtitle: 'Third law of newton',
      date: '2024-01-14',
    },
  ];

  const notes = [
    {
      id: '1',
      title: 'Mathematics Notes',
      subtitle: 'Algebra Chapter 5',
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'Physics Notes',
      subtitle: 'Mechanics Summary',
      date: '2024-01-14',
    },
  ];

  const handleDownload = async (id: string, type: 'video' | 'pdf') => {
    if (type === 'pdf') {
      const noteTitle = notes.find(n => n.id === id)?.title || 'Document';
      
      Alert.alert(
        'Download PDF',
        `Download "${noteTitle}" to your device?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download',
            onPress: () => void (async () => {
              try {
                const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
                const supported = await Linking.canOpenURL(pdfUrl);
                if (supported) {
                  await Linking.openURL(pdfUrl);
                  Alert.alert('Success', `PDF "${noteTitle}" opened for download!`);
                } else {
                  Alert.alert('Error', 'Cannot open PDF URL');
                }
              } catch (error) {
                console.error('PDF download error:', error);
                Alert.alert('Error', 'Failed to download PDF');
              }
            })()
          }
        ]
      );
    } else {
      Alert.alert('Info', 'Video download not implemented yet');
    }
  };

  const handleView = async (id: string, type: 'video' | 'pdf') => {
    if (type === 'pdf') {
      try {
        const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        const supported = await Linking.canOpenURL(pdfUrl);
        if (supported) {
          await Linking.openURL(pdfUrl);
        } else {
          Alert.alert('Error', 'Cannot open PDF URL');
        }
      } catch (error) {
        console.error('PDF view error:', error);
        Alert.alert('Error', 'Failed to open PDF');
      }
    } else {
      Alert.alert('Info', 'Video playback not implemented yet');
    }
  };

  return (
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Class Resource</Text>
          </TouchableOpacity>
        
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'video' && styles.activeTab]}
            onPress={() => setActiveTab('video')}
          >
            <Text style={[styles.tabText, activeTab === 'video' && styles.activeTabText]}>
              Recorded Sessions
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'notes' && styles.activeTab]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
              Notes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardContainer}>
            {activeTab === 'video'
              ? recordedSessions.map((session) => (
                  <RecordedSessionCard
                    key={session.id}
                    type="video"
                    title={session.title}
                    subtitle={session.subtitle}
                    date={session.date}
                    onDownload={() => void handleDownload(session.id, 'video')}
                    onView={() => void handleView(session.id, 'video')}
                  />
                ))
              : notes.map((note) => (
                  <RecordedSessionCard
                    key={note.id}
                    type="pdf"
                    title={note.title}
                    subtitle={note.subtitle}
                    date={note.date}
                    onDownload={() => void handleDownload(note.id, 'pdf')}
                    onView={() => void handleView(note.id, 'pdf')}
                  />
                ))}
          </View>
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerPlaceholder: {
    width: 60,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    margin: 20,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#16423C',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    paddingHorizontal: 25,
    alignItems: 'center',
  },
});

export default RecordedSessionsPage;