import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash, X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { toggleDrawer, removeItem, updateItemQuantity } from '../../../redux/slices/cartSlice';
import { useCart } from '../context/CartContext';

const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { isCartOpen, toggleCart } = useCart();
  
  // Redux integration
  const dispatch = useAppDispatch();
  const drawerOpen = useAppSelector((state) => state.cart.drawerOpen);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      // Calculate base price
      let itemTotal = parseFloat(item.price) * item.quantity;
      
      // Add modifier prices
      if (item.selectedModifiers && item.selectedModifiers.length > 0) {
        item.selectedModifiers.forEach(modifier => {
          modifier.options.forEach(option => {
            itemTotal += option.price * item.quantity;
          });
        });
      }
      
      return total + itemTotal;
    }, 0)?.toFixed(2);
  };
  
  // Calculate item count
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Handle close drawer
  const handleCloseDrawer = () => {
    toggleCart();
    dispatch(toggleDrawer(false));
  };

  return (
    <AnimatePresence>
      {(isCartOpen || drawerOpen) && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[9998]"
            onClick={handleCloseDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-black text-white shadow-2xl border-l border-zinc-800 z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-xl font-bold flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-yellow-400" />
                Your Order {itemCount > 0 && `(${itemCount})`}
              </h2>
              <button 
                onClick={handleCloseDrawer} 
                className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
        
            {/* Cart Content */}
            <div className="flex-grow overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <ShoppingBag className="h-12 w-12 text-zinc-600 mb-2" />
                  <p className="text-zinc-400 mb-4">Your cart is empty</p>
                  <button
                    onClick={handleCloseDrawer}
                    className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-800">
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
                        <div className="w-16 h-16 bg-zinc-800 flex items-center justify-center rounded-lg mr-4">
                          <span className="text-xl font-bold text-yellow-400">
                            {item.name && item.name.length > 0 
                              ? item.name.charAt(0).toUpperCase() 
                              : 'F'}
                          </span>
                        </div>
                      )}
                      
                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <p className="text-yellow-400 font-semibold">
                          ${(() => {
                            let totalItemPrice = parseFloat(item.price);
                            
                            if (item.selectedModifiers && item.selectedModifiers.length > 0) {
                              item.selectedModifiers.forEach(modifier => {
                                modifier.options.forEach(option => {
                                  totalItemPrice += option.price;
                                });
                              });
                            }
                            
                            return totalItemPrice?.toFixed(2);
                          })()}
                        </p>
                        
                        {/* Display selected modifiers as badges */}
                        {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 mb-2">
                            {item.selectedModifiers.flatMap(modifier => 
                              modifier.options.map((option, index) => (
                                <span 
                                  key={`${modifier.name}-${option.name}-${index}`} 
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-zinc-800 text-yellow-400"
                                >
                                  {option.name || modifier.name}
                                  {option.price > 0 && <span className="ml-1 font-medium">+${option.price?.toFixed(2)}</span>}
                                </span>
                              ))
                            )}
                          </div>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center text-sm hover:bg-zinc-700 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="mx-2 text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center text-sm hover:bg-zinc-700 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="ml-auto text-red-500 hover:text-red-400 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash className="w-4 h-4" />
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
              <div className="border-t border-zinc-800 p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-yellow-400">${calculateTotal()}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-4">
                  Shipping and taxes calculated at checkout
                </p>
                <div className="space-y-2">
                  <Link
                    to="/cart"
                    onClick={handleCloseDrawer}
                    className="block w-full bg-black border border-yellow-400 text-yellow-400 py-2 rounded-full font-semibold text-center hover:bg-zinc-900 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={handleCloseDrawer}
                    className="block w-full bg-yellow-400 text-black py-2 rounded-full font-semibold text-center hover:bg-yellow-300 transition-colors"
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
};

export default CartDrawer;
