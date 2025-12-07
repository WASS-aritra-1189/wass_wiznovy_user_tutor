import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import HoursSpent from '../components/HoursSpent';
import LearningTimeChart from '../components/LearningTimeChart';

interface HoursSpentPageProps {
  navigation?: any;
  onBack?: () => void;
}

const HoursSpentPage: React.FC<HoursSpentPageProps> = ({ navigation, onBack }) => {
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else {
      navigation?.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.headerText}>Hours Spent</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <HoursSpent />
        <LearningTimeChart />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  headerText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
});

export default HoursSpentPage;