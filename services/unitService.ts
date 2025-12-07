import { API_BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Unit {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  imgPath: string;
  status: string;
  createdAt: string;
  course: {
    id: string;
    name: string;
  };
}

export interface UnitsResponse {
  result: Unit[];
  total: number;
}

export const getCourseUnits = async (courseId: string): Promise<UnitsResponse | null> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const url = `${API_BASE_URL}/unit/user?courseId=${courseId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch course units: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Course units fetch error:', error);
    return null;
  }
};