import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Utensils, ClipboardList, ArrowLeft, Calendar, Clock, Users, ChevronDown, ChevronUp, X } from 'lucide-react';
import BillComponent from './BillComponent';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../../common/store';
import { InDiningOrder } from '../../../../common/redux/slices/inDiningOrderSlice';
import { getOrderHistoryRequest } from '../../../../common/redux/slices/orderHistorySlice';

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
  let tablename = sessionStorage.getItem('Tablename');
  
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
      window.scrollTo(0, 1);
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
    
    // Check on mount
    checkMobile();
    
    // Set up event listeners
    window.addEventListener('resize', checkMobile);
    window.addEventListener('load', hideUrlBar);
    window.addEventListener('resize', hideUrlBar);
    window.addEventListener('orientationchange', hideUrlBar);
    
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
    };
  }, [hideUrlBar]);
  
  // Get orders from Redux store
  const dispatch = useDispatch();
  
  const orderHistoryState = useSelector((state: RootState) => state.orderHistory);
  const historyLoading = orderHistoryState.loading;
  const historyError = orderHistoryState.error;
  const orderHistory = orderHistoryState.orders;
  
  console.log("Iitems", orderHistory)
  // Transform orderHistory to match the expected Order interface
  const orders = orderHistory ? orderHistory.map((orderData:any) => {
    // Cast to ExtendedInDiningOrder to handle both data formats
    const order = orderData as ExtendedInDiningOrder;
    
    // Check if the order has ordered_items (from the sample data structure)
    const items = order.ordered_items 
      ? order.ordered_items.map(item => ({
          name: item.name,
          quantity: item.quantity,
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

  // Fetch order history when tableNumber changes


  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm shadow-md">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-1 mr-3"
            >
              <ArrowLeft className="h-6 w-6 text-red-500" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-white">Your Orders</h2>
              <p className="text-xs text-gray-300">
                Table Number: {tablename}
              </p>
            </div>
          </div>
        </div>
      </div>
      

      {/* New Order Notification */}
      {/* {newOrderNumber && showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4 rounded-md relative"
        >
          <button 
            onClick={() => setShowNotification(false)} 
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            aria-label="Close notification"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Utensils className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Order Update</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Your order is start preparing</p>
              </div>
            </div>
          </div>
        </motion.div>
      )} */}

      {/* Orders List */}
      <div className="p-4">
        {historyLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading order history...</p>
          </div>
        ) : historyError ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading orders: {historyError}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="h-10 w-10 text-red-300" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-2">Your order history will appear here</p>
          </div>
        ) : (
          <div>
            
            <div className="space-y-4">
              {orders.map((order: Order, orderIndex: number) => (
                <div key={orderIndex} className="bg-white overflow-hidden">
                  {/* Order Header */}
               
                  
                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.items && order.items.map((item: OrderItem, index: number) => (
                        <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3">
                          {/* Product Info */}
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0 bg-red-100 flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg font-bold text-red-500">
                                  {item.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 mr-2">
                                  Preparing
                                </span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                              
                              {/* Spice Level */}
                              {item.spiceLevel && (
                                <div className="text-xs text-gray-500 mt-1">
                                  <span className="font-medium">Spice Level:</span> {item.spiceLevel}
                                </div>
                              )}
                              
                              {/* Modifiers */}
                              {item.modifiers && item.modifiers.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  <span className="font-medium">Modifiers:</span>
                                  <ul className="ml-2 mt-0.5">
                                    {item.modifiers.map((modifier, modIndex) => (
                                      <li key={modIndex}>
                                        {modifier.name}: {modifier.options.map(opt => 
                                          `${opt.name} ${opt.modified_price ? `($${opt.modified_price})` : opt.price ? `($${opt.price})` : ''}`
                                        ).join(', ')}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="font-medium text-sm">
                            ${(item.price * item.quantity)?.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-600">Total Amount</div>
          <div className="text-xl font-bold text-red-500">
            ${orders.length > 0 
              ? orders.reduce((sum, order) => sum + (order.total || 0), 0)?.toFixed(2) 
              : '0.00'}
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600 transition-colors"
            onClick={onClose}
          >
            Continue Ordering
          </button>
          <button 
            className="bg-gray-800 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-900 transition-colors"
            onClick={() => setShowBill(true)}
          >
            View Bill
          </button>
        </div>
      </div>
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
