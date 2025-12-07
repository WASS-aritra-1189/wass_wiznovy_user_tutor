import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Platform, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const countries = [
  { name: 'US', code: '+1' },
  { name: 'UK', code: '+44' },
  { name: 'CA', code: '+1' },
  { name: 'AU', code: '+61' },
  { name: 'DE', code: '+49' },
  { name: 'FR', code: '+33' },
  { name: 'IN', code: '+91' },
  { name: 'JP', code: '+81' },
];

const concerns = [
  'Technical Support',
  'Account Issues',
  'Billing Questions',
  'Feature Request',
  'Bug Report',
  'General Inquiry'
];

const HelpForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [concern, setConcern] = useState('');
  const [showConcernModal, setShowConcernModal] = useState(false);
  const [message, setMessage] = useState('');
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Contact us</Text>
        <Text style={styles.subtitle}>Get in touch</Text>
        <Text style={styles.description}>
          We'd love to hear from you. Please fill out this form.
        </Text>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.phoneContainer}>
            <TouchableOpacity 
              style={styles.countryCodeButton}
              onPress={() => setShowCountryModal(true)}
            >
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <MaterialIcons 
                name="keyboard-arrow-down" 
                size={16} 
                color="#666" 
              />
            </TouchableOpacity>
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 000-0000"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Concern related to</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowConcernModal(true)}
          >
            <Text style={[styles.dropdownText, !concern && styles.placeholder]}>
              {concern || 'Select a concern'}
            </Text>
            <MaterialIcons 
              name="keyboard-arrow-down" 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={message}
            onChangeText={setMessage}
            placeholder="Tell us about your concern..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setAgreeToPolicy(!agreeToPolicy)}
        >
          <View style={[styles.checkbox, agreeToPolicy && styles.checkboxChecked]}>
            {agreeToPolicy && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxText}>
            You agree to our friendly privacy policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Send message</Text>
        </TouchableOpacity>

        {/* Country Code Modal */}
        <Modal
          visible={showCountryModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCountryModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowCountryModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Country Code</Text>
                    <TouchableOpacity 
                      onPress={() => setShowCountryModal(false)}
                      style={styles.closeButton}
                    >
                      <MaterialIcons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView 
                    style={styles.modalList}
                    contentContainerStyle={styles.modalListContent}
                  >
                    {countries.map((country, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.modalItem,
                          country.code === countryCode && styles.selectedItem
                        ]}
                        onPress={() => {
                          setCountryCode(country.code);
                          setShowCountryModal(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>
                          {country.name} {country.code}
                        </Text>
                        {country.code === countryCode && (
                          <MaterialIcons name="check" size={20} color="#16423C" />
                        )}
                      </TouchableOpacity>
                    ))}
                    {/* Add bottom padding space */}
                    <View style={styles.modalBottomPadding} />
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Concern Modal */}
        <Modal
          visible={showConcernModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowConcernModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowConcernModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Concern</Text>
                    <TouchableOpacity 
                      onPress={() => setShowConcernModal(false)}
                      style={styles.closeButton}
                    >
                      <MaterialIcons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView 
                    style={styles.modalList}
                    contentContainerStyle={styles.modalListContent}
                  >
                    {concerns.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.modalItem,
                          item === concern && styles.selectedItem
                        ]}
                        onPress={() => {
                          setConcern(item);
                          setShowConcernModal(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                        {item === concern && (
                          <MaterialIcons name="check" size={20} color="#16423C" />
                        )}
                      </TouchableOpacity>
                    ))}
                    {/* Add bottom padding space */}
                    <View style={styles.modalBottomPadding} />
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  messageInput: {
    height: 100,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'space-between',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  checkboxText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#16423C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%', // Reduced height to ensure space at bottom
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalList: {
    maxHeight: 400,
  },
  modalListContent: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 24, // Extra padding for system bars
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedItem: {
    backgroundColor: '#F8F9FA',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalBottomPadding: {
    height: Platform.OS === 'ios' ? 34 : 24, // Additional padding element
  },
});

export default HelpForm;