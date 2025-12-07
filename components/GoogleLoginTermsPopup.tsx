import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';


interface GoogleLoginTermsPopupProps {
  visible: boolean;
  onContinue: () => void;
  provider?: 'google' | 'apple';
  action?: 'signin' | 'signup';
}

const GoogleLoginTermsPopup: React.FC<GoogleLoginTermsPopupProps> = ({ visible, onContinue, provider = 'google', action = 'signin' }) => {
  const getModalTitle = () => {
    if (action === 'signin') {
      return provider === 'google' ? 'SIGN IN WITH GOOGLE' : 'SIGN IN WITH APPLE';
    }
    return provider === 'google' ? 'SIGN UP WITH GOOGLE' : 'SIGN UP WITH APPLE';
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          
          {/* Header */}
          <Text style={styles.modalTitle}>
            {getModalTitle()}
          </Text>
          
          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.modalText}>
              Please read the terms carefully before accepting.
              Check permissions the app requests.
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            onPress={onContinue} 
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    minHeight: 250,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentContainer: {
    marginBottom: 30,
    minHeight: 80,
  },
  modalText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  continueButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default GoogleLoginTermsPopup;