/**
 * Table Availability service for handling Table Availability API calls
 */

import api, { ApiResponse } from './api';
import endpoints from '../config/endpoints';

/**
 * Service for handling table availability operations
 */
export const tableAvailabilityService = {
  /**
   * Fetches table availability information
   */
  getTableAvailability: async (): Promise<any> => {
    console.log('Fetching table availability from API');
    
    try {
      const response = await api.get<any>(endpoints.tableOrder.availability);
      return response.data;
    } catch (error) {
      console.error('Error fetching table availability:', error);
      throw error;
    }
  },
};

export default tableAvailabilityService;