import { API_BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQResponse {
  result: FAQ[];
  total: number;
}

export const getUserFAQs = async (): Promise<FAQResponse | null> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const url = `${API_BASE_URL}/faqs/user`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch FAQs: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('FAQ fetch error:', error);
    return null;
  }
};