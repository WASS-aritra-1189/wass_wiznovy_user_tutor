// Navigation parameter types for the optimized structure

export type AuthStackParamList = {
  Splash: undefined;
  Walkthrough: undefined;
  Auth: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OtpVerification: { email: string };
  ResetPassword: { email: string };
  Onboarding: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Learning: undefined;
  Download: undefined;
  Search: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Notification: undefined;
  MyCourse: undefined;
  OpenLibrary: undefined;
  BookDetail: { book: any };
  Help: undefined;
  HelpForm: undefined;
  MyScheduled: undefined;
  CategorySubjects: { categoryMainImage?: string; tutors?: any[] };
  SubjectTeachersPage: { subjectTitle?: string; tutors?: any[] };
  TutorDetailPage: { tutor?: any };
  CourseDetails: { course?: any };
  VideoDetailsPage: { course?: any };
  CourseVideoPage: { video?: any };
  YoutubeTypePlayer: undefined;
  GeneralPolicy: undefined;
  PolicyDetail: { title: string; content: string };
  HoursSpent: undefined;
  TrialBookingPage: { tutorData?: any };
  TrialCheckoutPage: { tutorData?: any; selectedDuration?: number; selectedDate?: string; selectedTimeSlot?: string };

  PaymentPage: { tutorData?: any; selectedDate?: string; selectedTime?: string; selectedDuration?: number; selectedSlot?: any; bookingType?: string };
  MySchedule: undefined;
  AllTutors: { subject?: string };
  AllCourses: undefined;
};

export type RootStackParamList = AuthStackParamList & MainTabParamList;