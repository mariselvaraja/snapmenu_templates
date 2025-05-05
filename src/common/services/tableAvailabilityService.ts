/**
 * Table Availability service for handling Table Availability API calls
 */

import api, { ApiResponse } from './api';
import endpoints from '../config/endpoints';
import { ReservationPayload } from '../redux/slices/makeReservationSlice';

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

  /**
   * Makes a reservation
   */
  makeReservation: async (reservationData: ReservationPayload): Promise<any> => {
    console.log('Making reservation via API', reservationData);
    
    try {
      const response = await api.post<any>(endpoints.tableOrder.makeReservation, reservationData);
      return response.data;
    } catch (error) {
      console.error('Error making reservation:', error);
      throw error;
    }
  },
};

/**
 * Service for handling table status operations
 */
export const tableStatusService = {
  /**
   * Fetches table status information
   */
  getTableStatus: async (table_id:any): Promise<any> => {
    console.log('Fetching table status from API');
    
    try {
      const response = await api.get<any>(endpoints.tableOrder.status,{},table_id);
      return response.data;
    } catch (error) {
      console.error('Error fetching table status:', error);
      throw error;
    }
  },
};

export default tableAvailabilityService;
