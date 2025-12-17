import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TermsConditionsPopup from './TermsConditionsPopup';

interface TermsPopupProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onOtpRedirect?: () => void;
}

const TermsPopup: React.FC<TermsPopupProps> = ({ visible, onAccept, onDecline, onOtpRedirect }) => {
  const [accepted, setAccepted] = useState(false);
  const [showTermsConditions, setShowTermsConditions] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
      if (onOtpRedirect) {
        onOtpRedirect();
      }
    }
  };



  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onDecline}
      >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Mail Icon at the top */}
          <View style={styles.imageContainer}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="drafts" size={100} color="#16423C" />
              <View style={styles.checkmarkContainer}>
                <MaterialIcons name="done" size={60} color="#16423C" />
              </View>
            </View>
          </View>
          
          {/* Header */}
          <Text style={styles.modalTitle}>FORGOT PASSWORD SENT ON EMAIL</Text>
          
          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.modalText}>
              Please read the terms carefully before accepting.
              Review the permissions requested by the app (e.g.,
              data access) and proceed only if you are comfortable
              with them.
            </Text>
          </View>

          {/* Terms Checkbox */}
          <View style={styles.termsContainer}>
            <TouchableOpacity 
              onPress={() => setAccepted(!accepted)}
            >
              <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
                {accepted && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTermsConditions(true)}>
              <Text style={styles.termsText}>I accept the terms and conditions of an app</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity 
            onPress={handleAccept} 
            style={[styles.confirmButton, !accepted && styles.confirmButtonDisabled]}
            disabled={!accepted}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
      </Modal>
      
      <TermsConditionsPopup
        visible={showTermsConditions}
        onAccept={() => {
          setShowTermsConditions(false);
          setAccepted(true);
        }}
        onClose={() => setShowTermsConditions(false)}
      />
    </>
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
    minHeight: 400, // Increased to accommodate image
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: -10,
    left: 28,
    shadowColor: '#16423C',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01004C',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentContainer: {
    marginBottom: 20,
    minHeight: 120,
  },
  modalText: {
    fontSize: 14,
    color: '#01004C',
    lineHeight: 20,
    textAlign: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: .5,
    borderColor: '#16423C',
    borderRadius: 10,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0AAD2D',
  },
  termsText: {
    fontSize: 14,
    color: '#01004C',
    flex: 1,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default TermsPopup;