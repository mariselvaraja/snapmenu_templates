/**
 * API service for making HTTP requests
 * This file provides a centralized way to make API calls with proper error handling
 */

import { environment } from '../config/endpoints';
import { getStoreState } from './storeAccess';

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
    const errorData = await response.json();
    return {
      status: response.status,
      message: errorData.message || response.statusText,
      errors: errorData.errors,
    };
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
    const data = await response.json();
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
  get: <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    // Get restaurant_id from Redux store if available
    const state = getStoreState();
    const restaurantId = state?.restaurant?.info?.restaurant_id || "2256b9a6-5d53-4b77-b6a0-539043489ad3";
    
    let headers : any = {restaurantId: restaurantId}
    return request<T>(url, { ...options, headers, method: 'GET' });
  },

  /**
   * Makes a POST request to the specified URL with the given body
   */
  post: <T>(url: string, body: any, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    // Get restaurant_id from Redux store if available
    const state = getStoreState();
    const restaurantId = state?.restaurant?.info?.restaurant_id || "2256b9a6-5d53-4b77-b6a0-539043489ad3";
    
    let headers = {};
    
    // Add restaurant header for placeOrder endpoint
    if (url.includes('/placeOrder')) {
      headers = {restaurantId: restaurantId};
    }
    
    return request<T>(url, {
      ...options,
      headers,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Makes a PUT request to the specified URL with the given body
   */
  put: <T>(url: string, body: any, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * Makes a PATCH request to the specified URL with the given body
   */
  patch: <T>(url: string, body: any, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /**
   * Makes a DELETE request to the specified URL
   */
  delete: <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return request<T>(url, { ...options, method: 'DELETE' });
  },
};

export default api;
