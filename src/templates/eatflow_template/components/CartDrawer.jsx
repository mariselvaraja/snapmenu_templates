import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, clearCart, calculateTotal, increaseQuantity, decreaseQuantity } = useCart();
  
  // Calculate item count
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-green-500" />
                Your Order {itemCount > 0 && `(${itemCount})`}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-grow overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="text-green-500 font-medium hover:text-green-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y">
                  {cart.map((item) => (
                    <li key={item.id} className="p-4 flex">
                      {/* Item Image with Fallback */}
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-lg mr-4">
                          <span className="text-xl font-bold text-green-500">
                            {item.name && item.name.length > 0 
                              ? item.name.charAt(0).toUpperCase() 
                              : 'F'}
                          </span>
                        </div>
                      )}
                      
                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-green-600 font-semibold">${item.price}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center mt-2">
                          <button 
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center text-sm hover:bg-green-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="mx-2 text-sm">{item.quantity || 1}</span>
                          <button 
                            onClick={() => increaseQuantity(item.id)}
                            className="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center text-sm hover:bg-green-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="ml-auto text-red-500 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${calculateTotal()?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-semibold">${(calculateTotal() * 0.08)?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-green-600">${(calculateTotal() * 1.08)?.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Shipping and taxes calculated at checkout
                </p>
                <div className="space-y-2">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="block w-full bg-white border border-green-500 text-green-500 py-2 rounded-full font-semibold text-center hover:bg-green-50 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="block w-full bg-green-500 text-white py-2 rounded-full font-semibold text-center hover:bg-green-600 transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
