import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import GradientBanner from '../components/GradientBanner';
import ProfileCard from '../components/ProfileCard';
import Button from '../components/Button';
import TermsConditionsPopup from '../components/TermsConditionsPopup';
import LogoutConfirmationPopup from '../components/LogoutConfirmationPopup';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import EditProfile from '../components/EditProfile';

import { logoutUser } from '../services/authService';
import { removeToken } from '../services/storage';
import { RootState } from '../store/store';

interface ProfilePageProps {
  onBack?: () => void;
  onEdit?: () => void;
  userName?: string;
  profileCompletion?: number;
  onAddChild?: () => void;
  onMyCourses?: () => void;
  onSchedules?: () => void;
  onSearchPress?: () => void;
  onHomePress?: () => void;
  onProfilePress?: () => void;
  onLogout?: () => void;
  navigation?: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  onBack, 
  onEdit, 
  userName = 'John Doe', 
  profileCompletion = 75,
  onAddChild,
  onMyCourses,
  onSchedules,
  onSearchPress,
  onHomePress,
  onProfilePress,
  onLogout,
  navigation
}) => {
  const [showTermsPopup, setShowTermsPopup] = React.useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = React.useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);
  const [showErrorPopup, setShowErrorPopup] = React.useState(false);
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { profile, loading } = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();
  
  const displayName = useMemo(() => {
    return loading ? 'Loading...' : (profile?.userDetail?.name?.trim() || userName);
  }, [loading, profile?.userDetail?.name, userName]);
  
  const profileImageUri = useMemo(() => {
    return profile?.userDetail?.profile ? 
      { uri: profile.userDetail.profile } : 
      require('../assets/walkthrough2.png');
  }, [profile?.userDetail?.profile]);

  const handleTermsAccept = () => {
    setShowTermsPopup(false);
    // Handle terms acceptance logic here
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        await removeToken();
        setShowLogoutPopup(false);
        setShowSuccessPopup(true);
      } else {
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error: any) {
      console.error('Logout failed:', error);
      setErrorMessage(error?.message || 'Something went wrong. Please try again.');
      setShowErrorPopup(true);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutPopup(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      {/* Header with back button */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>My Profile</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Profile Container */}
        <View style={styles.profileContainer}>
          {/* Edit Button */}
          <TouchableOpacity onPress={() => setShowEditProfile(true)} style={styles.editButton}>
            <Image 
              source={require('../assets/edit.png')} 
              style={styles.pencilIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          {/* Profile Image Circles */}
          <View style={styles.profileImageContainer}>
            <View style={styles.outerCircle}>
              <View style={styles.blueQuarter} />
              <View style={styles.innerCircle}>
                <Image 
                  source={profileImageUri} 
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </View>
            </View>
            
            {/* User Info */}
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>
                {displayName}
              </Text>
              <Text style={styles.profileCompletion}>{profileCompletion}% Profile Completed</Text>
            </View>
          </View>
        </View>
        
        {/* Profile Cards */}
        <View style={styles.cardsContainer}>
          <ProfileCard 
            iconSource={require('../assets/addmychild.png')}
            text="Add My Child"
            onPress={onAddChild}
          />
          <ProfileCard 
            iconSource={require('../assets/my courses.png')}
            text="My Courses"
            onPress={() => navigation?.navigate('MyCourse')}
          />
          <ProfileCard 
            iconSource={require('../assets/schedules.png')}
            text="Schedules"
            onPress={() => navigation?.navigate('MyScheduled')}
          />
        </View>
        
        {/* Gradient Banner */}
        <GradientBanner 
          mainText="Profile Complete"
          subText="Keep your profile updated for better experience"
        />
        
        {/* Additional Cards */}
        <View style={styles.cardsContainer}>
          <ProfileCard 
            iconSource={require('../assets/hours spent.png')}
            text="Hours Spent"
            onPress={() => navigation?.navigate('HoursSpent')}
          />
          <ProfileCard 
            iconSource={require('../assets/progressnew.png')}
            text="Progress"
          />
          <ProfileCard 
            iconSource={require('../assets/my library.png')}
            text="My Library"
            onPress={() => navigation?.navigate('OpenLibrary')}
          />
        </View>
        
        {/* Policy and Support Buttons */}
        <View style={styles.buttonRow}>
          <Button 
            title="App Policies"
            onPress={() => navigation?.navigate('GeneralPolicy')}
            variant="primary"
            style={styles.policyButton}
          />
          <Button 
            title="Help & Support"
            onPress={() => {}}
            variant="primary"
            style={styles.supportButton}
          />
        </View>
        
        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button 
            title="Logout"
            onPress={handleLogout}
            variant="primary"
            style={styles.logoutButton}
          />
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <TermsConditionsPopup
        visible={showTermsPopup}
        onAccept={handleTermsAccept}
        onClose={() => setShowTermsPopup(false)}
      />
      
      <LogoutConfirmationPopup
        visible={showLogoutPopup}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
      
      <SuccessPopup
        visible={showSuccessPopup}
        message="Logged out successfully"
        onClose={() => {
          setShowSuccessPopup(false);
          onLogout?.();
        }}
      />
      
      <ErrorPopup
        visible={showErrorPopup}
        message={errorMessage}
        onClose={() => setShowErrorPopup(false)}
      />
      
      <EditProfile
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onUpdate={() => {
          // Force component re-render by closing and potentially refreshing
          setShowEditProfile(false);
          // You may need to dispatch an action to refresh profile data
          // or the parent component should refetch profile data
          if (navigation) {
            // Navigate to the Profile tab to refresh the screen
            navigation.navigate('MainTabs', { screen: 'Profile' });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
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
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 24,
  },
  profileContainer: {
    backgroundColor: '#16423C',
    height: 324,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pencilIcon: {
    width: 20,
    height: 20,
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueQuarter: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 70,
    height: 70,
    backgroundColor: '#28DEFB',
    borderTopRightRadius: 70,
  },
  innerCircle: {
    width: 125,
    height: 125,
    borderRadius: 65,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 65,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileCompletion: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 13,
    justifyContent: 'space-between',
  },
  spacer: {
    height: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginTop: 20,
  },
  policyButton: {
    flex: 1,
  },
  supportButton: {
    flex: 1,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  logoutButton: {
    backgroundColor: '#FF4444',
  },
});

export default React.memo(ProfilePage);