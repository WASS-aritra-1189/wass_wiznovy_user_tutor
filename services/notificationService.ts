import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

export interface Notification {
  id: number;
  title: string;
  desc: string;
  type: string;
  read: boolean;
  createdAt: string;
  accountId: string;
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  result?: Notification[];
  total?: number;
}

export const getNotifications = async (limit: number = 50, offset: number = 0): Promise<NotificationResponse> => {
  try {
    const token = await getToken();
    const url = `${API_BASE_URL}/notifications?limit=${limit}&offset=${offset}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        result: data.result || [],
        total: data.total || 0,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch notifications',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};