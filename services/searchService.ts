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

const appendArrayParam = (params: URLSearchParams, key: string, value: any) => {
  if (value && value.length > 0) {
    params.append(key, Array.isArray(value) ? value.join(',') : value);
  }
};

const appendPriceParam = (params: URLSearchParams, key: string, value: any) => {
  if (value !== undefined && value !== null) {
    params.append(key, value.toString());
  }
};

const buildSearchParams = (filters: any): URLSearchParams => {
  const params = new URLSearchParams();
  params.append('keyword', filters.keyword.trim());
  appendArrayParam(params, 'country', filters.countries);
  appendArrayParam(params, 'subject', filters.subjects);
  appendArrayParam(params, 'level', filters.expertiseLevels);
  appendArrayParam(params, 'rating', filters.ratings);
  appendPriceParam(params, 'minPrice', filters.minPrice);
  appendPriceParam(params, 'maxPrice', filters.maxPrice);
  return params;
};

export const performFilteredSearch = async (filters: any) => {
  try {
    if (!filters.keyword || filters.keyword.trim() === '') {
      console.warn('No keyword provided for filtered search');
      return {
        success: true,
        message: 'No keyword provided',
        data: []
      };
    }

    const params = buildSearchParams(filters);
    const url = `${API_BASE_URL}/global-search?${params.toString()}`;
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