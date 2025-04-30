import api, { ApiResponse } from './api';
import endpoints from '../config/endpoints';
import { InDiningOrder, InDiningOrderItem } from '../redux/slices/inDiningOrderSlice';

// Types for API requests and responses
export interface GetInDiningOrdersResponse {
  orders: InDiningOrder[];
}

export interface PlaceInDiningOrderRequest {
  table_id: string;
  items: InDiningOrderItem[];
}

export interface UpdateInDiningOrderRequest {
  orderId: string;
  updates: Partial<InDiningOrder>;
}

/**
 * Service for in-dining order operations
 */
export const inDiningOrderService = {
  /**
   * Get all in-dining orders
   */
  getInDiningOrders: async (): Promise<any> => {
    try {
      const response = await api.get<GetInDiningOrdersResponse>(endpoints.inDiningOrder.get);
      let result:any = response.data;
      result = JSON.parse(result);
      console.log("response", result)
      return (result);
    } catch (error) {
      console.error('Error fetching in-dining orders:', error);
      throw error;
    }
  },

  /**
   * Get in-dining order by ID
   */
  getInDiningOrderById: async (orderId: string): Promise<InDiningOrder> => {
    try {
      const response = await api.get<InDiningOrder>(`${endpoints.inDiningOrder.get}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching in-dining order with ID ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Place a new in-dining order
   */
  placeInDiningOrder: async (orderData: PlaceInDiningOrderRequest): Promise<InDiningOrder> => {
    try {
      console.log("URL", endpoints.inDiningOrder.place)
      const response = await api.post<InDiningOrder>(endpoints.inDiningOrder.place, orderData);
      return response.data;
    } catch (error) {
      console.error('Error placing in-dining order:', error);
      throw error;
    }
  },

  /**
   * Update an existing in-dining order
   */
  updateInDiningOrder: async ({ orderId, updates }: UpdateInDiningOrderRequest): Promise<InDiningOrder> => {
    try {
      const response = await api.put<InDiningOrder>(
        `${endpoints.inDiningOrder.update}`, 
        updates
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating in-dining order with ID ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Cancel an in-dining order
   */
  cancelInDiningOrder: async (orderId: string): Promise<InDiningOrder> => {
    try {
      const response = await api.put<InDiningOrder>(
        `${endpoints.inDiningOrder.update}/${orderId}`, 
        { status: 'cancelled' }
      );
      return response.data;
    } catch (error) {
      console.error(`Error cancelling in-dining order with ID ${orderId}:`, error);
      throw error;
    }
  },
};

export default inDiningOrderService;
