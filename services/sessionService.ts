import { API_BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSession {
  id: string;
  userId: string;
  tutorId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: string;
  purchaseId: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  tutor?: {
    id: string;
    name?: string;
    profileImage?: string;
    [key: string]: any;
  };
}

export interface SessionsResponse {
  result: UserSession[];
  total: number;
}

export const getUserSessions = async (
  limit: number = 20,
  offset: number = 0,
  date?: string
): Promise<SessionsResponse | null> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    
    let url = `${API_BASE_URL}/sessions/my-sessions?limit=${limit}&offset=${offset}`;
    if (date) {
      url += `&date=${date}`;
    }
    
    console.log('🔍 Fetching user sessions:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('📡 Sessions response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Sessions fetch failed:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('✅ Sessions fetched:', data.total, 'sessions');
    return data;
  } catch (error) {
    console.error('💥 Sessions fetch error:', error);
    if (error instanceof Error) {
      console.error('💥 Sessions error message:', error.message);
    }
    return null;
  }
};

export interface RescheduleRequest {
  sessionId: string;
  newSessionDate: string;
  newStartTime: string;
  newEndTime: string;
}

export interface RescheduleResponse {
  message: string;
  session: UserSession;
  oldSchedule: {
    date: string;
    startTime: string;
    endTime: string;
  };
  newSchedule: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

export const rescheduleSession = async (
  rescheduleData: RescheduleRequest
): Promise<RescheduleResponse | null> => {
  try {
    console.log('🔄 Starting reschedule session...');
    console.log('📋 Reschedule data:', JSON.stringify(rescheduleData, null, 2));
    
    const token = await AsyncStorage.getItem('authToken');
    console.log('🔑 Token exists:', !!token);
    
    const url = `${API_BASE_URL}/sessions/reschedule`;
    console.log('🌐 API URL:', url);
    
    const requestBody = JSON.stringify(rescheduleData);
    console.log('📤 Request body:', requestBody);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: requestBody,
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);

    if (response.ok) {
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('✅ Parsed response:', JSON.stringify(jsonResponse, null, 2));
        return jsonResponse;
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        return null;
      }
    } else {
      console.error('❌ API Error - Status:', response.status);
      console.error('❌ API Error - Response:', responseText);
      
      try {
        const errorJson = JSON.parse(responseText);
        console.error('❌ Parsed error:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.error('❌ Could not parse error response as JSON:', e);
      }
      
      return null;
    }
  } catch (error) {
    console.error('💥 Reschedule network/other error:', error);
    if (error instanceof Error) {
      console.error('💥 Error message:', error.message);
      console.error('💥 Error stack:', error.stack);
    }
    return null;
  }
};

export interface CancelSessionResponse {
  message: string;
  refundEligible: boolean;
  refundProcessed: boolean;
  session: UserSession;
}

export const cancelSession = async (sessionId: string): Promise<CancelSessionResponse | null> => {
  try {
    console.log('🚫 Starting cancel session for ID:', sessionId);
    
    const token = await AsyncStorage.getItem('authToken');
    console.log('🔑 Token exists:', !!token);
    
    const url = `${API_BASE_URL}/sessions/cancel`;
    console.log('🌐 Cancel URL:', url);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ sessionId }),
    });

    console.log('📡 Cancel response status:', response.status);
    console.log('📡 Cancel response ok:', response.ok);
    
    const responseText = await response.text();
    console.log('📥 Cancel raw response:', responseText);

    if (response.ok) {
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('✅ Cancel parsed response:', JSON.stringify(jsonResponse, null, 2));
        return jsonResponse;
      } catch (parseError) {
        console.error('❌ Cancel JSON parse error:', parseError);
        return null;
      }
    } else {
      console.error('❌ Cancel API Error - Status:', response.status);
      console.error('❌ Cancel API Error - Response:', responseText);
      return null;
    }
  } catch (error) {
    console.error('💥 Cancel network/other error:', error);
    if (error instanceof Error) {
      console.error('💥 Cancel error message:', error.message);
      console.error('💥 Cancel error stack:', error.stack);
    }
    return null;
  }
};