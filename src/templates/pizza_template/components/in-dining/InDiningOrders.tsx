import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Utensils, ClipboardList, ArrowLeft, Calendar, Clock, Users, ChevronDown, ChevronUp, X, ShoppingBag, Wifi, WifiOff } from 'lucide-react';
import BillComponent from './BillComponent';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../../../common/store';
import { InDiningOrder } from '../../../../common/redux/slices/inDiningOrderSlice';
import { getOrderHistoryRequest } from '../../../../common/redux/slices/orderHistorySlice';
import { useWebSocketOrders } from '../../hooks/useWebSocketOrders';

// Extended interface to handle both API response formats
interface ExtendedInDiningOrder extends Partial<InDiningOrder> {
  dining_id?: number;
  ordered_items?: Array<{
    name: string;
    quantity: number;
    itemPrice: number;
    image: string;
    modifiers?: Array<{
      name: string;
      options: Array<{
        name: string;
        price: number;
        modified_price?: number;
      }>;
    }>;
    spiceLevel?: string;
  }>;
  created_date?: string;
  dining_status?: string;
  total_amount?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  status?: string,
  modifiers?: {
    name: string;
    options: {
      name: string;
      price: number;
      modified_price?: number;
    }[];
  }[];
  spiceLevel?: string | null;
}

interface InDiningOrdersProps {
  onClose: () => void;
  newOrderNumber?: string;
}

