import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import VideoPlayerCard from '../components/VideoPlayerCard';
import VideoCard from '../components/VideoCard';
import NotesDiscussionTabs from '../components/NotesDiscussionTabs';
import NotesSection from '../components/NotesSection';
import DiscussionSection from '../components/DiscussionSection';

interface CourseVideoPageProps {
  navigation: any;
  route: any;
}

const CourseVideoPage: React.FC<CourseVideoPageProps> = ({ navigation, route }) => {
  const { video } = route.params;
  const [activeTab, setActiveTab] = useState<'notes' | 'discussion'>('notes');
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleTabChange = (tab: 'notes' | 'discussion') => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={[styles.headerBackground, { height: insets.top + 60 }]}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#ffffff" />
            <Text style={styles.backText}>{video?.title || 'Video Player'}</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <VideoPlayerCard />
        <View style={styles.videoCardWrapper}>
          <VideoCard
            title={video?.title || 'Sample Video Title'}
            description={video?.description || 'Sample video description'}
            duration={video?.duration || '15 min'}
            chapter={video?.chapter || 'Chapter 0'}
            videoNumber={video?.videoNumber || '1 Video'}
            isWatched={video?.isWatched || false}
          />
        </View>
        
        <View style={styles.notesDiscussionWrapper}>
          <NotesDiscussionTabs onTabChange={handleTabChange} />
          
          <View style={styles.contentSection}>
            {activeTab === 'notes' ? <NotesSection /> : <DiscussionSection />}
          </View>
        </View>
      </ScrollView>
      
      
      {activeTab === 'notes' && (
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity style={styles.floatingButton}>
            <Text style={styles.floatingButtonText}>Mark This Video As Completed</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBackground: {
    backgroundColor: '#16423C',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  backText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 0,
    flex: 1,
  },
  headerPlaceholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 60,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  videoCardWrapper: {
    marginVertical: 8,
  },
  notesDiscussionWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    minHeight: 400,
  },
  contentSection: {
    paddingBottom: 20,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  floatingButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CourseVideoPage;