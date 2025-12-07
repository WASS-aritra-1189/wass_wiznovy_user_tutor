// navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens directly to avoid nested navigators
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import ProfilePage from '../pages/ProfilePage';
import NotificationPage from '../pages/NotificationPage';
import MyCourse from '../pages/MyCourse';
import OpenLibrary from '../components/OpenLibrary';
import BookDetailPage from '../components/BookDetailPage';
import HelpPage from '../pages/HelpPage';
import HelpFormPage from '../pages/HelpFormPage';
import MyScheduled from '../pages/MyScheduled';
import CategorySubjectsPage from '../pages/CategorySubjectsPage';
import SubjectTeachersPage from '../pages/SubjectTeachersPage';
import TutorDetailPage from '../pages/TutorDetailPage';
import CourseDetailsPage from '../pages/CourseDetailsPage';
import VideoDetailsPage from '../pages/VideoDetailsPage';
import CourseVideoPage from '../pages/CourseVideoPage';
import YoutubeTypePlayer from '../pages/YoutubeTypePlayer';
import GeneralPolicyScreen from '../pages/generalPolicy';
import PolicyDetailPage from '../pages/PolicyDetailPage';
import HoursSpentPage from '../pages/HoursSpentPage';
import TrialBookingPage from '../pages/TrialBookingPage';
import TrialCheckoutPage from '../pages/TrialCheckoutPage';

import PaymentPage from '../pages/PaymentPage';
import MySchedulePage from '../pages/MySchedulePage';
import AllTutorsPage from '../pages/AllTutorsPage';
import AllCoursesPage from '../pages/AllCoursesPage';
import AiChatHelpPage from '../pages/AiChatHelpPage';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

// Extract icon components outside the main component
const HomeIcon = () => (
  <Image
    source={require('../assets/home.png')}
    style={{
      width: 27,
      height: 29,
      tintColor: '#16423C',
    }}
    resizeMode="contain"
  />
);

const LearningIcon = () => (
  <Image
    source={require('../assets/learning.png')}
    style={{
      width: 27,
      height: 29,
      tintColor: '#16423C',
    }}
    resizeMode="contain"
  />
);

const DownloadIcon = () => (
  <Image
    source={require('../assets/download.png')}
    style={{
      width: 27,
      height: 29,
      tintColor: '#16423C',
    }}
    resizeMode="contain"
  />
);

const SearchIcon = () => (
  <Image
    source={require('../assets/earchforfooter.png')}
    style={{
      width: 27,
      height: 29,
      tintColor: '#16423C',
    }}
    resizeMode="contain"
  />
);

const ProfileIcon = () => (
  <Image
    source={require('../assets/profile.png')}
    style={{
      width: 27,
      height: 29,
      tintColor: '#16423C',
    }}
    resizeMode="contain"
  />
);

// Extract components outside the main component
const SearchScreenWrapper = (props: any) => (
  <SearchPage
    {...props}
    onBack={() => props.navigation.goBack()}
  />
);

const ProfileScreenWrapper = ({ onLogout, ...props }: any) => (
  <ProfilePage
    {...props}
    onBack={() => props.navigation.goBack()}
    onLogout={onLogout}
  />
);

// Create a component that accepts onLogout as a prop through navigation params
const ProfileScreenWithLogout = (props: any) => {
  const onLogout = props.route?.params?.onLogout;
  return (
    <ProfilePage
      {...props}
      onBack={() => props.navigation.goBack()}
      onLogout={onLogout}
    />
  );
};

const TabNavigator = ({ onLogout }: { onLogout?: () => void }) => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#C4DAD2',
          borderWidth: 1,
          borderColor: '#16423C',
          height: 70,
          marginHorizontal: 20,
          marginBottom: insets.bottom + 20,
          paddingBottom: 5,
          paddingTop: 5,
          borderRadius: 15,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#16423C',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        lazy: true, // Enable lazy loading
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Learning"
        component={HomePage} // Replace with actual Learning screen
        options={{
          tabBarIcon: LearningIcon,
        }}
      />
      <Tab.Screen
        name="Download"
        component={HomePage} // Replace with actual Download screen
        options={{
          tabBarIcon: DownloadIcon,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreenWrapper}
        options={{
          tabBarIcon: SearchIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreenWithLogout}
        initialParams={{ onLogout }}
        options={{
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const MainTabNavigator = ({ onLogout }: { onLogout?: () => void }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">
        {(props) => <TabNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Notification" 
        component={NotificationPage}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="MyCourse" 
        component={MyCourse}
      />
      <Stack.Screen 
        name="OpenLibrary" 
        component={OpenLibrary}
      />
      <Stack.Screen 
        name="BookDetail" 
        component={BookDetailPage}
      />
      <Stack.Screen 
        name="Help" 
        component={HelpPage}
      />
      <Stack.Screen 
        name="HelpForm" 
        component={HelpFormPage}
      />
      <Stack.Screen 
        name="MyScheduled" 
        component={MyScheduled}
      />
      <Stack.Screen 
        name="CategorySubjects" 
        component={CategorySubjectsPage}
      />
      <Stack.Screen 
        name="SubjectTeachersPage" 
        component={SubjectTeachersPage}
      />
      <Stack.Screen 
        name="TutorDetailPage" 
        component={TutorDetailPage}
      />
      <Stack.Screen 
        name="CourseDetails" 
        component={CourseDetailsPage}
      />
      <Stack.Screen 
        name="VideoDetailsPage" 
        component={VideoDetailsPage}
      />
      <Stack.Screen 
        name="CourseVideoPage" 
        component={CourseVideoPage}
      />
      <Stack.Screen 
        name="YoutubeTypePlayer" 
        component={YoutubeTypePlayer}
      />
      <Stack.Screen 
        name="GeneralPolicy" 
        component={GeneralPolicyScreen}
      />
      <Stack.Screen 
        name="PolicyDetail" 
        component={PolicyDetailPage}
      />
      <Stack.Screen 
        name="HoursSpent" 
        component={HoursSpentPage}
      />
      <Stack.Screen 
        name="TrialBookingPage" 
        component={TrialBookingPage}
      />
      <Stack.Screen 
        name="TrialCheckoutPage" 
        component={TrialCheckoutPage}
      />

      <Stack.Screen 
        name="PaymentPage" 
        component={PaymentPage}
      />
      <Stack.Screen 
        name="MySchedule" 
        component={MySchedulePage}
      />
      <Stack.Screen 
        name="AllTutors" 
        component={AllTutorsPage}
      />
      <Stack.Screen 
        name="AllCourses" 
        component={AllCoursesPage}
      />
      <Stack.Screen 
        name="AiChatHelp" 
        component={AiChatHelpPage}
      />
    </Stack.Navigator>
  );
};

export default MainTabNavigator;