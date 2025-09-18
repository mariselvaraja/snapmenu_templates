import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  
  // Get WebSocket URL from endpoints configuration
  const websocketUrl = endpoints.webSocket.getNewOrdersV2+"?restaurant_id="+restaurant_id;
  
  // Extract table ID from URL path parameter
  useEffect(() => {
    // Extract table ID from URL path parameter
    // Example URL: /placeindiningorder/1c45eee9-e002-4b07-9968-4280f7904ba7/162aac7c-b57a-4e2b-b3c0-da930add7e97/e5b9767f-f2ed-402d-88f7-f1eea50c6fb4
    // The table ID is the last path segment
    
    const pathSegments = location.pathname.split('/').filter(segment => segment.length > 0);
    const tableId = pathSegments[pathSegments.length - 1];
    
    // Set table ID if it exists and is not empty
    if (tableId && tableId.length > 0) {
      setTableNumber(tableId);
    } else {
      setTableNumber(null);
    }
  }, [location]);
  

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
      
      if (tableNumber) {
        dispatch(getOrderHistoryRequest(tableNumber));
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
      // const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'preparing', 'ready', 'delivered', 'void'];
      
      // Track which orders were updated and which need to be created
      const updatedOrdersList = [...currentOrders];
      const newOrdersToCreate: ExtendedOrder[] = [];
      if (tableNumber) {
        dispatch(getOrderHistoryRequest(tableNumber));
      }
      updatedOrders.forEach(update => {
        // Handle payment status updates - special case
        if (update && update.status === 'Payment Status updated') {
          console.log('💳 Processing PAYMENT STATUS UPDATED - refreshing API data');
          dispatch(clearCart());
         
          return;
        }
      })
      
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
      if (tableNumber) {
        dispatch(getOrderHistoryRequest(tableNumber));
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

  // Order history polling every 15 seconds
  useEffect(() => {
    if (!tableNumber) return;

    // Set up interval to fetch order history every 15 seconds
    const orderHistoryInterval = setInterval(() => {
      console.log("🔄 Polling order history (15 seconds)");
      dispatch(getOrderHistoryRequest(tableNumber));
    }, 15000); // 15 seconds

    // Clean up interval on component unmount or when tableNumber changes
    return () => {
      clearInterval(orderHistoryInterval);
    };
  }, [tableNumber, dispatch]); // Re-run when tableNumber or dispatch changes

  // This component doesn't render anything
  return null;
};

export default OrderListener;
