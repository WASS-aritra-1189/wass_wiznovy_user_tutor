import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import DashboardModal from '../components/DashboardModal';
import ErrorPopup from '../components/ErrorPopup';
import Calendar from '../components/global/calender';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SuccessPopup from '../components/SuccessPopup';
import { getBudget, getCountries, getGoals, getLanguages, getTopics, updateUserDetails } from '../services/onboardingService';
import { uploadProfileImage } from '../services/profileService';
import { useNavigationContext } from '../navigation/NavigationContext';

interface OnboardingFlowProps {
  onComplete?: (data: any) => void;
  onNavigateToHome?: (userData: { gender: string; name?: string }) => void;
  navigation?: any;
  route?: any;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onNavigateToHome, navigation, route }) => {
  const { onAuthSuccess } = useNavigationContext();
  const [currentStep, setCurrentStep] = useState(route?.params?.initialStep || 1);
  const [completedSteps, setCompletedSteps] = useState(new Set<number>());
  const [formData, setFormData] = useState({
    dateOfBirth: new Date(),
    gender: '',
    goal: '',
    focusTopic: '',
    englishLevel: '',
    country: '',
    language: '',
    budget: '',
    profilePicture: null as string | null,
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDropdowns, setShowDropdowns] = useState({
    gender: false,
    goal: false,
    focusTopic: false,
    englishLevel: false,
    country: false,
    language: false,
    budget: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dobError, setDobError] = useState('');
  const [countries, setCountries] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);

  React.useEffect(() => {
    fetchCountries();
    fetchGoals();
    fetchTopics();
    fetchBudgets();
    fetchLanguages();
  }, []);

  const fetchCountries = async () => {
    try {
      const result = await getCountries(50, 0);
      if (result.success && result.data) {
        setCountries(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const result = await getGoals(20, 0);
      if (result.success && result.data) {
        setGoals(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const result = await getTopics(20, 0);
      if (result.success && result.data) {
        setTopics(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const result = await getBudget(20, 0);
      if (result.success && result.data) {
        setBudgets(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    }
  };

  const fetchLanguages = async () => {
    try {
      const result = await getLanguages(20, 0);
      if (result.success && result.data) {
        setLanguages(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch languages:', error);
    }
  };

  const updateUserProfile = async (stepData: any) => {
    try {
      const result = await updateUserDetails(stepData);
      if (result.success) {
        console.log('User profile updated successfully');
      } else {
        console.error('Failed to update user profile:', result.message);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: {
        if (!formData.dateOfBirth) return false;
        const age = calculateAge(formData.dateOfBirth);
        return age >= 18;
      }
      case 2:
        return formData.gender !== '';
      case 3:
        return formData.goal !== '';
      case 4:
        return formData.focusTopic !== '';
      case 5:
        return formData.englishLevel !== '';
      case 6:
        return formData.country !== '';
      case 7:
        return formData.language !== '';
      case 8:
        return formData.budget !== '';
      case 9:
        return formData.profilePicture !== null;
      case 10:
        return formData.profilePicture !== null;
      default:
        return true;
    }
  };

  // Helper to get update data for each step
  const getUpdateDataForStep = () => {
    switch (currentStep) {
      case 1:
        return { dob: formData.dateOfBirth.toISOString() };
      case 2:
        return { gender: formData.gender };
      case 3: {
        const selectedGoal = goals.find(g => g.name === formData.goal);
        return { goalId: selectedGoal?.id };
      }
      case 4: {
        const selectedTopic = topics.find(t => t.name === formData.focusTopic);
        return { topicId: selectedTopic?.id };
      }
      case 5:
        return { englishLevel: formData.englishLevel };
      case 6: {
        const selectedCountry = countries.find(c => c.name === formData.country);
        return { countryId: selectedCountry?.id };
      }
      case 7: {
        const selectedLanguage = languages.find(l => l.name === formData.language);
        return { languageId: selectedLanguage?.id };
      }
      case 8: {
        const selectedBudget = budgets.find(b => `$${b.min}-${b.max}` === formData.budget);
        return { budgetId: selectedBudget?.id };
      }
      default:
        return {};
    }
  };

  // Helper to handle profile image upload
  const handleProfileImageUpload = async () => {
    if (!formData.profilePicture) return;
    
    setLoading(true);
    try {
      const imageData = {
        file: {
          uri: formData.profilePicture,
          type: 'image/jpeg',
          name: 'profile.jpg',
        },
      };
      const result = await uploadProfileImage(imageData);
      if (result.success) {
        setShowSuccessPopup(true);
      } else {
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error: any) {
      console.error('Failed to upload profile image:', error);
      setErrorMessage(error?.message || 'Failed to upload profile image');
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      if (!formData.dateOfBirth) return;
      const age = calculateAge(formData.dateOfBirth);
      if (age < 18) {
        setDobError('You must be at least 18 years old to continue');
        return;
      }
      setDobError('');
    }

    if (!isStepValid()) return;

    const updateData = getUpdateDataForStep();
    if (Object.keys(updateData).length > 0) {
      await updateUserProfile(updateData);
    }

    if (currentStep === 10 && formData.profilePicture) {
      await handleProfileImageUpload();
      return;
    }

    setCompletedSteps(prev => new Set([...prev, currentStep]));

    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 10) {
      setShowModal(true);
    } else {
      onComplete?.(formData);
    }
  };

  const handleSkip = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowModal(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = (field: string) => {
    setShowDropdowns(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const selectOption = (field: string, value: string) => {
    updateFormData(field, value);
    setShowDropdowns(prev => ({ ...prev, [field]: false }));
  };

  const getFieldIcon = (field: string) => {
    const iconMap: { [key: string]: any } = {
      gender: require('../assets/gender.png'),
      goal: require('../assets/goal.png'),
      focusTopic: require('../assets/focus topic.png'),
      englishLevel: require('../assets/english level.png'),
      country: require('../assets/country.png'),
      language: require('../assets/optional language.png'),
      budget: require('../assets/budget.png')
    };
    return iconMap[field] || require('../assets/gender.png');
  };

  const getStepDescription = (step: number) => {
    const descriptions = {
      1: 'Please provide your date of birth to help us personalize your experience and ensure age-appropriate content.',
      2: 'Select your gender identity to help us customize recommendations and create a more personalized learning environment.',
      3: 'Tell us about your primary learning goal so we can tailor the content and suggest relevant courses for your journey.',
      4: 'Choose your main area of interest to receive targeted content and connect with like-minded learners in your field.',
      5: 'Indicate your English proficiency level to ensure we provide content that matches your language comprehension skills.',
      6: 'Select your country to provide localized content, relevant examples, and region-specific learning opportunities.',
      7: 'Choose an optional secondary language to access multilingual content and expand your learning possibilities.',
      8: 'Set your learning budget to receive recommendations for courses and resources that fit your financial preferences.',
      9: 'Upload a profile picture to personalize your account and help others recognize you in the learning community.',
      10: 'Review your uploaded profile picture and confirm it represents how you want to appear to other learners.'
    };
    return descriptions[step as keyof typeof descriptions] || '';
  };

  const getBackButtonText = (step: number) => {
    const backTexts = {
      1: 'Overview Details',
      2: 'Date of Birth',
      3: 'Gender',
      4: 'Goal',
      5: 'Focus Topic',
      6: 'English Level',
      7: 'Country',
      8: 'Optional Language',
      9: 'Budget',
      10: 'Profile Picture'
    };
    return backTexts[step as keyof typeof backTexts] || 'Back';
  };

  const renderDropdown = (field: string, options: string[], placeholder: string) => {
    const isOpen = showDropdowns[field as keyof typeof showDropdowns];
    const selectedValue = formData[field as keyof typeof formData] as string;
    
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => toggleDropdown(field)}
        >
          <Image source={getFieldIcon(field)} style={styles.dropdownIconImage} />
          <Text style={[styles.dropdownText, !selectedValue && styles.placeholderText]}>
            {selectedValue || placeholder}
          </Text>
          <MaterialIcons 
            name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color="#999" 
          />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.dropdownList}>
            <ScrollView 
              style={styles.dropdownScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={`${field}-${option}-${index}`}
                  style={styles.dropdownItem}
                  onPress={() => selectOption(field, option)}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const onDateSelect = (selectedDate: Date) => {
    updateFormData('dateOfBirth', selectedDate);
    const age = calculateAge(selectedDate);
    if (age < 18) {
      setDobError('You must be at least 18 years old to continue');
    } else {
      setDobError('');
    }
    setShowCalendar(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB');
  };

  const pickImage = async () => {
    // Request permissions first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      selectionLimit: 1,
      exif: false,
    });

    if (!result.canceled) {
      updateFormData('profilePicture', result.assets[0].uri);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(1)}</Text>
            <Text style={styles.fieldLabel}>Enter your date of birth</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowCalendar(true)}
            >
              <Image source={require('../assets/calendar.png')} style={styles.dateIconImage} />
              <Text style={styles.dateText}>{formatDate(formData.dateOfBirth)}</Text>
            </TouchableOpacity>
            {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
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
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(2)}</Text>
            <Text style={styles.fieldLabel}>Enter your gender</Text>
            {renderDropdown('gender', ['MALE', 'FEMALE', 'OTHER'], 'Select your gender')}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(3)}</Text>
            <Text style={styles.fieldLabel}>Enter your goal</Text>
            {renderDropdown('goal', goals.length > 0 ? goals.map(g => g.name) : ['Learn new skills', 'Career advancement', 'Personal development', 'Academic purposes'], 'Select your goal')}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(4)}</Text>
            <Text style={styles.fieldLabel}>Focus topic</Text>
            {renderDropdown('focusTopic', topics.length > 0 ? topics.map(t => t.name) : ['Technology', 'Business', 'Arts', 'Science', 'Languages', 'Health'], 'Select focus topic')}
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(5)}</Text>
            <Text style={styles.fieldLabel}>English level</Text>
            {renderDropdown('englishLevel', ['Beginner', 'Intermediate', 'Exparts', 'Pro_Master'], 'Select English level')}
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(6)}</Text>
            <Text style={styles.fieldLabel}>Select country</Text>
            {renderDropdown('country', countries.length > 0 ? countries.map(c => c.name) : ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Other'], 'Select your country')}
          </View>
        );
      

      case 7:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(7)}</Text>
            <Text style={styles.fieldLabel}>Select optional language</Text>
            {renderDropdown('language',languages.length> 0 ?languages.map(l=>l.name): ['Spanish', 'French', 'German', 'Chinese', 'Japanese', 'None'], 'Select optional language')}
          </View>
        );

      case 8:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(8)}</Text>
            <Text style={styles.fieldLabel}>Your budget</Text>
               {renderDropdown(
                'budget', 
                 budgets.length > 0 
                ? budgets.map(b => `$${b.min}-${b.max}`) 
                : ['$0-50', '$50-100', '$100-200', '$200-500', '$500+'], 
                'Select your budget'
           )}
            </View>
        );

      case 9:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(9)}</Text>
            <Text style={styles.fieldLabel}>Upload profile picture</Text>
            <View style={styles.uploadOuterContainer}>
              <View style={styles.topRightBorderH} />
              <View style={styles.topRightBorderV} />
              <View style={styles.bottomLeftBorderH} />
              <View style={styles.bottomLeftBorderV} />
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={pickImage}
              >
                <MaterialIcons name="cloud-upload" size={40} color="#16423C" />
                <Text style={styles.uploadText}>Tap to upload photo</Text>
                <TouchableOpacity 
                  style={styles.chooseFileButton}
                  onPress={pickImage}
                >
                  <MaterialIcons name="folder" size={20} color="#16423C" style={styles.fileIcon} />
                  <Text style={styles.chooseFileText}>Choose File</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 10:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>{getStepDescription(10)}</Text>
            <Text style={styles.fieldLabel}>Profile Picture</Text>
            <View style={styles.profilePreviewContainer}>
              <View style={styles.profileOuterBorder}>
                <View style={styles.profileImageContainer}>
                  <Image 
                    source={formData.profilePicture ? { uri: formData.profilePicture } : require('../assets/humanimage.png')} 
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        {currentStep > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#000" />
            <Text style={styles.backText}>{getBackButtonText(currentStep)}</Text>
          </TouchableOpacity>
        )}
        {currentStep > 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.backText}>Skip</Text>
            <MaterialIcons name="keyboard-arrow-right" size={20} color="#01004C" style={{marginLeft: -4}} />
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(completedSteps.size / 10) * 100}%` }]} />
        <Text style={styles.progressText}>
          {Math.round((completedSteps.size / 10) * 100)}%
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderStep()}
        
        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          {(() => {
            let buttonTitle = "Continue";
            if (loading) {
              buttonTitle = "Uploading...";
            } else if (currentStep === 9) {
              buttonTitle = "Complete";
            }
            return (
              <Button
                title={buttonTitle}
                onPress={handleContinue}
                variant="primary"
                style={StyleSheet.flatten([styles.continueButton, (!isStepValid() || loading) && styles.disabledButton])}
                disabled={!isStepValid() || loading}
              />
            );
          })()}
        </View>
      </ScrollView>
      
      <DashboardModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onGoToDashboard={() => {
          setShowModal(false);
          onComplete?.(formData);
          onAuthSuccess();
        }}
      />
      
      <SuccessPopup
        visible={showSuccessPopup}
        message="Profile image uploaded successfully!"
        onClose={() => {
          setShowSuccessPopup(false);
          setShowModal(true);
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
    paddingTop: 40,
    paddingBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 0,
    paddingRight: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 0,
  },
  skipText: {
    fontSize: 16,
    color: '#01004C',
    fontWeight: '500',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E5E5',
    marginLeft: 40,
    marginRight: 40,
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 2,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#16423C',
    borderRadius: 2,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: -20,
    fontSize: 12,
    color: '#16423C',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
    minHeight: 300,
  },
  stepDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 40,
    lineHeight: 24,
  },
  fieldLabel: {
    fontSize: 18,
    color: '#01004C',
    textAlign: 'left',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  uploadOuterContainer: {
    position: 'relative',
    padding: 15,
  },
  topRightBorderH: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: 2,
    backgroundColor: '#D0D0D0',
    borderTopRightRadius: 8,
    zIndex: 1,
  },
  topRightBorderV: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 2,
    height: '50%',
    backgroundColor: '#D0D0D0',
    borderTopRightRadius: 8,
    zIndex: 1,
  },
  bottomLeftBorderH: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50%',
    height: 2,
    backgroundColor: '#D0D0D0',
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  bottomLeftBorderV: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 2,
    height: '50%',
    backgroundColor: '#D0D0D0',
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  uploadButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  uploadText: {
    fontSize: 16,
    color: '#16423C',
    fontWeight: '500',
  },
  chooseFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#16423C',
  },
  fileIcon: {
    marginRight: 8,
  },
  chooseFileText: {
    fontSize: 14,
    color: '#16423C',
    fontWeight: '500',
  },

  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  continueButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownIconImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    opacity: 0.3,
  },
  dateIconImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    opacity: 0.3,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownScrollView: {
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
    color: '#000',
  },
  profilePreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  profileOuterBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#16423C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },

  backText: {
    fontSize: 16,
    color: '#01004C',
    marginLeft: -4,
  },

  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },

  calendarContainer: {
    marginTop: 20,
    alignItems: 'center',
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

export default OnboardingFlow;