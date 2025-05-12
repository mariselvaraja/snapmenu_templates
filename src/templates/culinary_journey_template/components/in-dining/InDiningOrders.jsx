import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Utensils, ClipboardList, ArrowLeft, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import BillComponent from './BillComponent';

const InDiningOrders = ({ onClose, newOrderNumber }) => {
  const [showNotification, setShowNotification] = useState(!!newOrderNumber);
  const [showBill, setShowBill] = useState(false);
  
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
  
  // Define the order interface
  const OrderItem = {
    name: '',
    quantity: 0,
    price: 0,
    image: ''
  };

  const Order = {
    id: '',
    date: '',
    status: '',
    total: 0,
    items: []
  };

  // Mock orders data - in a real app, this would come from a backend
  const mockOrders = [];

  // If there's a new order number, add it to the top of the list
  const cartItems = useSelector((state) => state.cart.items);
  const orders = newOrderNumber 
    ? [
        {
          id: newOrderNumber,
          date: new Date().toISOString(),
          status: 'Preparing',
          total: cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 1.1,
          items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image || ''
          }))
        },
        ...mockOrders
      ]
    : mockOrders;

  // Get table number from URL
  const location = useLocation();
  const [tableNumber, setTableNumber] = useState(null);
  
  useEffect(() => {
    // Extract table number from URL query parameter or path parameter
    // Examples: 
    // - Query parameter: /placeindiningorder?table=12
    // - Path parameter: /placeindiningorder/12
    
    // First check for query parameter
    const searchParams = new URLSearchParams(location.search);
    const tableFromQuery = searchParams.get('table');
    
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

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black shadow-md">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-1 mr-3"
            >
              <ArrowLeft className="h-6 w-6 text-orange-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-white">Your Orders</h2>
              <p className="text-xs text-orange-400">
                Table Number: {tableNumber ? `#${tableNumber}` : 'No Table'}
              </p>
            </div>
          </div>
        </div>
      </div>
      

      {/* New Order Notification */}
      {newOrderNumber && showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-orange-50 border-l-4 border-orange-600 p-4 mx-4 mt-4 rounded-md relative"
        >
          <button 
            onClick={() => setShowNotification(false)} 
            className="absolute top-2 right-2 text-orange-600 hover:text-orange-700"
            aria-label="Close notification"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Utensils className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Order Update</h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>Your order is being prepared</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Orders List */}
      <div className="p-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="h-10 w-10 text-orange-300" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-2">Your order history will appear here</p>
          </div>
        ) : (
          <div>
            {/* Orders as Cards */}
            <div className="space-y-4">
              {orders.map((order, orderIndex) => (
                <div key={orderIndex} className="bg-white overflow-hidden">
                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3">
                          {/* Product Info */}
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0 bg-orange-100 flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg font-bold text-orange-600">
                                  {item.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 mr-2">
                                  Preparing
                                </span>
                                <span>Qty: {item.quantity}</span>
                              </div>
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
          <div className="text-xl font-bold text-orange-600">
            ${orders.length > 0 ? orders[0].total?.toFixed(2) : '0.00'}
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            className="bg-orange-600 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors"
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
          order={orders[0]} 
          tableNumber={tableNumber}
        />
      )}
    </div>
  );
};

export default InDiningOrders;
