import api, { ApiResponse } from './api';
import endpoints from '../config/endpoints';
import { InDiningOrder, InDiningOrderItem } from '../redux/slices/inDiningOrderSlice';

// Types for API requests and responses
export interface GetInDiningOrdersResponse {
  orders: InDiningOrder[];
}

export interface GetInDiningOrderHistoryRequest {
  table_id: string;
  type: string;
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
  getInDiningOrders: async (tableId?: string): Promise<any> => {
    try {
      if (tableId) {
        // If table ID is provided, get orders for specific table
        const response = await api.get<GetInDiningOrdersResponse>(
          endpoints.inDiningOrder.getHistory,
          {},
          { table_id: tableId }
        );
        let result:any = response.data;
        console.log("Service response for table", tableId, result);
        
        // Ensure we return an array, even if empty
        if (!result) {
          console.log("No result, returning empty array");
          return [];
        }
        
        // If result is already an array, return it
        if (Array.isArray(result)) {
          console.log("Result is array:", result);
          return result;
        }
        
        // If result has orders property, return that
        if (result.orders && Array.isArray(result.orders)) {
          console.log("Result has orders property:", result.orders);
          return result.orders;
        }
        
        // If result is a string, try to parse it
        if (typeof result === 'string') {
          try {
            const parsed = JSON.parse(result);
            if (Array.isArray(parsed)) {
              console.log("Parsed string to array:", parsed);
              return parsed;
            }
            if (parsed.orders && Array.isArray(parsed.orders)) {
              console.log("Parsed string has orders property:", parsed.orders);
              return parsed.orders;
            }
          } catch (parseError) {
            console.error("Error parsing result string:", parseError);
          }
        }
        
        console.log("Fallback: returning empty array");
        return [];
      } else {
        // Get all orders
        const response = await api.get<GetInDiningOrdersResponse>(endpoints.inDiningOrder.get);
        let result:any = response.data;
        
        if (typeof result === 'string') {
          try {
            result = JSON.parse(result);
          } catch (parseError) {
            console.error("Error parsing result:", parseError);
            return [];
          }
        }
        
        console.log("Service response for all orders:", result);
        
        // Ensure we return an array
        if (Array.isArray(result)) {
          return result;
        }
        if (result && Array.isArray(result.orders)) {
          return result.orders;
        }
        
        return [];
      }
    } catch (error) {
      console.error('Error fetching in-dining orders:', error);
      throw error;
    }
  },

  /**
   * Get in-dining order history for a specific table
   */
  getInDiningOrderHistory: async (tableId: string): Promise<any> => {
    try {
      const response = await api.get<GetInDiningOrdersResponse>(
        endpoints.inDiningOrder.getHistory,
        {},
        { table_id: tableId }
      );
      let result:any = response.data;

      
      console.log("history response", result);
      return (result);
    } catch (error) {
      console.error(`Error fetching in-dining order history for table ${tableId}:`, error);
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
