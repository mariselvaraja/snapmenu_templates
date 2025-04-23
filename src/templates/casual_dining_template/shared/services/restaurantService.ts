/**
 * Restaurant service for handling restaurant data
 */

import api from './api';
import endpoints from '../config/endpoints';

export interface Restaurant {
  restaurant_id: string;
  working_hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  // Add other restaurant properties as needed
}

/**
 * Service for handling restaurant data
 */
export const restaurantService = {
  /**
   * Get restaurant information based on the current domain
   */
  getRestaurantInfo: async (): Promise<Restaurant> => {
    try {
      // Add the specific restaurantid header
      const headers = {
        restaurantid: "2256b9a6-5d53-4b77-b6a0-539043489ad3"
      };
      console.log("5")
      const response = await api.get<any>(endpoints.restaurant.getInfo);
      console.log('Restaurant API response:', response);
      
      // Check if response data is valid
      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        const errorMsg = 'Restaurant API returned empty data';
        console.warn(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Return the restaurant data
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
      // Return default restaurant data on error
      return {
        restaurant_id: 'default',
        working_hours: {
          monday: '9:00 AM - 10:00 PM',
          tuesday: '9:00 AM - 10:00 PM',
          wednesday: '9:00 AM - 10:00 PM',
          thursday: '9:00 AM - 10:00 PM',
          friday: '9:00 AM - 11:00 PM',
          saturday: '9:00 AM - 11:00 PM',
          sunday: '9:00 AM - 10:00 PM',
        }
      };
    }
  },
  
  /**
   * Get restaurant information by specific domain
   * @param domain - The domain to fetch restaurant information for
   * @deprecated Use getRestaurantInfo instead
   */
  getRestaurantByDomain: async (domain: string): Promise<Restaurant> => {
    try {
      // Use the request function directly to bypass the api.get method that adds headers from the store
      // This ensures we use our specific restaurant ID for this endpoint
      const url = endpoints.restaurant.getInfo;
      console.log("6")
      // Create request options with our specific restaurant ID header
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'restaurantid': '2256b9a6-5d53-4b77-b6a0-539043489ad3'
        }
      };
      
      // Make the request directly using fetch
      const fetchResponse = await fetch(url);
      
      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
      }
      
      const data = await fetchResponse.json();
      const response = { data, status: fetchResponse.status };
      console.log(`Restaurant API response for domain ${domain}:`, response);
      
      // Check if response data is valid
      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        const errorMsg = `Restaurant API returned empty data for domain: ${domain}`;
        console.warn(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Return the restaurant data
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurant info for domain ${domain}:`, error);
      // Return default restaurant data on error
      return {
        restaurant_id: 'default',
        working_hours: {
          monday: '9:00 AM - 10:00 PM',
          tuesday: '9:00 AM - 10:00 PM',
          wednesday: '9:00 AM - 10:00 PM',
          thursday: '9:00 AM - 10:00 PM',
          friday: '9:00 AM - 11:00 PM',
          saturday: '9:00 AM - 11:00 PM',
          sunday: '9:00 AM - 10:00 PM',
        }
      };
    }
  },
};

export default restaurantService;
