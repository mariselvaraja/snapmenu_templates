import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { webSocketService } from '../../../common/services/websocketService';
import { getOrderHistoryRequest } from '../../../common/redux/slices/orderHistorySlice';

interface UseWebSocketOrdersOptions {
  restaurantId: string;
  tableId?: string;
  autoConnect?: boolean;
  onOrderUpdate?: (data: any) => void;
  onOrderStatusChange?: (data: any) => void;
  onNewOrder?: (data: any) => void;
  onConnectionChange?: (status: string) => void;
}

interface UseWebSocketOrdersReturn {
  connectionStatus: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: any;
}

export const useWebSocketOrders = (options: UseWebSocketOrdersOptions): UseWebSocketOrdersReturn => {
  const {
    restaurantId,
    tableId,
    autoConnect = true,
    onOrderUpdate,
    onOrderStatusChange,
    onNewOrder,
    onConnectionChange
  } = options;

  const dispatch = useDispatch();
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Use refs to store callback functions to avoid re-creating event listeners
  const onOrderUpdateRef = useRef(onOrderUpdate);
  const onOrderStatusChangeRef = useRef(onOrderStatusChange);
  const onNewOrderRef = useRef(onNewOrder);
  const onConnectionChangeRef = useRef(onConnectionChange);

  // Update refs when callbacks change
  useEffect(() => {
    onOrderUpdateRef.current = onOrderUpdate;
  }, [onOrderUpdate]);

  useEffect(() => {
    onOrderStatusChangeRef.current = onOrderStatusChange;
  }, [onOrderStatusChange]);

  useEffect(() => {
    onNewOrderRef.current = onNewOrder;
  }, [onNewOrder]);

  useEffect(() => {
    onConnectionChangeRef.current = onConnectionChange;
  }, [onConnectionChange]);

  // Connect function
  const connect = useCallback(async (): Promise<void> => {
    if (!restaurantId) {
      throw new Error('Restaurant ID is required');
    }

    setIsConnecting(true);
    setError(null);

    try {
      await webSocketService.connect(restaurantId);
      setConnectionStatus('connected');
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to WebSocket';
      setError(errorMessage);
      setConnectionStatus('disconnected');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [restaurantId]);

  // Disconnect function
  const disconnect = useCallback((): void => {
    webSocketService.disconnect();
    setConnectionStatus('disconnected');
    setError(null);
    setIsConnecting(false);
  }, []);

  // Event handlers
  const handleConnected = useCallback((data: any) => {
    console.log('WebSocket connected:', data);
    setConnectionStatus('connected');
    setError(null);
    setIsConnecting(false);
    
    if (onConnectionChangeRef.current) {
      onConnectionChangeRef.current('connected');
    }
  }, []);

  const handleDisconnected = useCallback((data: any) => {
    console.log('WebSocket disconnected:', data);
    setConnectionStatus('disconnected');
    setIsConnecting(false);
    
    if (onConnectionChangeRef.current) {
      onConnectionChangeRef.current('disconnected');
    }
  }, []);

  const handleError = useCallback((error: any) => {
    console.error('WebSocket error:', error);
    const errorMessage = error?.message || 'WebSocket connection error';
    setError(errorMessage);
    setConnectionStatus('disconnected');
    setIsConnecting(false);
    
    if (onConnectionChangeRef.current) {
      onConnectionChangeRef.current('error');
    }
  }, []);

  const handleMessage = useCallback((message: any) => {
    console.log('WebSocket message received:', message);
    setLastMessage(message);
  }, []);

  const handleOrderUpdate = useCallback((data: any) => {
    console.log('Order update received:', data);
    if (onOrderUpdateRef.current) {
      onOrderUpdateRef.current(data);
    }
  }, []);

  const handleOrderStatusChange = useCallback((data: any) => {
    console.log('Order status change received:', data);
    if (onOrderStatusChangeRef.current) {
      onOrderStatusChangeRef.current(data);
    }
  }, []);

  const handleNewOrder = useCallback((data: any) => {
    console.log('New order received:', data);
    if (onNewOrderRef.current) {
      onNewOrderRef.current(data);
    }
  }, []);

  const handleServerError = useCallback((data: any) => {
    console.error('Server error received:', data);
    setError(data.message || 'Server error');
  }, []);

  // Set up event listeners
  useEffect(() => {
    // Add event listeners
    webSocketService.addEventListener('connected', handleConnected);
    webSocketService.addEventListener('disconnected', handleDisconnected);
    webSocketService.addEventListener('error', handleError);
    webSocketService.addEventListener('message', handleMessage);
    webSocketService.addEventListener('order_update', handleOrderUpdate);
    webSocketService.addEventListener('order_status_change', handleOrderStatusChange);
    webSocketService.addEventListener('new_order', handleNewOrder);
    webSocketService.addEventListener('server_error', handleServerError);

    // Cleanup function
    return () => {
      webSocketService.removeEventListener('connected', handleConnected);
      webSocketService.removeEventListener('disconnected', handleDisconnected);
      webSocketService.removeEventListener('error', handleError);
      webSocketService.removeEventListener('message', handleMessage);
      webSocketService.removeEventListener('order_update', handleOrderUpdate);
      webSocketService.removeEventListener('order_status_change', handleOrderStatusChange);
      webSocketService.removeEventListener('new_order', handleNewOrder);
      webSocketService.removeEventListener('server_error', handleServerError);
    };
  }, [
    handleConnected,
    handleDisconnected,
    handleError,
    handleMessage,
    handleOrderUpdate,
    handleOrderStatusChange,
    handleNewOrder,
    handleServerError
  ]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && restaurantId) {
      console.log(`🚀 InDiningOrders component mounted - connecting WebSocket for restaurant ID: ${restaurantId}`);
      connect().catch(err => {
        console.error('Auto-connect failed:', err);
      });
    }

    // Cleanup on unmount
    return () => {
      if (autoConnect) {
        console.log(`🛑 InDiningOrders component unmounting - disconnecting WebSocket for restaurant ID: ${restaurantId}`);
        disconnect();
      }
    };
  }, [autoConnect, restaurantId, connect, disconnect]);

  // Update connection status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const currentStatus = webSocketService.getConnectionStatus();
      if (currentStatus !== connectionStatus) {
        setConnectionStatus(currentStatus);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [connectionStatus]);

  return {
    connectionStatus,
    connect,
    disconnect,
    isConnected: connectionStatus === 'connected',
    isConnecting,
    error,
    lastMessage
  };
};

export default useWebSocketOrders;
