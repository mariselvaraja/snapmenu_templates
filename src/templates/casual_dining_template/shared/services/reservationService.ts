import { api } from './api';
import { BookingData } from '../components/reservation';

// Define response types
export interface TableAvailabilityResponse {
  availableTables: number[];
  bookedTables: number[];
}

export interface ReservationResponse {
  id: string;
  tableId: number;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  specialRequests?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

// Reservation service functions
export const reservationService = {
  /**
   * Get available tables for a specific date and time
   */
  getTableAvailability: async (date: string, time: string): Promise<TableAvailabilityResponse> => {
    try {
      // In a real application, this would be an API call
      // return await api.get(`/reservations/availability?date=${date}&time=${time}`);
      
      // Mock response for demonstration
      return {
        availableTables: [1, 2, 3, 4, 5, 6],
        bookedTables: [7, 8]
      };
    } catch (error) {
      console.error('Error fetching table availability:', error);
      throw error;
    }
  },

  /**
   * Create a new reservation
   */
  createReservation: async (bookingData: BookingData): Promise<ReservationResponse> => {
    try {
      // In a real application, this would be an API call
      // return await api.post('/reservations', bookingData);
      
      // Mock response for demonstration
      return {
        id: Math.random().toString(36).substring(2, 15),
        ...bookingData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  /**
   * Get reservation by ID
   */
  getReservation: async (id: string): Promise<ReservationResponse> => {
    try {
      // In a real application, this would be an API call
      // return await api.get(`/reservations/${id}`);
      
      // Mock response for demonstration
      return {
        id,
        tableId: 6,
        date: '22',
        time: '19:00',
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        specialRequests: 'No special requests',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching reservation:', error);
      throw error;
    }
  },

  /**
   * Cancel reservation
   */
  cancelReservation: async (id: string): Promise<{ success: boolean }> => {
    try {
      // In a real application, this would be an API call
      // return await api.delete(`/reservations/${id}`);
      
      // Mock response for demonstration
      return { success: true };
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }
};
