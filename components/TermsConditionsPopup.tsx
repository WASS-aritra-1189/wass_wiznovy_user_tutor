import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from './Button';

interface TermsConditionsPopupProps {
  visible: boolean;
  onAccept: () => void;
  onClose: () => void;
}

const TermsConditionsPopup: React.FC<TermsConditionsPopupProps> = ({
  visible,
  onAccept,
  onClose,
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
 const handleAccept = () => {
    if (acceptTerms) {
      onAccept();
      setAcceptTerms(false);
    }
  };

  const handleClose = () => {
    onClose();
    setAcceptTerms(false);
  };

  if (visible) {
    console.log('TermsConditionsPopup should be visible now');
  }
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
          
          <Image 
            source={require('../assets/temrsandcondition.png')} 
            style={styles.image}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>TERMS & CONDITION OF THE APP</Text>
          
          <ScrollView style={styles.descriptionContainer} showsVerticalScrollIndicator={true}>
            <Text style={styles.description}>
              Read the terms carefully before accepting. Check permissions the app requests (e.g., data access). Only proceed if you're comfortable with the conditions.
              
              {"\n\n"}By using this application, you agree to our terms of service and privacy policy. We collect and process your personal information in accordance with applicable data protection laws.
              
              {"\n\n"}The app may request access to your device's camera, microphone, storage, and location services to provide enhanced functionality. You can manage these permissions in your device settings.
              
              {"\n\n"}We are committed to protecting your privacy and ensuring the security of your personal data. For more information about how we handle your data, please review our complete privacy policy.
              
              {"\n\n"}These terms may be updated from time to time. Continued use of the app constitutes acceptance of any changes to these terms.
            </Text>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
              {acceptTerms && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxText}>I accept the terms and conditions</Text>
          </TouchableOpacity>
          
          <Button
            title="Accept"
            onPress={handleAccept}
            variant="primary"
            style={StyleSheet.flatten([styles.acceptButton, !acceptTerms && styles.disabledButton])}
            disabled={!acceptTerms}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 99999,
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 450,
    height: '70%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    textAlign: 'center',
    marginBottom: 15,
  },
  descriptionContainer: {
    maxHeight: 280,
    marginBottom: 30,
    width: '100%',
  },
  description: {
    fontSize: 14,
    color: '#01004C',
    textAlign: 'left',
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: .5,
    borderColor: '#16423C',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0AAD2D',
  },
  checkboxText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  acceptButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default TermsConditionsPopup;