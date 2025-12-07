import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface UploadProfileImageData {
  file: {
    uri: string;
    type: string;
    name: string;
  };
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const uploadProfileImage = async (imageData: UploadProfileImageData): Promise<ProfileResponse> => {
  try {
    const token = await getToken();
    const formData = new FormData();
    
    formData.append('file', {
      uri: imageData.file.uri,
      type: imageData.file.type,
      name: imageData.file.name,
    } as any);
    
    const response = await fetch(`${API_BASE_URL}/user-details/profileImage`, {
      method: 'put',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Profile image uploaded successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to upload profile image',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getWalkthrough = async () => {
  try {
    console.log('Making request to:', `${API_BASE_URL}/walk-through/all`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_BASE_URL}/walk-through/all`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Walkthrough data fetched successfully',
        data: data.result,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch walkthrough data',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getUserProfile = async (): Promise<ProfileResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/account/profile`, {
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
        message: 'Profile fetched successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch profile',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const updateUserProfile = async (profileData: any): Promise<ProfileResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/user-details/update`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Profile updated successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to update profile',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getCountries = async (limit: number = 50, offset: number = 0): Promise<ProfileResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/country/all?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Countries fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch countries',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};