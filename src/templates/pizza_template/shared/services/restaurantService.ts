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
   * Get restaurant information
   */
  getRestaurantInfo: async (): Promise<Restaurant> => {
    try {
      const response = await api.get<any>(endpoints.restaurant.getInfo);
      console.log('Restaurant API response:', response);
      
      // Return the restaurant data
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
      throw error;
    }
  },
};

export default restaurantService;
