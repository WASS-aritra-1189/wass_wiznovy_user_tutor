import { API_BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BookingRequest {
  tutorId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: 'TRIAL' | 'REGULAR';
  duration?: number;
  notes?: string;
}

export interface BookingResponse {
  userId: string;
  tutorId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: number;
  purchaseId: string;
  status: string;
  notes: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const bookSession = async (bookingData: BookingRequest): Promise<BookingResponse | null> => {
  try {
      const token = await AsyncStorage.getItem('authToken');
      const url = `${API_BASE_URL}/sessions/book`;
      const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
     if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Booking failed: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};