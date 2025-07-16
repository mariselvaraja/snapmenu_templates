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
import usePaymentManagement from '../../hooks/usePaymentManagement';
import VerifyingPaymentPopup from '../VerifyingPaymentPopup';
import PaymentSuccessPopup from '../PaymentSuccessPopup';
import PaymentFailedPopup from '../PaymentFailedPopup';
import PaymentFailedProcessingPopup from '../PaymentFailedProcessingPopup';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils';

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
  const { showToast } = useToast();

  // Global payment management hook for handling payments when bill is closed
  const {
    showVerifyingPaymentPopup,
    showPaymentFailedPopup,
    showPaymentFailedProcessingPopup,
    showPaymentSuccessPopup,
    initiatePayment,
    handlePaymentSuccess,
    handlePaymentRetry,
    resetAllPopupStates
  } = usePaymentManagement();

  // Monitor payment responses globally
  const paymentState = useSelector((state: RootState) => state.payment);
  const [previousPaymentResponse, setPreviousPaymentResponse] = useState<any>(null);

  useEffect(() => {
    if (paymentState.paymentResponse && paymentState.paymentResponse !== previousPaymentResponse) {
      console.log('Global payment response received:', paymentState.paymentResponse);
      setPreviousPaymentResponse(paymentState.paymentResponse);
      
      // Check if payment response contains a payment link
      const paymentLink = paymentState.paymentResponse?.paymentLink || 
                         paymentState.paymentResponse?.payment_link || 
                         paymentState.paymentResponse?.paymentUrl;
      
      if (paymentLink) {
        console.log('Global payment link detected, initiating payment:', paymentLink);
        
        // Close the bill component first when payment link is detected
        if (showBill) {
          setShowBill(false);
        }
        
        // Then use the new payment management system
        initiatePayment(paymentLink);
      } else if (paymentState.paymentResponse?.message) {
        // Handle direct payment response without link
        if (paymentState.paymentResponse?.success === true) {
          showToast('Payment completed successfully!', 'success');
        } else {
          showToast(paymentState.paymentResponse.message || 'Payment failed', 'error');
        }
      }
    }
  }, [paymentState.paymentResponse, previousPaymentResponse, initiatePayment, showToast, showBill]);

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
      
      // Refresh orders data when order is updated
      if (tableFromQuery) {
        dispatch(getOrderHistoryRequest(tableFromQuery));
      }
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
      
      // Refresh orders data when order status changes
      if (tableFromQuery) {
        dispatch(getOrderHistoryRequest(tableFromQuery));
      }
    },
    onNewOrder: (data) => {
      console.log('New order received via WebSocket:', data);
      setShowNotification(true);
      // Show brief update indicator
      setShowUpdateIndicator(true);
      setTimeout(() => setShowUpdateIndicator(false), 2000);
      
      // Refresh orders data when new order is received
      if (tableFromQuery) {
        dispatch(getOrderHistoryRequest(tableFromQuery));
      }
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
        {historyLoading && orders.length === 0 ? (
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
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 text-center max-w-sm">
                Your orders will appear here once you place them. Start browsing our menu to get started!
              </p>
            </div>
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
                      <div className="mt-2 flex justify-end">
                      
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">${formatCurrency((item.price * item.quantity) || 0)}</span>
                   
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border uppercase ${getStatusBadgeClasses(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    {/* Display selected modifiers and spice level */}
                    {((item.modifiers && item.modifiers.length > 0) || item.spiceLevel) && (
                      <div className="mt-1 mb-2 text-xs text-gray-600">
                        {/* First display all non-spice level modifiers */}
                        {item.modifiers && item.modifiers.length > 0 && item.modifiers.map((modifier: any) => 
                          modifier.modifier_name !== "Spice Level" ? 
                            <div 
                              key={`${modifier.modifier_name}`} 
                              className="flex justify-between items-center py-0.5"
                            >
                              <span>{modifier.modifier_name}</span>
                              <span className="font-medium">
                                +(${formatCurrency(modifier.modifier_price * item.quantity || 0)})
                              </span>
                            </div>
                          : null
                        )}
                        
                        {/* Display spice level from modifiers if available */}
                        {item.modifiers && item.modifiers.some((modifier: any) => modifier.name === "Spice Level") && (
                          item.modifiers.flatMap((modifier: any) => 
                            modifier.name === "Spice Level" ? 
                              modifier.options.map((option: any, index: number) => {
                                let chiliCount = 1; // Default to 1
                                if (option.name === "Medium") chiliCount = 2;
                                if (option.name === "Hot") chiliCount = 3;
                                
                                return (
                                  <div 
                                    key={`${modifier.name}-${option.name}-${index}`} 
                                    className="flex justify-between items-center py-0.5"
                                  >
                                    <span className="flex items-center">
                                      Spice Level
                                      <span className="ml-1 text-red-500">
                                        {chiliCount === 1 && '🌶️'}
                                        {chiliCount === 2 && '🌶️🌶️'}
                                        {chiliCount === 3 && '🌶️🌶️🌶️'}
                                      </span>
                                    </span>
                                  </div>
                                );
                              })
                            : []
                          )
                        )}
                        
                        {/* Display spice level directly from item if not in modifiers */}
                        {item.spiceLevel && !item.modifiers?.some((modifier: any) => modifier.name === "Spice Level") && (
                          <div className="flex justify-between items-center py-0.5">
                            <span className="flex items-center">
                              Spice Level
                              <span className="ml-1 text-red-500">
                                {(() => {
                                  let chiliCount = 1; // Default to 1
                                  if (item.spiceLevel === "Medium") chiliCount = 2;
                                  if (item.spiceLevel === "Hot") chiliCount = 3;
                                  
                                  return (
                                    <>
                                      {chiliCount === 1 && '🌶️'}
                                      {chiliCount === 2 && '🌶️🌶️'}
                                      {chiliCount === 3 && '🌶️🌶️🌶️'}
                                    </>
                                  );
                                })()}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs pt-2">
                          Qty: {item.quantity}
                        </div>
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
                ? formatCurrency(orders.reduce((sum, order) => sum + (order.total || 0), 0) || 0)
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
          onClose={() => {
            setShowBill(false);
            // Don't refresh orders when bill component is closed manually
          }} 
          order={orders} 
          tableNumber={tableNumber}
        />
      )}

      {/* Global Payment Popup Components - Show even when bill is closed */}
      {/* <VerifyingPaymentPopup
        isOpen={showVerifyingPaymentPopup}
        onClose={() => {
          resetAllPopupStates();
          // Refresh orders when verifying popup is closed
          if (tableFromQuery) {
            dispatch(getOrderHistoryRequest(tableFromQuery));
          }
        }}
      /> */}

      <PaymentSuccessPopup
        isOpen={showPaymentSuccessPopup}
        onClose={() => {
          resetAllPopupStates();
          // Refresh orders when success popup is closed
          if (tableFromQuery) {
            dispatch(getOrderHistoryRequest(tableFromQuery));
          }
        }}
        onContinue={() => handlePaymentSuccess(() => {
          showToast('Payment completed successfully!', 'success');
          // Refresh orders after successful payment
          if (tableFromQuery) {
            dispatch(getOrderHistoryRequest(tableFromQuery));
          }
        })}
      />

      {/* <PaymentFailedPopup
        isOpen={showPaymentFailedPopup}
        onClose={() => {
          resetAllPopupStates();
          // Refresh orders when failed popup is closed
          if (tableFromQuery) {
            dispatch(getOrderHistoryRequest(tableFromQuery));
          }
        }}
        onTryAgain={() => handlePaymentRetry(() => {
          // Retry the payment with the same payment link
          if (paymentState.paymentResponse?.paymentLink || 
              paymentState.paymentResponse?.payment_link || 
              paymentState.paymentResponse?.paymentUrl) {
            const paymentLink = paymentState.paymentResponse?.paymentLink || 
                               paymentState.paymentResponse?.payment_link || 
                               paymentState.paymentResponse?.paymentUrl;
            initiatePayment(paymentLink);
          } else {
            showToast('No payment link available for retry', 'error');
          }
        })}
      /> */}

      <PaymentFailedProcessingPopup
        isOpen={showPaymentFailedProcessingPopup}
        onClose={() => {
          resetAllPopupStates();
          // Refresh orders when processing failed popup is closed
          if (tableFromQuery) {
            dispatch(getOrderHistoryRequest(tableFromQuery));
          }
        }}
        onTryAgain={() => handlePaymentRetry(() => {
          // Retry the payment with the same payment link
          if (paymentState.paymentResponse?.paymentLink || 
              paymentState.paymentResponse?.payment_link || 
              paymentState.paymentResponse?.paymentUrl) {
            const paymentLink = paymentState.paymentResponse?.paymentLink || 
                               paymentState.paymentResponse?.payment_link || 
                               paymentState.paymentResponse?.paymentUrl;
            initiatePayment(paymentLink);
          } else {
            showToast('No payment link available for retry', 'error');
          }
        })}
      />
    </div>
  );
};

export default InDiningOrders;
