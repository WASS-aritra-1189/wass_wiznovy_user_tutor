import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface RegisterUserData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface VerifyOtpData {
  email: string;
  otp: string;
}

interface ResetPasswordData {
  email: string;
  newPassword: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const registerUser = async (userData: RegisterUserData): Promise<AuthResponse> => {
  try {
    console.log('API URL:', `${API_BASE_URL}/auth/user/register`);
    console.log('Request data:', userData);
    
    const formData = new URLSearchParams();
    formData.append('name', userData.name);
    formData.append('phoneNumber', userData.phoneNumber);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    const response = await fetch(`${API_BASE_URL}/auth/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Registration successful',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Registration failed',
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const loginUser = async (userData: LoginUserData): Promise<AuthResponse> => {
  try {
    console.log('API URL:', `${API_BASE_URL}/auth/user/login`);
    console.log('Request data:', userData);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    const response = await fetch(`${API_BASE_URL}/auth/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      console.log('Login successful, full response:', data);
      return {
        success: true,
        message: data.message || 'Login successful',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    console.log('API URL:', `${API_BASE_URL}/auth/logout`);
    
    const token = await getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers,
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Logout successful',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Logout failed',
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const forgotPassword = async (userData: ForgotPasswordData): Promise<AuthResponse> => {
  try {
    console.log('API URL:', `${API_BASE_URL}/auth/forgotPass`);
    console.log('Request data:', userData);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('role','USER')
    const response = await fetch(`${API_BASE_URL}/auth/forgotPass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Otp sent in email successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to send password reset email',
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const verifyOtp = async (userData: VerifyOtpData): Promise<AuthResponse> => {
  try {
    console.log('API URL:', `${API_BASE_URL}/auth/user/verify`);
    console.log('Request data:', userData);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('otp', userData.otp);
    formData.append('role', 'USER');
    
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'OTP verified successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Invalid OTP',
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const resetPassword = async (userData: ResetPasswordData): Promise<AuthResponse> => {
  try {
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('newPassword', userData.newPassword);
    formData.append('role', 'USER');
    const response = await fetch(`${API_BASE_URL}/auth/resetPass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Password reset successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to reset password',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const verifyRegistration = async (userData: VerifyOtpData): Promise<AuthResponse> => {
  try {
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('otp', userData.otp);
    
    const response = await fetch(`${API_BASE_URL}/auth/user/verify-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Registration verification successful, full response:', data);
      return {
        success: true,
        message: data.message || 'Registration verified successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to verify registration',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};