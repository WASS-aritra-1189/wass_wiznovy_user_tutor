import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface SearchResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface SearchSuggestion {
  id: string;
  title: string;
  type: string;
}

export interface SearchSuggestionsResponse {
  success: boolean;
  data: SearchSuggestion[];
  message?: string;
}

export const getSearchSuggestions = async (keyword: string): Promise<SearchSuggestionsResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/global-search/suggestions?keyword=${encodeURIComponent(keyword)}`, {
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
        data: data || [],
      };
    } else {
      return {
        success: false,
        data: [],
        message: data.message || 'Failed to fetch suggestions',
      };
    }
  } catch (error) {
    console.error('Search suggestions error:', error);
    return {
      success: false,
      data: [],
      message: 'Failed to fetch search suggestions'
    };
  }
};

export const performGlobalSearch = async (keyword: string): Promise<SearchResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/global-search?keyword=${encodeURIComponent(keyword)}`, {
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
        message: 'Search completed successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Search failed',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getAllTutors = async (): Promise<SearchResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/tutor-details/all`, {
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
        message: 'Tutors fetched successfully',
        data: data || [],
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch tutors',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getAllSubjects = async (): Promise<SearchResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/subjects/all`, {
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
        message: 'Subjects fetched successfully',
        data: data.result || [],
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch subjects',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getAllCourses = async (): Promise<SearchResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/course`, {
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
        message: 'Courses fetched successfully',
        data: data.result || [],
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch courses',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getPaginatedCourses = async (limit: number = 10, offset: number = 0): Promise<SearchResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/course?limit=${limit}&offset=${offset}&status=APPROVED`, {
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
        message: 'Courses fetched successfully',
        data: data.result || [],
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch courses',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getSubjectCounts = async (): Promise<SearchResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/global-search/subject-total-count`, {
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
        message: 'Subject counts fetched successfully',
        data: data || [],
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch subject counts',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getTutorCountsByCountry = async (): Promise<SearchResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/global-search/tutor-per-country`, {
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
        message: 'Country tutor counts fetched successfully',
        data: data || [],
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch country tutor counts',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getExpertiseCounts = async (): Promise<SearchResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/global-search/expertise-count`, {
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
        message: 'Expertise counts fetched successfully',
        data: data || [],
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch expertise counts',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const getRatingCounts = async (): Promise<SearchResponse> => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/rating/global-count`, {
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
        message: 'Rating counts fetched successfully',
        data: data || {},
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch rating counts',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const performFilteredSearch = async (filters: any) => {
  try {
    const baseUrl = `${API_BASE_URL}/global-search`;
    const params = new URLSearchParams();
    
    // Required keyword parameter from search input
    if (filters.keyword && filters.keyword.trim() !== '') {
      params.append('keyword', filters.keyword.trim());
    } else {
      // If no keyword provided, return empty results or handle as needed
      console.warn('No keyword provided for filtered search');
      return {
        success: true,
        message: 'No keyword provided',
        data: []
      };
    }
    
    // Optional filter parameters
    if (filters.countries && filters.countries.length > 0) {
      params.append('country', Array.isArray(filters.countries) ? filters.countries.join(',') : filters.countries);
    }
    
    if (filters.subjects && filters.subjects.length > 0) {
      params.append('subject', Array.isArray(filters.subjects) ? filters.subjects.join(',') : filters.subjects);
    }
    
    if (filters.expertiseLevels && filters.expertiseLevels.length > 0) {
      params.append('level', Array.isArray(filters.expertiseLevels) ? filters.expertiseLevels.join(',') : filters.expertiseLevels);
    }
    
    if (filters.ratings && filters.ratings.length > 0) {
      params.append('rating', Array.isArray(filters.ratings) ? filters.ratings.join(',') : filters.ratings);
    }
    
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      params.append('minPrice', filters.minPrice.toString());
    }
    
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      params.append('maxPrice', filters.maxPrice.toString());
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    console.log('🔍 Filter API URL:', url);
    
    const token = await getToken();
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
        message: 'Filtered search completed successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Filtered search failed',
      };
    }
  } catch (error) {
    console.error('Error performing filtered search:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};