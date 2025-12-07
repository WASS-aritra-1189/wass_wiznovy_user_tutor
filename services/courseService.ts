import { API_BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CourseDetail {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  price: string;
  discountPrice?: string;
  validityDays: number;
  accessType: string;
  status: string;
  totalDuration: string;
  totalLectures: number;
  authorMessage: string;
  startDate: string;
  endDate: string;
  averageRating: string;
  totalRatings: number;
  subjectId: string;
  languageId: string;
  tutorId: string;
  createdAt: string;
  subject: {
    id: string;
    name: string;
  };
  language: {
    id: string;
    name: string;
  };
  tutor: {
    id: string;
    tutorDetail: {
      name: string;
      tutorId: string;
      profileImage: string;
      bio: string;
    };
  };
}

export const getCourseDetails = async (courseId: string): Promise<CourseDetail | null> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const url = `${API_BASE_URL}/course/${courseId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch course details: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Course details fetch error:', error);
    return null;
  }
};