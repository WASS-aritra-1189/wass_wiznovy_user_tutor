import { API_BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TimeSlot {
  start: string;
  end: string;
  availabilityId: string;
  dayOfWeek: string;
  sessionDuration: number;
  bufferTime: number;
  price: number;
}

export interface AvailabilityResponse {
  tutorId: string;
  date: string;
  sessionDuration: number;
  bufferTime: number;
  totalSlots: number;
  slots: TimeSlot[];
}

export const getTutorAvailableSlots = async (tutorId: string, date: string): Promise<AvailabilityResponse | null> => {
  try {
    
    
    const url = `${API_BASE_URL}/tutor-availability/available-slots/${tutorId}/${date}`;
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });


    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    
    return data;
  } catch (error) {
    console.error('Error fetching tutor available slots:', error instanceof Error ? error.message : error);
    return null;
  }
};