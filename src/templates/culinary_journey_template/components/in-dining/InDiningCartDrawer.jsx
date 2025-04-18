import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toggleDrawer, updateItemQuantity, removeItem } from '../../../../common/redux/slices/cartSlice';

const InDiningCartDrawer = ({ onPlaceOrder }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.cart.drawerOpen);
  const cartItems = useSelector((state) => state.cart.items);
  
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
  
  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  // Calculate tax (10%)
  const tax = subtotal * 0.1;
  
  // Calculate total
  const total = subtotal + tax;
  
  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeItem(id));
    } else {
      dispatch(updateItemQuantity({ id, quantity: newQuantity }));
    }
  };
  
  // Handle remove item
  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };
  
  // Handle close drawer
  const handleCloseDrawer = () => {
    dispatch(toggleDrawer(false));
  };
  
  // Handle place order
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    
    onPlaceOrder();
    handleCloseDrawer();
  };
  
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCloseDrawer}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Your Order</h2>
                  <p className="text-xs text-gray-500">
                    Table Number: {tableNumber ? `#${tableNumber}` : 'No Table'}
                  </p>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-10 w-10 text-orange-300" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add items to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex border-b border-gray-100 pb-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-orange-100">
                            <span className="text-2xl font-bold text-orange-600">{item.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Item Details */}
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-orange-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-orange-600 font-medium">${item.price.toFixed(2)}</p>
                        
                        {/* Item Options */}
                        {item.options && Object.keys(item.options).length > 0 && (
                          <div className="mt-1 mb-2">
                            {Object.entries(item.options).map(([key, value]) => (
                              <div key={key} className="text-xs text-gray-500">
                                <span className="font-medium">{key}:</span>{' '}
                                {Array.isArray(value) ? value.join(', ') : value}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="mx-3 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              {/* Order Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
                className={`w-full py-3 rounded-full font-medium ${
                  cartItems.length === 0
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-orange-600 text-white hover:bg-orange-700 transition-colors'
                }`}
              >
                Place Order
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InDiningCartDrawer;
