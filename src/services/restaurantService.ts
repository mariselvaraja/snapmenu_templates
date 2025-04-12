/**
 * Restaurant service for handling restaurant-related API calls
 */

import api, { ApiResponse } from './api';
import endpoints from '../config/endpoints';

// Restaurant interface
export interface Restaurant {
  restaurant_id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  features: {
    delivery: boolean;
    pickup: boolean;
    reservation: boolean;
    online_ordering: boolean;
  };
  cuisine_type: string[];
  price_range: string;
  rating: number;
  review_count: number;
  domain: string;
}

/**
 * Service for handling restaurant-related operations
 */
export const restaurantService = {
  /**
   * Fetches restaurant information
   */
  getRestaurantInfo: async (): Promise<Restaurant> => {
    console.log('Fetching restaurant info from API');
    
    try {
      // Pass the specific restaurantid header
      const headers = {
        restaurantid: "2256b9a6-5d53-4b77-b6a0-539043489ad3"
      };
      console.log("3")
      const response = await api.get<Restaurant>(endpoints.restaurant.getInfo, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
      throw error;
    }
  },

  /**
   * Fetches restaurant information by domain
   * @deprecated Use getRestaurantInfo instead
   */
  getRestaurantByDomain: async (domain: string): Promise<Restaurant> => {
    console.log(`Fetching restaurant info for domain ${domain} from API`);
    
    try {
      // Pass the specific restaurantid header
      const headers = {
        restaurantid: "2256b9a6-5d53-4b77-b6a0-539043489ad3"
      };
      // Use getInfo instead of getByDomain
      console.log("4")
      const response = await api.get<Restaurant>(endpoints.restaurant.getInfo, { headers });
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurant info for domain ${domain}:`, error);
      throw error;
    }
  },
};

export default restaurantService;
