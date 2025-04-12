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
      
      // Check if response data is valid
      if (!response.data) {
        console.warn('Restaurant API returned empty data');
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
};

export default restaurantService;
