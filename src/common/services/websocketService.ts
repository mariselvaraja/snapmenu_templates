import { store } from '../store';
import { refreshOrderHistorySilent } from '../redux/slices/orderHistorySlice';
import { InDiningOrder } from '../redux/slices/inDiningOrderSlice';

export interface WebSocketMessage {
  type: 'order_update' | 'order_status_change' | 'new_order' | 'error';
  data: any;
  timestamp?: string;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private restaurantId: string | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor() {
    this.handleMessage = this.handleMessage.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Connect to WebSocket for in-dining orders
   */
  connect(restaurantId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;
      this.restaurantId = restaurantId;

      const wsUrl = `wss://restaurant-view.raghavan-7fc.workers.dev/websocketForOrders?restaurant_id=${restaurantId}&type=indining`;
      
      try {
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          this.handleOpen();
          resolve();
        };
        
        this.ws.onmessage = this.handleMessage;
        this.ws.onclose = this.handleClose;
        this.ws.onerror = (error) => {
          this.handleError(error);
          reject(error);
        };

        // Timeout for connection
        setTimeout(() => {
          if (this.isConnecting) {
            this.isConnecting = false;
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000); // 10 seconds timeout

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    console.log(`🔌 WebSocket DISCONNECTING for restaurant ID: ${this.restaurantId}`);
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
      
      this.ws = null;
    }

    this.isConnecting = false;
    this.reconnectAttempts = 0;
    
    console.log(`🔌 WebSocket DISCONNECTED for restaurant ID: ${this.restaurantId}`);
    this.restaurantId = null;
  }

  /**
   * Add event listener
   */
  addEventListener(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event: string, callback: (data: any) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen(): void {
    console.log(`🔌 WebSocket CONNECTED for restaurant ID: ${this.restaurantId}`);
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    
    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Emit connection event
    this.emitEvent('connected', { restaurantId: this.restaurantId });
  }

  /**
   * Handle WebSocket message event
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const rawData = JSON.parse(event.data);
      console.log(`📨 WebSocket MESSAGE RECEIVED for restaurant ID: ${this.restaurantId}`, {
        rawData,
        timestamp: new Date().toISOString()
      });

      // Handle the updated_order format: { updated_order: [{dining_id: 107, status: 'ready'}] }
      if (rawData.updated_order && Array.isArray(rawData.updated_order)) {
        console.log(`🔄 Processing UPDATED_ORDER for restaurant ID: ${this.restaurantId}`);
        this.handleUpdatedOrders(rawData.updated_order);
        return;
      }

      // Handle standard message format
      const message: WebSocketMessage = rawData;
      
      switch (message.type) {
        case 'order_update':
          console.log(`🔄 Processing ORDER UPDATE for restaurant ID: ${this.restaurantId}`);
          this.handleOrderUpdate(message.data);
          break;
        case 'order_status_change':
          console.log(`📋 Processing ORDER STATUS CHANGE for restaurant ID: ${this.restaurantId}`);
          this.handleOrderStatusChange(message.data);
          break;
        case 'new_order':
          console.log(`🆕 Processing NEW ORDER for restaurant ID: ${this.restaurantId}`);
          this.handleNewOrder(message.data);
          break;
        case 'error':
          console.log(`❌ Processing ERROR for restaurant ID: ${this.restaurantId}`);
          this.handleServerError(message.data);
          break;
        default:
          console.warn(`⚠️ Unknown WebSocket message type for restaurant ID: ${this.restaurantId}:`, message.type);
      }

      // Emit generic message event
      this.emitEvent('message', message);
    } catch (error) {
      console.error(`❌ Error parsing WebSocket message for restaurant ID: ${this.restaurantId}:`, error);
    }
  }

  /**
   * Handle WebSocket close event
   */
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event.code, event.reason);
    this.isConnecting = false;

    // Emit disconnection event
    this.emitEvent('disconnected', { code: event.code, reason: event.reason });

    // Attempt to reconnect if not manually closed
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts && this.restaurantId) {
      this.attemptReconnect();
    }
  }

  /**
   * Handle WebSocket error event
   */
  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.isConnecting = false;
    
