import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface TutorDetailsResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const getTutorDetails = async (tutorId: string): Promise<TutorDetailsResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/tutor-details/${tutorId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('Tutor Details API Response:', data);

    if (response.ok) {
      return {
        success: true,
        message: 'Tutor details fetched successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch tutor details',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};