import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { resetPassword } from '../services/authService';

interface ResetPasswordScreenProps {
  onBack?: () => void;
  onResetSuccess?: () => void;
  email: string;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onBack,
  onResetSuccess,
  email,
}) => {
  const navigation = useNavigation<any>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setErrorMessage('Please enter a new password');
      setShowErrorPopup(true);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      setShowErrorPopup(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setShowErrorPopup(true);
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword({ email, newPassword });
      if (result.success) {
        setShowSuccessPopup(true);
      } else {
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
      
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
            <Text style={styles.backText}>Reset Password</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* App Title Section */}
          <View style={styles.appTitleSection}>
            <Text style={styles.appTitle}>Lipsum generator: Lorem Ipsum -</Text>
            <Text style={styles.appTitle}>All the facts</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.instructionText}>
              Create a new password for {email}
            </Text>

            {/* New Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  textContentType="none"
                  autoComplete="off"
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <MaterialIcons 
                    name={showNewPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Confirm new password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  textContentType="none"
                  autoComplete="off"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <MaterialIcons 
                    name={showConfirmPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Reset Button */}
            <Button
              title={loading ? "Resetting..." : "Reset Password"}
              onPress={handleResetPassword}
              variant="primary"
              style={StyleSheet.flatten([styles.resetButton, loading && styles.buttonDisabled])}
              textStyle={styles.resetButtonText}
              disabled={loading}
            />
          </View>
        </ScrollView>

        <SuccessPopup
          visible={showSuccessPopup}
          message="Password reset successfully"
          onClose={() => {
            setShowSuccessPopup(false);
            onResetSuccess?.();
            navigation.navigate('SignIn');
          }}
        />
        
        <ErrorPopup
          visible={showErrorPopup}
          message={errorMessage}
          onClose={() => setShowErrorPopup(false)}
        />
      </SafeAreaView>
    </SafeAreaWrapper>
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
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#01004C',
    marginLeft: 4,
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  appTitleSection: {
    alignItems: 'flex-start',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 4,
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#01004C',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default ResetPasswordScreen;