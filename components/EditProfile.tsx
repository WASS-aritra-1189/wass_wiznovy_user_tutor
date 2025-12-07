import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { getUserProfile, updateUserProfile, uploadProfileImage, getCountries } from '../services/profileService';
import { updateProfile} from '../store/userSlice';
import SuccessPopup from './SuccessPopup';
import Calendar from './global/calender';

interface EditProfileProps {
  visible: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [imageUploading, setImageUploading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isImagePickerReady, setIsImagePickerReady] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    country: '',
  });
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      fetchUserProfile();
      fetchCountries();
      // Initialize image picker with a delay to ensure proper registration
      initializeImagePicker();
    } else {
      // Reset when closing
      setIsImagePickerReady(false);
    }
  }, [visible]);

  const initializeImagePicker = async () => {
    try {
      // Request permissions early
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('ImagePicker permission status:', status);
      
      // Set ready after a delay to ensure ActivityResultLauncher is registered
      const timer = setTimeout(() => {
        setIsImagePickerReady(true);
        console.log('ImagePicker is now ready');
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error initializing ImagePicker:', error);
      // Still set ready after delay even if permission check fails
      setTimeout(() => setIsImagePickerReady(true), 500);
    }
  };

  const fetchCountries = async () => {
    try {
      setCountriesLoading(true);
      const response = await getCountries(50, 0);
      console.log('Countries API Response:', response);
      if (response.success && response.data) {
        console.log('Countries data:', response.data);
        setCountries(response.data);
      } else {
        console.log('Failed to fetch countries:', response.message);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setCountriesLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      console.log('Profile API Response:', response);
      if (response.success && response.data) {
        const userData = response.data;
        console.log('User Data:', userData);
        
        // Handle nested userDetail structure if it exists
        const userDetail = userData.userDetail || userData;
        
        setFormData({
          firstName: userDetail.firstName || userDetail.name || '',
          email: userDetail.email || userData.email || '',
          phoneNumber: userDetail.phoneNumber || userDetail.phone || '',
          dateOfBirth: userDetail.dateOfBirth || userDetail.dob || '',
          gender: userDetail.gender || '',
          country: userDetail.country?.name || '',
        });
        setProfileImage(userDetail.profile || userData.userDetail?.profile || '');
        console.log('Form Data Set:', {
          firstName: userDetail.firstName || userDetail.name || '',
          email: userDetail.email || userData.email || '',
          phoneNumber: userDetail.phoneNumber || userDetail.phone || '',
          dateOfBirth: userDetail.dateOfBirth || userDetail.dob || '',
          gender: userDetail.gender || '',
          country: userDetail.country?.name || '',
        });
      } else {
        console.log('Failed to fetch profile:', response.message);
        Alert.alert('Error', response.message || 'Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Find country ID from selected country name
      const selectedCountry = countries.find(c => c.name === formData.country);
      
      // Map firstName to name and dateOfBirth to dob for API
      const updateData = {
        ...formData,
        name: formData.firstName, // API expects 'name' field
        dob: formData.dateOfBirth, // API expects 'dob' field
        countryId: selectedCountry?.id, // Send country ID instead of name
      };
      
      // Remove the original fields that are mapped
      delete updateData.firstName;
      delete updateData.dateOfBirth;
      delete updateData.country;
      
      console.log('Sending update data:', updateData);
      const response = await updateUserProfile(updateData);
      console.log('Update response:', response);
      
      if (response.success) {
        // Update Redux store immediately
        const selectedCountry = countries.find(c => c.name === formData.country);
        dispatch(updateProfile({
          userDetail: {
            name: formData.firstName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            country: selectedCountry,
            profile: profileImage,
          }
        } as any));
        
        setSuccessMessage('Profile updated successfully');
        setShowSuccessPopup(true);
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onDateSelect = (selectedDate: Date) => {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    updateField('dateOfBirth', formattedDate);
    setShowCalendar(false);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select date of birth';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch {
      return dateString;
    }
  };

  const getImageHintText = () => {
    if (isImagePickerReady) {
      return imageUploading ? 'Uploading...' : 'Tap to change profile picture';
    }
    return 'Initializing camera...';
  };

  const getImageOverlayIcon = () => {
    if (imageUploading) {
      return <ActivityIndicator size="small" color="#FFFFFF" />;
    }
    if (isImagePickerReady) {
      return <MaterialIcons name="camera-alt" size={24} color="#FFFFFF" />;
    }
    return <MaterialIcons name="hourglass-empty" size={20} color="#FFFFFF" />;
  };

  const pickImage = async (retryCount = 0) => {
    const MAX_RETRIES = 2;

    try {
      // Check if image picker is ready
      if (!isImagePickerReady) {
        console.log('ImagePicker not ready yet');
        Alert.alert('Please wait', 'Image picker is initializing, please try again in a moment.');
        // Try to reinitialize
        initializeImagePicker();
        return;
      }

      // Request permissions (double check)
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera roll permissions are needed to upload images.');
        return;
      }

      // Ensure we're not in a loading state
      if (loading || saving || imageUploading) {
        Alert.alert('Please wait', 'Please wait for current operation to complete.');
        return;
      }

      // Add increasing delay based on retry count
      if (retryCount > 0) {
        const delay = 500 * retryCount;
        console.log(`Retry ${retryCount}, waiting ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      console.log('Launching image library...');
      
      // Try different MediaType approaches based on Expo version
      let mediaTypes: any;
      
      // Use MediaTypeOptions.Images which is the correct property
      mediaTypes = ImagePicker.MediaTypeOptions.Images;
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypes,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('ImagePicker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        setProfileImage(imageUri);
        await uploadImage(imageUri);
      } else {
        console.log('Image selection canceled');
      }
    } catch (error: any) {
      console.error(`Error picking image (attempt ${retryCount + 1}):`, error);
      
      // Check for specific ActivityResultLauncher error
      if (error.message && error.message.includes('unregistered ActivityResultLauncher') && retryCount < MAX_RETRIES) {
        console.log(`Retrying image picker... Attempt ${retryCount + 1}`);
        // Reset readiness and retry
        setIsImagePickerReady(false);
        setTimeout(() => {
          initializeImagePicker();
          pickImage(retryCount + 1);
        }, 300);
      } else if (retryCount < MAX_RETRIES) {
        // Generic retry for other errors
        console.log(`Retrying image picker... Attempt ${retryCount + 1}`);
        pickImage(retryCount + 1);
      } else {
        Alert.alert('Error', 'Failed to pick image after multiple attempts. Please try closing and reopening the edit profile screen.');
        setIsImagePickerReady(false);
      }
    }
  };

  const uploadImage = async (imageUri: string) => {
    try {
      setImageUploading(true);
      
      const imageData = {
        file: {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        }
      };

      const response = await uploadProfileImage(imageData);
      if (response.success) {
        // Update Redux store immediately with new image
        dispatch(updateProfile({
          userDetail: {
            profile: response.data?.url || imageUri, // Use server URL if available
          }
        } as any));
        
        setSuccessMessage('Profile image updated successfully');
        setShowSuccessPopup(true);
      } else {
        Alert.alert('Error', response.message || 'Failed to upload image');
        // Revert to previous image if upload fails
        fetchUserProfile(); // Reload original profile data
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
      // Revert to previous image
      fetchUserProfile(); // Reload original profile data
    } finally {
      setImageUploading(false);
    }
  };

  const renderCountryDropdownContent = () => {
    if (countriesLoading) {
      return (
        <View style={styles.dropdownLoadingContainer}>
          <ActivityIndicator size="small" color="#16423C" />
          <Text style={styles.dropdownLoadingText}>Loading countries...</Text>
        </View>
      );
    }
    
    if (countries.length > 0) {
      return (
        <ScrollView style={styles.countryScrollView} nestedScrollEnabled={true}>
          {countries.map((country) => (
            <TouchableOpacity
              key={country.id}
              style={styles.dropdownItem}
              onPress={() => {
                updateField('country', country.name);
                setShowCountryDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{country.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }
    
    return (
      <View style={styles.dropdownEmptyContainer}>
        <Text style={styles.dropdownEmptyText}>No countries available</Text>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.contentWrapper}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#16423C" />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.content} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.form}>
                {/* Profile Image Section */}
                <View style={styles.imageSection}>
                  <TouchableOpacity 
                    onPress={() => pickImage()} 
                    style={styles.imageContainer}
                    disabled={imageUploading || !isImagePickerReady}
                  >
                    <Image 
                      source={profileImage ? { uri: profileImage } : require('../assets/walkthrough2.png')} 
                      style={styles.profileImage}
                    />
                    <View style={styles.imageOverlay}>
                      {getImageOverlayIcon()}
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.imageHint}>
                    {getImageHintText()}
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(text) => updateField('firstName', text)}
                    placeholder="Enter your name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => updateField('email', text)}
                    placeholder="Enter email"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.phoneNumber}
                    onChangeText={(text) => updateField('phoneNumber', text)}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowCalendar(true)}
                  >
                    <MaterialIcons name="calendar-today" size={20} color="#999" style={styles.dateIcon} />
                    <Text style={[styles.dateText, !formData.dateOfBirth && styles.placeholderText]}>
                      {formatDisplayDate(formData.dateOfBirth)}
                    </Text>
                  </TouchableOpacity>
                  {showCalendar && (
                    <View style={styles.calendarContainer}>
                      <Calendar onDateSelect={onDateSelect} />
                      <TouchableOpacity 
                        style={styles.closeCalendarButton}
                        onPress={() => setShowCalendar(false)}
                      >
                        <Text style={styles.closeCalendarText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Gender</Text>
                  <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                  >
                    <Text style={[styles.dropdownText, !formData.gender && styles.placeholderText]}>
                      {formData.gender || 'Select gender'}
                    </Text>
                    <MaterialIcons 
                      name={showGenderDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={24} 
                      color="#999" 
                    />
                  </TouchableOpacity>
                  {showGenderDropdown && (
                    <View style={styles.dropdownList}>
                      {['MALE', 'FEMALE', 'OTHER'].map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={styles.dropdownItem}
                          onPress={() => {
                            updateField('gender', option);
                            setShowGenderDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Country</Text>
                  <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => setShowCountryDropdown(!showCountryDropdown)}
                  >
                    <Text style={[styles.dropdownText, !formData.country && styles.placeholderText]}>
                      {formData.country || 'Select country'}
                    </Text>
                    <MaterialIcons 
                      name={showCountryDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={24} 
                      color="#999" 
                    />
                  </TouchableOpacity>
                  {showCountryDropdown && (
                    <View style={styles.countryDropdownList}>
                      {renderCountryDropdownContent()}
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          )}

          {/* Floating Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveButton, (saving || loading) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving || loading}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <SuccessPopup
        visible={showSuccessPopup}
        message={successMessage}
        onClose={() => {
          setShowSuccessPopup(false);
          onUpdate?.();
          onClose();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerPlaceholder: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#16423C',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  saveButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholderText: {
    color: '#999999',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
    maxHeight: 150,
  },
  countryDropdownList: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  countryScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
  dropdownLoadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  dropdownLoadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
  },
  dropdownEmptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  dropdownEmptyText: {
    fontSize: 14,
    color: '#666666',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    borderWidth: 3,
    borderColor: '#16423C',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#16423C',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  imageHint: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  calendarContainer: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeCalendarButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#16423C',
    borderRadius: 6,
  },
  closeCalendarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EditProfile;