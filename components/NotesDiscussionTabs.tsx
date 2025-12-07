import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface NotesDiscussionTabsProps {
  onTabChange: (tab: 'notes' | 'discussion') => void;
}

const NotesDiscussionTabs: React.FC<NotesDiscussionTabsProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'discussion'>('notes');

  const handleTabPress = (tab: 'notes' | 'discussion') => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
        onPress={() => handleTabPress('notes')}
      >
        <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
          Notes
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'discussion' && styles.activeTab]}
        onPress={() => handleTabPress('discussion')}
      >
        <Text style={[styles.tabText, activeTab === 'discussion' && styles.activeTabText]}>
          Discussion
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 4,
    marginVertical: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#E7E7E7',
    borderWidth: 1,
    borderColor: '#DFDFDF',
  },
  activeTab: {
    backgroundColor: '#E7E7E7',
    borderColor: '#01004C',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#01004C',
  },
});

export default NotesDiscussionTabs;