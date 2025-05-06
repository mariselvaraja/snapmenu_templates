import api from './api';
import endpoints from '../config/endpoints';
import { InDiningOrder } from '../redux/slices/inDiningOrderSlice';

// Types for API requests and responses
export interface GetOrderHistoryRequest {
  table_id: string;
}

export interface GetOrderHistoryResponse {
  orders: InDiningOrder[];
}

/**
 * Service for order history operations
 */
export const orderHistoryService = {
  /**
   * Get order history for a specific table
   */
  getOrderHistory: async (tableId: string): Promise<InDiningOrder[]> => {
    try {
      const response = await api.get<GetOrderHistoryResponse>(
        endpoints.inDiningOrder.getHistory,
        {},
        { table_id: tableId }
      );
      
      let result: any = response.data;
      console.log("Order history response", result);
      
      return result;
    } catch (error) {
      console.error(`Error fetching order history for table ${tableId}:`, error);
      throw error;
    }
  },
};

export default orderHistoryService;
