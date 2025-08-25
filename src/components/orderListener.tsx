import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshOrderHistorySilent, getOrderHistoryRequest } from '../common/redux/slices/orderHistorySlice';
import { clearCart } from '../common/redux/slices/inDiningCartSlice';
import { endpoints } from '../common/config/endpoints';
import { RootState } from '../common/store';

// Extended interface that includes all possible properties from API responses
interface ExtendedOrder {
  id?: string;
  dining_id?: number;
  table_id: string;
  items: any[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'preparing' | 'ready' | 'delivered' | 'void';
  totalAmount: number;
  createdAt?: string;
  // Additional fields that may come from API
  ordered_items?: any[];
  created_date?: string;
  dining_status?: string;
  total_amount?: string;
  void_reason?: string;
}

interface WebSocketMessage {
  type: string;
  restaurantId?: string;
  new_orders?: ExtendedOrder[];
  updated_order?: Array<{
    dining_id: number | string | string[];
    status: string;
    void_reason?: string;
  }>;
  message?: string;
}

const OrderListener: React.FC = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();
  const currentOrders = useSelector((state: RootState) => state.orderHistory.orders || []);
  const restaurant_id = sessionStorage.getItem('franchise_id');
  
  // Get WebSocket URL from endpoints configuration
  const websocketUrl = endpoints.webSocket.getNewOrdersV2+"?restaurant_id="+restaurant_id;
  const searchParams = new URLSearchParams(location.search);
  const tableFromQuery = searchParams.get('table');
  

  // Function to connect to WebSocket
  const connectWebSocket = (): WebSocket | null => {
    try {
      console.log('🔌 Connecting to WebSocket for dining orders...');
      const socket = new WebSocket(websocketUrl);
      
      socket.onopen = () => {
        console.log('✅ WebSocket connected for dining orders');
      };

      socket.onmessage = (event: MessageEvent) => {
        console.log('📨 Received message:', event.data);
        try {
          const parsedData: WebSocketMessage = JSON.parse(event.data);
          const type = parsedData.type;
          
          console.log(`🔍 Message type: ${type}`);
          
          // Only process dining type messages
          if (type === "dining") {
            console.log('🍽️ Processing dining message');
            handleDiningMessage(parsedData);
          } else {
            console.log(`⚠️ Ignoring non-dining message type: ${type || 'undefined'}`);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
          console.error('Raw message data:', event.data);
        }
      };

      socket.onerror = (error: Event) => {
        console.error('❌ WebSocket error:', error);
      };

      socket.onclose = () => {
        console.log('❎ WebSocket disconnected');
      };
      
      socketRef.current = socket;
      return socket;
    } catch (err) {
      console.error('❌ Failed to connect to WebSocket:', err);
      return null;
    }
  };

  // Function to disconnect from WebSocket
  const disconnectWebSocket = (): void => {
    console.log('🔌 Disconnecting from WebSocket...');
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      console.log('✅ WebSocket disconnected');
    }
  };

  /**
   * Handle new_orders format from WebSocket
   * Format: { new_orders: [order1, order2, ...], type: 'dining', restaurantId: 'xxx' }
   */
  const handleNewOrders = (newOrders: ExtendedOrder[]): void => {
    try {
      console.log(`🆕 Processing ${newOrders.length} new orders`);
      
      if (tableFromQuery) {
        dispatch(getOrderHistoryRequest(tableFromQuery));
      }
      
    } catch (error) {
      console.error('Error handling new_orders:', error);
    }
  };

