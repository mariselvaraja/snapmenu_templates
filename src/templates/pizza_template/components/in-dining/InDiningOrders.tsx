import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, ClipboardList, ArrowLeft, Calendar, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../../common/store';

interface InDiningOrdersProps {
  onClose: () => void;
  newOrderNumber?: string;
}

const InDiningOrders: React.FC<InDiningOrdersProps> = ({ onClose, newOrderNumber }) => {
  // Mock orders data - in a real app, this would come from a backend
  const mockOrders = [
    {
      id: '12345',
      date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      status: 'In Progress',
      total: 24.99,
      items: [
        { name: 'Pepperoni Pizza', quantity: 1, price: 14.99 },
        { name: 'Garlic Bread', quantity: 1, price: 4.99 },
        { name: 'Coke', quantity: 1, price: 2.99 }
      ]
    },
    {
      id: '12344',
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      status: 'Completed',
      total: 32.99,
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
        { name: 'Hawaiian Pizza', quantity: 1, price: 15.99 },
        { name: 'Sprite', quantity: 1, price: 2.99 }
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
          total: useSelector((state: RootState) => 
            state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0) * 1.1
          ),
          items: useSelector((state: RootState) => 
            state.cart.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            }))
          )
        },
        ...mockOrders
      ]
    : mockOrders;

  // Get table number from URL
  const location = useLocation();
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  
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
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  
  // Toggle expanded state for an order
  const toggleOrderExpanded = (orderId: string) => {
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
              <ArrowLeft className="h-6 w-6 text-red-500" />
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
      {newOrderNumber && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4 rounded-md"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Utensils className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Order Placed Successfully!</h3>
              <div className="mt-2 text-sm text-red-700">
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
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="h-10 w-10 text-red-300" />
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
                  order.id === newOrderNumber ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                {/* Order Header - Always Visible */}
                <div 
                  className="p-4 bg-red-50 flex justify-between items-center cursor-pointer"
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
                              : 'bg-red-100 text-red-800'
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
                    <div className="text-red-500 font-bold">${order.total.toFixed(2)}</div>
                  </div>
                </div>
                
                {/* Order Details - Only Visible When Expanded */}
                {expandedOrders[order.id] && (
                  <div className="p-4 border-t border-gray-200">
                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium">{item.quantity}x</span> {item.name}
                          </div>
                          <div className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Total */}
                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-red-500">${order.total.toFixed(2)}</span>
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
