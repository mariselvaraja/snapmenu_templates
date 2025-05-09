import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../../common/store';
import { toggleDrawer, updateItemQuantity, removeItem } from '../../../../common/redux/slices/cartSlice';

interface InDiningCartDrawerProps {
  onPlaceOrder?: () => void;
}

const InDiningCartDrawer: React.FC<InDiningCartDrawerProps> = ({ onPlaceOrder }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { drawerOpen, items } = useSelector((state: RootState) => state.cart);


  let tablename = sessionStorage.getItem('Tablename');

  
  // Calculate total price
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => dispatch(toggleDrawer())}
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
                    Table Number: {tablename}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(toggleDrawer())}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-10 w-10 text-red-300" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add items to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex border-b border-gray-100 pb-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-red-100">
                            <span className="text-2xl font-bold text-red-500">{item.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Item Details */}
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <button
                            onClick={() => dispatch(removeItem(item.id))}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-red-500 font-medium">${item.price.toFixed(2)}</p>
                        
                        {/* Display Selected Modifiers and Spice Level */}
                        {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                          <div className="mt-1 mb-2">
                            {item.selectedModifiers.map((modifier: any, idx: number) => (
                              <div key={idx} className="text-xs text-gray-600">
                                {modifier.name === "Spice Level" ? (
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">Spice:</span>
                                    {modifier.options.map((option: any, optIdx: number) => (
                                      <span key={optIdx} className="text-red-500 font-medium">{option.name}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <div>
                                    <span className="font-medium">{modifier.name}:</span>
                                    <span> {modifier.options.map((opt: any) => opt.name).join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => dispatch(updateItemQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="mx-3 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateItemQuantity({ id: item.id, quantity: item.quantity + 1 }))}
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
              {/* Total */}
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span>${(totalPrice * 1.1).toFixed(2)}</span>
              </div>
              
              {/* Place Order Button - No Checkout Button for In-Dining */}
              <button
                disabled={items.length === 0}
                className={`w-full py-3 rounded-full text-white font-medium transition-colors ${
                  items.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                }`}
                onClick={() => {
                  dispatch(toggleDrawer());
                  if (onPlaceOrder && items.length > 0) {
                    onPlaceOrder();
                  }
                }}
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
