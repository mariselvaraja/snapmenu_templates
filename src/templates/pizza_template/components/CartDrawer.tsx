import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux';
import { toggleDrawer, removeItem, updateItemQuantity } from '../../../redux/slices/cartSlice';

export default function CartDrawer() {
  const { items, drawerOpen } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  // Calculate cart totals
  const subtotal = items.reduce((total: number, item: { 
    price: number, 
    quantity: number,
    selectedModifiers?: {
      name: string;
      options: {
        name: string;
        price: number;
      }[];
    }[]
  }) => {
    // Calculate base price
    let itemTotal = item.price * item.quantity;
    
    // Add modifier prices
    if (item.selectedModifiers && item.selectedModifiers.length > 0) {
      item.selectedModifiers.forEach(modifier => {
        modifier.options.forEach(option => {
          itemTotal += option.price * item.quantity;
        });
      });
    }
    
    return total + itemTotal;
  }, 0);
  
  const itemCount = items.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);

  const closeDrawer = () => {
    dispatch(toggleDrawer(false));
  };

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeItem(itemId));
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeItem(itemId));
    } else {
      dispatch(updateItemQuantity({ id: itemId, quantity }));
    }
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={closeDrawer}
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
                <ShoppingBag className="h-5 w-5 mr-2 text-red-500" />
                Your Cart {itemCount > 0 && `(${itemCount})`}
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto">
              {items.length > 0 ? (
                <ul className="divide-y">
                  {items.map((item: { 
                    id: number, 
                    name: string, 
                    price: number, 
                    quantity: number, 
                    image: string,
                    selectedModifiers?: {
                      name: string;
                      options: {
                        name: string;
                        price: number;
                      }[];
                    }[]
                  }) => (
                    <li key={item.id} className="p-4 flex">
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
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="text-gray-600">
                          {/* Calculate and display total price including modifiers */}
                          {(() => {
                            let totalItemPrice = item.price;
                            let hasModifiers = false;
                            
                            if (item.selectedModifiers && item.selectedModifiers.length > 0) {
                              item.selectedModifiers.forEach(modifier => {
                                modifier.options.forEach(option => {
                                  totalItemPrice += option.price;
                                  hasModifiers = true;
                                });
                              });
                            }
                            
                            return (
                              <>
                                <span className="font-medium">${totalItemPrice.toFixed(2)}</span>
                                {hasModifiers && (
                                  <span className="text-xs ml-1">
                                    (Base: ${item.price.toFixed(2)})
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        
                        {/* Display selected modifiers as badges */}
                        {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 mb-2">
                            {item.selectedModifiers.flatMap(modifier => 
                              modifier.options.map((option, index) => (
                                <span 
                                  key={`${modifier.name}-${option.name}-${index}`} 
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800"
                                >
                                  {option.name || modifier.name}
                                  {option.price > 0 && <span className="ml-1 font-medium">+${option.price.toFixed(2)}</span>}
                                </span>
                              ))
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center mt-2">
                          <button 
                            className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center text-sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="mx-2 text-sm">{item.quantity}</span>
                          <button 
                            className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center text-sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                          <button 
                            className="ml-auto text-red-500 hover:text-red-600 transition-colors"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button
                    onClick={closeDrawer}
                    className="text-red-500 font-medium hover:text-red-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Shipping and taxes calculated at checkout
                </p>
                <div className="space-y-2">
                  <Link
                    to="/cart"
                    onClick={closeDrawer}
                    className="block w-full bg-white border border-red-500 text-red-500 py-2 rounded-full font-semibold text-center hover:bg-red-50 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={closeDrawer}
                    className={`block w-full bg-red-500 text-white py-2 rounded-full font-semibold text-center hover:bg-red-600 transition-colors ${
                      items.length === 0 ? 'opacity-70 pointer-events-none' : ''
                    }`}
                  >
                    {items.length === 0 ? 'Your Cart is Empty' : 'Checkout'}
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
