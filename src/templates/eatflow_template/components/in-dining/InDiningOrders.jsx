import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, ClipboardList, ArrowLeft, Calendar, Clock, Users, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const InDiningOrders = ({ onClose, newOrderNumber }) => {
  const [showNotification, setShowNotification] = useState(!!newOrderNumber);
  // Mock orders data - in a real app, this would come from a backend
  const mockOrders = [
    {
      id: '12345',
      date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      status: 'In Progress',
      total: 24.99,
      items: [
        { name: 'Avocado Toast', quantity: 1, price: 14.99 },
        { name: 'Fresh Juice', quantity: 1, price: 4.99 },
        { name: 'Espresso', quantity: 1, price: 2.99 }
      ]
    },
    {
      id: '12344',
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      status: 'Completed',
      total: 32.99,
      items: [
        { name: 'Quinoa Bowl', quantity: 1, price: 12.99 },
        { name: 'Acai Smoothie', quantity: 1, price: 15.99 },
        { name: 'Mineral Water', quantity: 1, price: 2.99 }
      ]
    }
  ];

  // If there's a new order number, add it to the top of the list
  const orders = newOrderNumber 
    ? [
        {
          id: newOrderNumber,
          date: new Date().toISOString(),
          status: 'Preparing',
          total: useSelector((state) => 
            state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0) * 1.1
          ),
          items: useSelector((state) => 
            state.cart.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image || ''
            }))
          )
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
  
  // Current date and time information
  const today = new Date();
  const formattedDate = "Thu, Apr 17, 2025";
  
  // Mock time slot information
  const [timeSlot] = useState('12:30 PM - 2:00 PM');
  
  // State to track which orders are expanded
  const [expandedOrders, setExpandedOrders] = useState({});
  
  // Toggle expanded state for an order
  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

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
              <ArrowLeft className="h-6 w-6 text-green-500" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-white">Your Orders</h2>
              <p className="text-xs text-gray-300">
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
          className="bg-green-50 border-l-4 border-green-500 p-4 mx-4 mt-4 rounded-md relative"
        >
          <button 
            onClick={() => setShowNotification(false)} 
            className="absolute top-2 right-2 text-green-500 hover:text-green-700"
            aria-label="Close notification"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Utensils className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Order Placed Successfully!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your order #{newOrderNumber} has been received and is being prepared.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Orders List */}
      <div className="p-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="h-10 w-10 text-green-300" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-2">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className={`border rounded-lg overflow-hidden shadow-sm mb-4 ${
                  order.id === newOrderNumber ? 'border-green-300' : 'border-gray-200'
                }`}
              >
                {/* Order Header - Always Visible */}
                <div 
                  className="p-4 bg-green-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleOrderExpanded(order.id)}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {expandedOrders[order.id] ? 
                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Order #{order.id}</span>
                        <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                          order.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'In Progress' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(order.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{order.items.length} items</div>
                    <div className="text-green-500 font-bold">${order.total.toFixed(2)}</div>
                  </div>
                </div>
                
                {/* Order Details - Only Visible When Expanded */}
                {expandedOrders[order.id] && (
                  <div className="p-4 border-t border-gray-200">
                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0 bg-green-100 flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg font-bold text-green-500">
                                  {item.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="font-medium">{item.quantity}x</span> {item.name}
                            </div>
                          </div>
                          <div className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Total */}
                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-green-500">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InDiningOrders;