const InDiningOrders: React.FC<InDiningOrdersProps> = ({ onClose, newOrderNumber }) => {
  const [showNotification, setShowNotification] = useState(!!newOrderNumber);
  const [showBill, setShowBill] = useState(false);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);
  const navigate = useNavigate();
  let tablename = sessionStorage.getItem('Tablename');

  // Get franchise ID from session storage (restaurant_id for websocket)
  const franchiseId = sessionStorage.getItem('franchise_id') || sessionStorage.getItem('restaurantId') || 'default-franchise';
  
  // WebSocket integration
  const {
    connectionStatus,
    isConnected,
    isConnecting,
    error: wsError,
    connect: connectWebSocket,
    disconnect: disconnectWebSocket
  } = useWebSocketOrders({
    restaurantId: franchiseId,
    tableId: tablename || undefined,
    autoConnect: true,
    onOrderUpdate: (data) => {
      console.log('Order updated via WebSocket:', data);
      // Show brief update indicator
      setShowUpdateIndicator(true);
      setTimeout(() => setShowUpdateIndicator(false), 2000);
    },
    onOrderStatusChange: (data) => {
      console.log('Order status changed via WebSocket:', data);
      // Show brief update indicator
      setShowUpdateIndicator(true);
      setTimeout(() => setShowUpdateIndicator(false), 2000);
      // Show notification for status changes
      if (data.status === 'ready') {
        setShowNotification(true);
      }
    },
    onNewOrder: (data) => {
      console.log('New order received via WebSocket:', data);
      setShowNotification(true);
      // Show brief update indicator
      setShowUpdateIndicator(true);
      setTimeout(() => setShowUpdateIndicator(false), 2000);
    },
    onConnectionChange: (status) => {
      console.log('WebSocket connection status changed:', status);
    }
  });
  
  // Function to get status badge colors
  const getStatusBadgeClasses = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case 'ready':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'delivered':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'preparing':
        return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      default:
        return 'bg-red-50 text-red-600 border-red-100';
    }
  };
  
  // Auto-close notification after 10 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 10000); // 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showNotification]);
  
  // Refs for URL bar hiding
  const isMobileRef = useRef(false);
  const isComponentMountedRef = useRef(false);
  
  // Function to hide URL bar on mobile
  const hideUrlBar = useRef(() => {
    if (isMobileRef.current && isComponentMountedRef.current) {
      // For fixed positioned elements, we need to temporarily change the body height
      // to allow scrolling and then hide the URL bar
      const originalHeight = document.body.style.height;
      const originalOverflow = document.body.style.overflow;
      
      // Temporarily make body scrollable
      document.body.style.height = '101vh';
      document.body.style.overflow = 'auto';
      
      // Scroll to hide URL bar
      window.scrollTo(0, 1);
      
      // Restore original styles after a short delay
      setTimeout(() => {
        document.body.style.height = originalHeight;
        document.body.style.overflow = originalOverflow;
      }, 100);
    }
  }).current;

  // Check if device is mobile and set up URL bar hiding
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth <= 768;
      if (isMobileRef.current) {
        hideUrlBar();
      }
    };
    
    // Handle scroll events to hide URL bar
    const handleScroll = () => {
      if (isMobileRef.current && isComponentMountedRef.current) {
        hideUrlBar();
      }
    };
    
    // Check on mount
    checkMobile();
    
    // Set up event listeners
    window.addEventListener('resize', checkMobile);
    window.addEventListener('load', hideUrlBar);
    window.addEventListener('resize', hideUrlBar);
    window.addEventListener('orientationchange', hideUrlBar);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    
    // Get the scrollable container and add scroll listeners
    const scrollContainer = document.querySelector('.orders-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      scrollContainer.addEventListener('touchmove', handleScroll, { passive: true });
    }
    
    // Initial attempts to hide URL bar with different timing
    setTimeout(hideUrlBar, 100);
    setTimeout(hideUrlBar, 300);
    setTimeout(hideUrlBar, 1000);
    
    return () => {
      isComponentMountedRef.current = false;
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('load', hideUrlBar);
      window.removeEventListener('resize', hideUrlBar);
      window.removeEventListener('orientationchange', hideUrlBar);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.removeEventListener('touchmove', handleScroll);
      }
    };
  }, [hideUrlBar]);
  
  // Get orders from Redux store
  const dispatch = useDispatch();
  
  const orderHistoryState = useSelector((state: RootState) => state.orderHistory);
  const historyLoading = orderHistoryState.loading;
  const historyError = orderHistoryState.error;
  const orderHistory = orderHistoryState.orders;
  
  // Transform orderHistory to match the expected Order interface
  const orders = orderHistory ? orderHistory.map((orderData:any) => {
    // Cast to ExtendedInDiningOrder to handle both data formats
    const order = orderData as ExtendedInDiningOrder;
    
    // Check if the order has ordered_items (from the sample data structure)
    const items = order.ordered_items 
      ? order.ordered_items.map((item:any) => ({
          name: item.name,
          quantity: item.quantity,
          status: item.status,
          price: item.itemPrice || 0,
          image: item.image || '',
          modifiers: item.modifiers || [],
          spiceLevel: item.spiceLevel || null
        }))
      : order.items || []; // Fallback to order.items if ordered_items doesn't exist

      
    
    return {
      id: order.id || (order.dining_id ? order.dining_id.toString() : '') || '',
      date: order.createdAt || order.created_date || new Date().toISOString(),
      status: order.status || order.dining_status || 'pending',
      total: order.totalAmount || (order.total_amount ? parseFloat(order.total_amount) : 0) || 0,
      items: items
    };
  }) : [];
  
  // Define the order interface to match the component's expectations
  interface Order {
    id: string;
    date: string;
    status: string;
    total: number;
    items: OrderItem[] | any[]; // Allow any[] to handle both OrderItem[] and InDiningOrderItem[]
  }

  // Get table number from URL
  const location = useLocation();
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const tableFromQuery = searchParams.get('table');

  // Function to handle continue button click
  const handleContinue = () => {
    // Simply close the orders modal to return to the in-dining order component
    // The parent InDiningOrder component will handle showing the main ordering interface
    onClose();
  };

  useEffect(() => {
    if (tableFromQuery) {
      dispatch(getOrderHistoryRequest(tableFromQuery));
    }
  }, [tableNumber, tableFromQuery, dispatch]);
  
  useEffect(() => {
    // Extract table number from URL query parameter or path parameter
    // Examples: 
    // - Query parameter: /placeindiningorder?table=12
    // - Path parameter: /placeindiningorder/12
    
    // First check for query parameter

    
    // Then check for path parameter
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const tableFromPath = !isNaN(Number(lastSegment)) ? lastSegment : null;
    
    // Use table from query parameter first, then fall back to path parameter
    if (tableFromQuery && !isNaN(Number(tableFromQuery))) {
      setTableNumber(tableFromQuery);
    } else if (tableFromPath) {
      setTableNumber(tableFromPath);
    } else {
      setTableNumber(null);
    }
  }, [location]);

  // Calculate item count
  const itemCount = orders.reduce((total: number, order: Order) => {
    return total + (order.items?.reduce((orderTotal: number, item: any) => {
      const quantity = typeof item.quantity === 'number' ? item.quantity : 
        parseInt(String(item.quantity)) || 1;
      return orderTotal + quantity;
    }, 0) || 0);
  }, 0);

  console.log("order.items", orders)

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-red-500" />
            Your Orders {itemCount > 0 && `(${itemCount})`}
          </h2>
          <div className="flex items-center space-x-2">
            <p className="text-xs text-gray-500">
              Table Number: {tablename}
            </p>
            {/* WebSocket Connection Status */}
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : isConnecting ? (
                <div className="h-3 w-3 border border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs ${
                isConnected ? 'text-green-600' : 
                isConnecting ? 'text-blue-600' : 
                'text-red-600'
              }`}>
                {isConnected ? 'Live' : isConnecting ? 'Connecting...' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Orders List */}
      <div className="flex-grow overflow-y-auto orders-scroll-container">
        {historyLoading ? (
          <ul className="divide-y">
            {/* Skeleton Loading Items */}
            {[...Array(5)].map((_, index) => (
              <li key={index} className="p-4 flex animate-pulse">
                {/* Skeleton Product Image */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex-shrink-0"></div>
                
                {/* Skeleton Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  
                  {/* Skeleton Status Badge */}
                  <div className="h-5 bg-gray-200 rounded-full w-20 mb-2"></div>
                  
                  {/* Skeleton Modifiers */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : historyError ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading orders: {historyError}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500 mb-4">No orders yet</p>
            <button
              onClick={onClose}
              className="text-red-500 font-medium hover:text-red-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <ul className="divide-y">
            {orders.map((order: Order, orderIndex: number) => (
              order.items && order.items.map((item: any, index: number) => (
                <li key={`${orderIndex}-${index}`} className="p-4 flex">
                  {/* Product Image */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-red-100 flex items-center justify-center rounded-lg mr-4">
                      <span className="text-xl font-bold text-red-500">
                        {item.name && item.name.length > 0 
                          ? item.name.charAt(0).toUpperCase() 
                          : 'P'}
                      </span>
                    </div>
                  )}
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="text-gray-600">
                        <span className="font-medium">${(item.price * item.quantity)?.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border uppercase ${getStatusBadgeClasses(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    {/* Display selected modifiers one by one with name on left and price on right */}
                    {item.modifiers && item.modifiers.length > 0 && (
                      <div className="mt-1 mb-2 text-xs text-gray-600">
                        {/* First display all non-spice level modifiers */}
                        {item.modifiers.flatMap((modifier: any) => 
                          modifier.name !== "Spice Level" ? 
                            modifier.options.map((option: any, optIndex: number) => (
                              <div 
                                key={`${modifier.name}-${option.name}-${optIndex}`} 
                                className="flex justify-between items-center py-0.5"
                              >
                                <span>{option.name || modifier.name}</span>
                                {(() => {
                                  const optionPrice = option.modified_price && option.modified_price > 0 ? 
                                    option.modified_price : (option.price || 0);
                                  const totalPrice = optionPrice * item.quantity;
                                  
                                  return (
                                    <span className="font-medium">
                                      +${totalPrice.toFixed(2)}
                                    </span>
                                  );
                                })()}
                              </div>
                            ))
                          : []
                        )}
                        
                        {/* Then display spice level modifiers at the end with quantity */}
                        {item.spiceLevel && (
                          <div className="flex justify-between items-center py-0.5">
                            <span className="flex items-center">
                              <span className="ml-1 text-red-500">
                                {item.spiceLevel === 'Mild' && '🌶️'}
                                {item.spiceLevel === 'Medium' && '🌶️🌶️'}
                                {item.spiceLevel === 'Hot' && '🌶️🌶️🌶️'}
                              </span>
                            </span>
                            
                            {/* Quantity display */}
                            <div className="flex items-center">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Add quantity display for items without spice level */}
                        {!item.spiceLevel && (
                          <div className="mt-2 flex justify-end">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Add quantity display for items without modifiers */}
                    {(!item.modifiers || item.modifiers.length === 0) && !item.spiceLevel && (
                      <div className="mt-2 flex justify-end">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ))}
          </ul>
        )}
      </div>
      
      {/* Footer */}
      {orders.length > 0 && (
        <div className="border-t p-4 z-10">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">
              ${orders.length > 0 
                ? orders.reduce((sum, order) => sum + (order.total || 0), 0)?.toFixed(2) 
                : '0.00'}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              className="flex-1 bg-red-500 text-white py-3 rounded-full font-medium hover:bg-red-600 transition-colors"
              onClick={handleContinue}
            >
              Continue
            </button>
            <button 
              className="flex-1 bg-gray-800 text-white py-3 rounded-full font-medium hover:bg-gray-900 transition-colors"
              onClick={() => setShowBill(true)}
            >
              Pay Bill
            </button>
          </div>
        </div>
      )}
      
      {/* Bill Popup */}
      {showBill && orders.length > 0 && (
        <BillComponent 
          onClose={() => setShowBill(false)} 
          order={orders} 
          tableNumber={tableNumber}
        />
      )}
    </div>
  );
};

export default InDiningOrders;
