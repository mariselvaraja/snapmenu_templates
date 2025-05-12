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
            <div className="flex items-center justify-between border-b p-4">
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
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="text-gray-600">
                            {/* Calculate and display total price including modifiers */}
                            {(() => {
                              let totalItemPrice = item.price;
                              
                              if (item.selectedModifiers && item.selectedModifiers.length > 0) {
                                item.selectedModifiers.forEach(modifier => {
                                  modifier.options.forEach(option => {
                                    totalItemPrice += option.price;
                                  });
                                });
                              }
                              
                              return (
                                <span className="font-medium">${totalItemPrice?.toFixed(2)}</span>
                              );
                            })()}
                          </div>
                        </div>
                        
                        {/* Display selected modifiers one by one with name on left and price on right */}
                        {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                          <div className="mt-1 mb-2 text-xs text-gray-600">
                            {/* First display all non-spice level modifiers */}
                            {item.selectedModifiers.flatMap(modifier => 
                              modifier.name !== "Spice Level" ? 
                                modifier.options.map((option, index) => (
                                  <div 
                                    key={`${modifier.name}-${option.name}-${index}`} 
                                    className="flex justify-between items-center py-0.5"
                                  >
                                    <span>{option.name || modifier.name}</span>
                                    {option.price > 0 && <span className="font-medium">${option.price?.toFixed(2)}</span>}
                                  </div>
                                ))
                              : []
                            )}
                            
                            {/* Then display spice level modifiers at the end */}
                            {item.selectedModifiers.flatMap(modifier => 
                              modifier.name === "Spice Level" ? 
                                modifier.options.map((option, index) => {
                                  let chiliCount = 1; // Default to 1
                                  if (option.name === "Medium") chiliCount = 2;
                                  if (option.name === "Hot") chiliCount = 3;
                                  
                                  return (
                                    <div 
                                      key={`${modifier.name}-${option.name}-${index}`} 
                                      className="flex justify-between items-center py-0.5"
                                    >
                                      <span className="flex items-center">
                                        {/* Spice Level:  */}
                                        <span className="ml-1 text-red-500">
                                          {chiliCount === 1 && '🌶️'}
                                          {chiliCount === 2 && '🌶️🌶️'}
                                          {chiliCount === 3 && '🌶️🌶️🌶️'}
                                        </span>
                                      </span>
                                      <div className="flex items-center">
                                        <button 
                                          className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-xs"
                                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        >
                                          -
                                        </button>
                                        <span className="mx-1 text-sm">{item.quantity}</span>
                                        <button 
                                          className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-xs"
                                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              : []
                            )}
                          </div>
                        )}
                        
                        {/* Quantity controls moved to spice level row */}
                        {!item.selectedModifiers?.some(modifier => modifier.name === "Spice Level") && (
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
                          </div>
                        )}
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
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${subtotal?.toFixed(2)}</span>
                </div>
               
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