    // Emit error event
    this.emitEvent('error', error);
  }

  /**
   * Handle updated_orders format from WebSocket
   * Format: { updated_orders: [{dining_id: 107, status: 'preparing'}] }
   * Also handles: { updated_order: [{dining_id: ["607"], status: 'pending'}] }
   */
  private handleUpdatedOrders(updatedOrders: Array<{dining_id: number | string | string[], status: string}>): void {
    try {
      console.log(`🔄 Processing ${updatedOrders.length} order status updates`);
      
      // Get current orders from Redux store
      const currentState = store.getState();
      const currentOrders = currentState.orderHistory.orders;
      
      // Valid status values for type safety
      const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'preparing', 'ready', 'delivered'] as const;
      type ValidStatus = typeof validStatuses[number];
      
      // Track which orders were updated and which need to be created
      const updatedOrdersList = [...currentOrders];
      const newOrdersToCreate: InDiningOrder[] = [];
      
      updatedOrders.forEach(update => {
        // Extract dining_id from various formats
        let diningId: number;
        if (Array.isArray(update.dining_id)) {
          // Handle array format ["607"]
          diningId = parseInt(update.dining_id[0]);
        } else if (typeof update.dining_id === 'string') {
          // Handle string format "607"
          diningId = parseInt(update.dining_id);
        } else {
          // Handle number format 607
          diningId = update.dining_id;
        }

        // Find existing order by dining_id
        const existingOrderIndex = updatedOrdersList.findIndex(order => {
          // First check if order has a dining_id field directly
          if ((order as any).dining_id !== undefined) {
            return (order as any).dining_id === diningId;
          }
          // Fallback: check if order.id matches dining_id (as string or number)
          const orderId = typeof order.id === 'string' ? parseInt(order.id) : order.id;
          return orderId === diningId;
        });
        
        // Validate and cast status to proper type
        const newStatus = validStatuses.includes(update.status as ValidStatus) 
          ? update.status as ValidStatus 
          : 'pending' as ValidStatus; // Default fallback
        
        if (existingOrderIndex >= 0) {
          // Update existing order status
          console.log(`📋 Updating existing order ${updatedOrdersList[existingOrderIndex].id} status from '${updatedOrdersList[existingOrderIndex].status}' to '${update.status}'`);
          updatedOrdersList[existingOrderIndex] = {
            ...updatedOrdersList[existingOrderIndex],
            status: newStatus
          };
        } else {
          // Create placeholder order for orders that don't exist locally
          console.log(`🆕 Creating placeholder order for dining_id ${diningId} with status '${update.status}'`);
          const placeholderOrder: InDiningOrder = {
            id: diningId.toString(),
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
          
          newOrdersToCreate.push(placeholderOrder);
        }
      });
      
      // Add new placeholder orders to the list
      const finalOrdersList = [...updatedOrdersList, ...newOrdersToCreate];
      
      // Update Redux store with the modified orders
      store.dispatch(refreshOrderHistorySilent(finalOrdersList));
      
      // Emit events for each status update
      updatedOrders.forEach(update => {
        // Extract dining_id from various formats
        let diningId: number;
        if (Array.isArray(update.dining_id)) {
          diningId = parseInt(update.dining_id[0]);
        } else if (typeof update.dining_id === 'string') {
          diningId = parseInt(update.dining_id);
        } else {
          diningId = update.dining_id;
        }
        
        this.emitEvent('order_status_change', {
          dining_id: diningId,
          status: update.status,
          orderId: diningId.toString()
        });
      });
      
      // Emit generic order update event
      this.emitEvent('order_update', { updated_orders: updatedOrders });
      
    } catch (error) {
      console.error('Error handling updated_orders:', error);
    }
  }

  /**
   * Handle order update from WebSocket
   */
  private handleOrderUpdate(data: any): void {
    try {
      // Update Redux store with new order data using silent refresh (no loading state)
      if (data.orders && Array.isArray(data.orders)) {
        store.dispatch(refreshOrderHistorySilent(data.orders as InDiningOrder[]));
      } else if (data.order) {
        // Single order update - get current orders and update the specific one
        const currentState = store.getState();
        const currentOrders = currentState.orderHistory.orders;
        const updatedOrders = currentOrders.map(order => 
          order.id === data.order.id ? { ...order, ...data.order } : order
        );
        store.dispatch(refreshOrderHistorySilent(updatedOrders));
      }

      // Emit order update event
      this.emitEvent('order_update', data);
    } catch (error) {
      console.error('Error handling order update:', error);
    }
  }

  /**
   * Handle order status change from WebSocket
   */
  private handleOrderStatusChange(data: any): void {
    try {
      // Update Redux store with status change using silent refresh (no loading state)
      const currentState = store.getState();
      const currentOrders = currentState.orderHistory.orders;
      
      if (data.orderId && data.status) {
        const updatedOrders = currentOrders.map(order => 
          order.id === data.orderId ? { ...order, status: data.status } : order
        );
        store.dispatch(refreshOrderHistorySilent(updatedOrders));
      }

      // Emit status change event
      this.emitEvent('order_status_change', data);
    } catch (error) {
      console.error('Error handling order status change:', error);
    }
  }

  /**
   * Handle new order from WebSocket
   */
  private handleNewOrder(data: any): void {
    try {
      // Add new order to Redux store using silent refresh (no loading state)
      const currentState = store.getState();
      const currentOrders = currentState.orderHistory.orders;
      const updatedOrders = [data.order, ...currentOrders];
      store.dispatch(refreshOrderHistorySilent(updatedOrders));

      // Emit new order event
      this.emitEvent('new_order', data);
    } catch (error) {
      console.error('Error handling new order:', error);
    }
  }

  /**
   * Handle server error from WebSocket
   */
  private handleServerError(data: any): void {
    console.error('Server error received:', data);
    
    // Emit server error event
    this.emitEvent('server_error', data);
  }

  /**
   * Attempt to reconnect to WebSocket
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    this.reconnectTimer = setTimeout(() => {
      if (this.restaurantId) {
        this.connect(this.restaurantId).catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, this.reconnectInterval * this.reconnectAttempts); // Exponential backoff
  }

  /**
   * Emit event to listeners
   */
  private emitEvent(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

export default webSocketService;