  /**
   * Handle updated_orders format from WebSocket
   * Format: { updated_orders: [{dining_id: 107, status: 'preparing', void_reason?: 'Customer cancelled'}] }
   * Also handles: { updated_order: [{dining_id: ["607"], status: 'pending', void_reason?: 'Out of stock'}] }
   */
  const handleUpdatedOrders = (updatedOrders: Array<{ dining_id: number | string | string[]; status: string; void_reason?: string }>): void => {
    try {
      // Handle empty or invalid data
      if (!updatedOrders || !Array.isArray(updatedOrders) || updatedOrders.length === 0) {
        console.log('🔄 No orders to update or empty data received');
        // Don't clear orders when receiving empty updates - this can happen with void status updates
        // The order history should remain intact
        return;
      }
      
      console.log(`🔄 Processing ${updatedOrders.length} order status updates`);
      
      // Valid status values for type safety
      const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'preparing', 'ready', 'delivered', 'void'];
      
      // Track which orders were updated and which need to be created
      const updatedOrdersList = [...currentOrders];
      const newOrdersToCreate: ExtendedOrder[] = [];
      
      updatedOrders.forEach(update => {
        // Handle payment status updates - special case
        if (update && update.status === 'Payment Status updated') {
          console.log('💳 Processing PAYMENT STATUS UPDATED - refreshing API data');
          dispatch(clearCart());
          if (tableFromQuery) {
            dispatch(getOrderHistoryRequest(tableFromQuery));
          }
          return;
        }
        
        // Skip if update is malformed
        if (!update || update.dining_id === undefined || update.dining_id === null) {
          console.warn('Skipping malformed update:', update);
          return;
        }
        
        // Extract dining_id from various formats
        let diningId: number;
        if (Array.isArray(update.dining_id)) {
          // Handle array format ["607"]
          if (update.dining_id.length === 0) {
            console.warn('Empty dining_id array, skipping update');
            return;
          }
          
          const firstElement = update.dining_id[0];
          if (firstElement === null || firstElement === undefined) {
            console.warn('Null or undefined dining_id in array, skipping update');
            return;
          }
          
          diningId = parseInt(String(firstElement));
        } else if (typeof update.dining_id === 'string') {
          // Handle string format "607"
          diningId = parseInt(update.dining_id);
        } else if (typeof update.dining_id === 'number') {
          // Handle number format 607
          diningId = update.dining_id;
        } else {
          console.warn('Invalid dining_id type:', typeof update.dining_id, update.dining_id);
          return;
        }
        
        // Validate dining_id
        if (isNaN(diningId)) {
          console.warn('Invalid dining_id after parsing:', update.dining_id);
          return;
        }

        // Find existing order by dining_id - use type assertion for dining_id access
        const existingOrderIndex = updatedOrdersList.findIndex(order => {
          // First check if order has a dining_id field directly
          const extendedOrder = order as any;
          if (extendedOrder.dining_id !== undefined) {
            return extendedOrder.dining_id === diningId;
          }
          // Fallback: check if order.id matches dining_id (as string or number)
          const orderId = typeof order.id === 'string' ? parseInt(order.id) : order.id;
          return orderId === diningId;
        });
        
        // Validate and cast status to proper type
        const newStatus = validStatuses.includes(update.status) 
          ? update.status as 'pending' | 'processing' | 'completed' | 'cancelled' | 'preparing' | 'ready' | 'delivered' | 'void'
          : 'pending'; // Default fallback
        
        if (existingOrderIndex >= 0) {
          // Update existing order status and void reason if applicable
          console.log(`📋 Updating existing order ${updatedOrdersList[existingOrderIndex].id} status from '${updatedOrdersList[existingOrderIndex].status}' to '${update.status}'`);
          
          const updatedOrder = {
            ...updatedOrdersList[existingOrderIndex],
            status: newStatus
          };

          // Add void reason if the order is being voided
          if (newStatus === 'void' && update.void_reason) {
            console.log(`🚫 Adding void reason to order ${updatedOrder.id}: ${update.void_reason}`);
            (updatedOrder as any).void_reason = update.void_reason;
          }
          // Clear void reason if order status is changed from void to something else
          else if (newStatus !== 'void' && (updatedOrdersList[existingOrderIndex] as any).void_reason) {
            console.log(`✅ Clearing void reason from order ${updatedOrder.id} as status changed to ${newStatus}`);
            (updatedOrder as any).void_reason = undefined;
          }

          updatedOrdersList[existingOrderIndex] = updatedOrder;
          
          // If order is being voided, refresh from API to get complete void data
          if (newStatus === 'void') {
            console.log(`🔄 Order ${diningId} voided - refreshing from API for complete data`);
            setTimeout(() => {
              if (tableFromQuery) {
                dispatch(getOrderHistoryRequest(tableFromQuery));
              }
            }, 500); // Small delay to ensure WebSocket processing completes first
          }
        } else {
          // Create placeholder order for orders that don't exist locally
          console.log(`🆕 Creating placeholder order for dining_id ${diningId} with status '${update.status}'`);
          const placeholderOrder: ExtendedOrder = {
            id: diningId.toString(),
            dining_id: diningId,
            table_id: sessionStorage.getItem('table_id') || sessionStorage.getItem('Tablename') || 'unknown',
            items: [{
              id: Date.now(), // Temporary ID
              name: `Order #${diningId}`,
              price: 0,
              quantity: 1,
              image: ''
            }],
            status: newStatus,
            totalAmount: 0,
            createdAt: new Date().toISOString()
          };

          // Add void reason if the order is being voided
          if (newStatus === 'void' && update.void_reason) {
            console.log(`🚫 Adding void reason to placeholder order ${diningId}: ${update.void_reason}`);
            placeholderOrder.void_reason = update.void_reason;
          }
          
          newOrdersToCreate.push(placeholderOrder);
          
          // If placeholder order is voided, refresh from API to get complete data
          if (newStatus === 'void') {
            console.log(`🔄 Placeholder order ${diningId} voided - refreshing from API for complete data`);
            setTimeout(() => {
              if (tableFromQuery) {
                dispatch(getOrderHistoryRequest(tableFromQuery));
              }
            }, 500); // Small delay to ensure WebSocket processing completes first
          }
        }
      });
      
      // Add new placeholder orders to the list
      const finalOrdersList = [...updatedOrdersList, ...newOrdersToCreate as any];
      
      // Update Redux store with the modified orders
      dispatch(refreshOrderHistorySilent(finalOrdersList));
      
    } catch (error) {
      console.error('Error handling updated_orders:', error);
    }
  };

  // Function to handle dining messages
  const handleDiningMessage = (parsedData: WebSocketMessage | string): void => {
    console.log('🍽️ Handling dining message:', parsedData);
    
    // Handle payment status updated - clear cart and refresh API data
    if (parsedData === 'Payment Status updated' || (typeof parsedData === 'object' && parsedData.message === 'Payment Status updated')) {
      console.log(`💳 Processing PAYMENT STATUS UPDATED - refreshing API data`);
      // Clear the in-dining cart
      dispatch(clearCart());
      // Refresh order history from API
      if (tableFromQuery) {
        dispatch(getOrderHistoryRequest(tableFromQuery));
      }
      return;
    }

    if (typeof parsedData === 'object') {
      // Handle the new_orders format: { new_orders: [order1, order2, ...], type: 'dining', restaurantId: 'xxx' }
      if (parsedData.new_orders && Array.isArray(parsedData.new_orders) && parsedData.type === 'dining') {
        console.log(`🆕 Processing NEW_ORDERS (dining)`, parsedData.new_orders);
        handleNewOrders(parsedData.new_orders);
        return;
      }

      // Handle the updated_order format: { updated_order: [{dining_id: 107, status: 'ready'}] }
      // Only process if type is 'dining' or if type is not specified (backward compatibility)
      if (parsedData.updated_order && Array.isArray(parsedData.updated_order) && (!parsedData.type || parsedData.type === 'dining')) {
        console.log(`🔄 Processing UPDATED_ORDER (dining)`);
        handleUpdatedOrders(parsedData.updated_order);
        return;
      }
    }
  };

  // WebSocket connection management
  useEffect(() => {
    // Initial connection
    const socket = connectWebSocket();
    
    // Set up interval to reconnect every 5 minutes
    const reconnectInterval = setInterval(() => {
      console.log("🔄 Reconnecting WebSocket (5 minutes)");
      disconnectWebSocket();
      setTimeout(() => {
        connectWebSocket();
      }, 1000); // Small delay before reconnecting
    }, 300000); // 5 minutes
    
    // Clean up on component unmount
    return () => {
      clearInterval(reconnectInterval);
      disconnectWebSocket();
    };
  }, []); // Run once on mount

  // This component doesn't render anything
  return null;
};

export default OrderListener;
