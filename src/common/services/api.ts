/**
 * API service for making HTTP requests
 * This file provides a centralized way to make API calls with proper error handling
 */

import { getStoreState } from './storeAccess';

// Log the current environment
console.log('Current environment:', import.meta.env.VITE_ENV);
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Default request options
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Handles API errors and formats them consistently
 */
const handleApiError = async (response: Response): Promise<ApiError> => {
  try {
    // Check if response has content before parsing as JSON
    const text = await response.text();
    
    if (!text) {
      return {
        status: response.status,
        message: response.statusText || 'Empty response received',
      };
    }
    
    try {
      const errorData = JSON.parse(text);
      return {
        status: response.status,
        message: errorData.message || response.statusText,
        errors: errorData.errors,
      };
    } catch (jsonError) {
      // If JSON parsing fails, return the text as the message
      return {
        status: response.status,
        message: text || response.statusText || 'Invalid JSON response',
      };
    }
  } catch (error) {
    return {
      status: response.status,
      message: response.statusText || 'An unknown error occurred',
    };
  }
};

/**
 * Makes an HTTP request to the specified URL with the given options
 */
const request = async <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    // Merge default options with provided options
    const requestOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    // Make the request
    const response = await fetch(url, requestOptions);

    // Handle error responses
    if (!response.ok) {
      const error = await handleApiError(response);
      throw error;
    }

    // Parse and return successful response
    // Check if response has content before parsing as JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      // Check if response has content
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } else {
      // For non-JSON responses, return the text
      data = await response.text();
    }
    
    return {
      data,
      status: response.status,
      message: 'Success',
    };
  } catch (error) {
    // Re-throw API errors
    if ((error as ApiError).status) {
      throw error;
    }

    // Handle network or other errors
    console.error('API request failed:', error);
    throw {
      status: 0,
      message: (error as Error).message || 'Network error occurred',
    };
  }
};

/**
 * API service with methods for different HTTP verbs
 */
export const api = {
  /**
   * Makes a GET request to the specified URL
   */
  get: <T>(url: string, options: RequestInit = {}, query: Record<string, any> = {}): Promise<ApiResponse<T>> => {
    // Get restaurant_id from Redux store if available
    
    const restaurantId = sessionStorage.getItem("franchise_id");
    
    // Merge headers from options with default headers
    const mergedHeaders = {
      ...((options.headers as Record<string, string>) || {}),
      // Add restaurantid if it's not already provided in options
      ...(restaurantId && { restaurantid: restaurantId }),
    };
    
    // Handle query parameters
    let finalUrl = url;
    const queryParams = new URLSearchParams();
    
    // Add query parameters if they exist
    if (Object.keys(query).length > 0) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      // Append query string to URL (handling existing query parameters)
      const queryString = queryParams.toString();
      if (queryString) {
        finalUrl += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    
    return request<T>(finalUrl, { 
      ...options,
      headers: mergedHeaders, 
      method: 'GET' 
    });
  },

  /**
   * Makes a POST request to the specified URL with the given body
   */
  post: <T>(url: string, body: any, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    // Get restaurant_id from Redux store if available
    const restaurantId = sessionStorage.getItem("franchise_id");
    
    // Merge headers from options with default headers
    const mergedHeaders = {
      ...((options.headers as Record<string, string>) || {}),
    };
    
    // Add restaurant header if not already provided
    if (restaurantId && !(options.headers && (options.headers as Record<string, string>).restaurantid)) {
      mergedHeaders.restaurantid = restaurantId;
    }
    
    return request<T>(url, {
      ...options,
      headers: mergedHeaders,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Makes a PUT request to the specified URL with the given body
   */
  put: <T>(url: string, body: any, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    // Get restaurant_id from Redux store if available
    const state = getStoreState();
    const restaurantId = sessionStorage.getItem("franchise_id");
    
    // Merge headers from options with default headers
    const mergedHeaders = {
      ...((options.headers as Record<string, string>) || {}),
      ...(restaurantId && { restaurantid: restaurantId }),
    };
    
    return request<T>(url, {
      ...options,
      headers: mergedHeaders,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * Makes a PATCH request to the specified URL with the given body
   */
  patch: <T>(url: string, body: any, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    // Get restaurant_id from Redux store if available

    const restaurantId = sessionStorage.getItem("franchise_id");
    
    // Merge headers from options with default headers
    const mergedHeaders = {
      ...((options.headers as Record<string, string>) || {}),
      ...(restaurantId && { restaurantid: restaurantId }),
    };
    
    return request<T>(url, {
      ...options,
      headers: mergedHeaders,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /**
   * Makes a DELETE request to the specified URL
   */
  delete: <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    // Get restaurant_id from Redux store if available

    const restaurantId =  sessionStorage.getItem("franchise_id");
    
    // Merge headers from options with default headers
    const mergedHeaders = {
      ...((options.headers as Record<string, string>) || {}),
      ...(restaurantId && { restaurantid: restaurantId }),
    };
    
    return request<T>(url, { 
      ...options, 
      headers: mergedHeaders,
      method: 'DELETE' 
    });
  },
};

export default api;
