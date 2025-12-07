import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,

} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

import InfoCard from './InfoCard';

interface DashboardModalProps {
  visible: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
}

const DashboardModal: React.FC<DashboardModalProps> = ({
  visible,
  onClose,
  onGoToDashboard,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#000" />
            <Text style={styles.backText}>Dashboard</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* App Title Section */}
        <View style={styles.appTitleSection}>
          <Text style={styles.appTitle}>Lipsum generator: Lorem Ipsum -</Text>
          <Text style={styles.appSubtitle}>All the facts</Text>
        </View>
        
        <View style={styles.modalContent}>
          <InfoCard
            image={require('../assets/gotodashboard.png')}
            title="Thanks for the Information"
            description="Read the terms carefully before accepting. Check permissions the app requests."
            buttonTitle="Go to Dashboard"
            onButtonPress={onGoToDashboard}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 0,
    paddingRight: 4,
  },
  backText: {
    fontSize: 16,
    color: '#01004C',
    marginLeft: -4,
  },
  headerPlaceholder: {
    width: 32,
  },
  appTitleSection: {
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'left',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
  },

});

export default DashboardModal;