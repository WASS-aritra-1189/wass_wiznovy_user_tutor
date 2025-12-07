import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const getCountries = async (limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
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


export const getBudget = async (limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/budget/all?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Budgets fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch budgets',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getGoals = async (limit: number = 10, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/goal/all?limit=${limit}&offset=${offset}&status=ACTIVE`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Goals fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch goals',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getTopics = async (limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/topic/all?limit=${limit}&offset=${offset}&status=ACTIVE`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Topics fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch topics',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getLanguages = async (limit: number = 20, offset: number = 0): Promise<OnboardingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages/user?limit=${limit}&offset=${offset}&status=ACTIVE`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Topics fetched successfully',
        data: data.result || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch topics',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const updateUserDetails = async (userData: any): Promise<OnboardingResponse> => {
  try {
    const token = await getToken();
    const formData = new URLSearchParams();
    
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/user-details/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'User details updated successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to update user details',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};