import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../common/store';
import { toggleDrawer, updateItemQuantityByCharacteristics, removeItemByCharacteristics } from '../../../../common/redux/slices/inDiningCartSlice';

interface InDiningCartDrawerProps {
  onPlaceOrder?: () => void;
}

const InDiningCartDrawer: React.FC<InDiningCartDrawerProps> = ({ onPlaceOrder }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { drawerOpen, items } = useSelector((state: RootState) => state.inDiningCart);
  const tablename = sessionStorage.getItem('Tablename');

  // Calculate subtotal including modifiers
  const subtotal = items.reduce((total: number, item: any) => {
    // Base item price
    let baseItemPrice = typeof item.price === 'number' ? item.price : 
      parseFloat(String(item.price).replace(/[^\d.-]/g, '')) || 0;
    
    // Calculate modifier total
    let modifierTotal = 0;
    if (item.selectedModifiers && item.selectedModifiers.length > 0) {
      item.selectedModifiers.forEach((modifier: any) => {
        modifier.options.forEach((option: any) => {
          // Ensure option price is a number
          const optionPrice = typeof option.price === 'number' ? option.price : 
            parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0;
          
          modifierTotal += optionPrice;
        });
      });
    }
    
    // Ensure quantity is a number
    const quantity = typeof item.quantity === 'number' ? item.quantity : 
      parseInt(String(item.quantity)) || 1;
    
    // Calculate total price (base price + modifiers) * quantity
    const itemTotal = (baseItemPrice + modifierTotal) * quantity;
    
    return total + itemTotal;
  }, 0);

  // Calculate item count
  const itemCount = items.reduce((total: number, item: any) => {
    const quantity = typeof item.quantity === 'number' ? item.quantity : 
      parseInt(String(item.quantity)) || 1;
    return total + quantity;
  }, 0);

  const closeDrawer = () => {
    dispatch(toggleDrawer(false));
  };

  const handleRemoveItem = (item: any) => {
    dispatch(removeItemByCharacteristics(item));
  };

  const handleQuantityChange = (item: any, quantity: number) => {
    dispatch(updateItemQuantityByCharacteristics({ item, quantity }));
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
            className="fixed inset-0 bg-black"
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
            <div className="flex items-center justify-between border-b p-4 ">
              <div>
                <h2 className="text-xl font-bold flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-red-500" />
                  Your Order {itemCount > 0 && `(${itemCount})`}
                </h2>
                <p className="text-xs text-gray-500">
                  Table Number: {tablename}
                </p>
              </div>
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
                  {items.map((item: any) => (
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
                            {/* Calculate and display item price * quantity including modifiers */}
                            {(() => {
                              // Ensure price is a number
                              const baseItemPrice = typeof item.price === 'number' ? item.price : 
                                parseFloat(String(item.price).replace(/[^\d.-]/g, '')) || 0;
                              
                              // Calculate modifier total
                              let modifierTotal = 0;
                              if (item.selectedModifiers && item.selectedModifiers.length > 0) {
                                item.selectedModifiers.forEach((modifier: any) => {
                                  modifier.options.forEach((option: any) => {
                                    // Ensure option price is a number
                                    const optionPrice = typeof option.price === 'number' ? option.price : 
                                      parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0;
                                    
                                    modifierTotal += optionPrice;
                                  });
                                });
                              }
                              
                              // Ensure quantity is a number
                              const quantity = typeof item.quantity === 'number' ? item.quantity : 
                                parseInt(String(item.quantity)) || 1;
                              
                              // Calculate total price (base price + modifiers) * quantity
                              const totalItemPrice = (baseItemPrice + modifierTotal) * quantity;
                              
                              // Ensure we have a valid number before using toFixed
                              const formattedPrice = !isNaN(totalItemPrice) ? 
                                totalItemPrice.toFixed(2) : "0.00";
                              
                              return (
                                <span className="font-medium">${formattedPrice}</span>
                              );
                            })()}
                          </div>
                        </div>
                        
                        {/* Display selected modifiers one by one with name on left and price on right */}
                        {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                          <div className="mt-1 mb-2 text-xs text-gray-600">
                            {/* First display all non-spice level modifiers */}
                            {item.selectedModifiers.flatMap((modifier: any) => 
                              modifier.name !== "Spice Level" ? 
                                modifier.options.map((option: any, index: number) => (
                                  <div 
                                    key={`${modifier.name}-${option.name}-${index}`} 
                                    className="flex justify-between items-center py-0.5"
                                  >
                                    <span>{option.name || modifier.name}</span>
                                    {(() => {
                                      const optionPrice = typeof option.price === 'number' ? option.price : 
                                        parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0;
                                      const quantity = typeof item.quantity === 'number' ? item.quantity : 
                                        parseInt(String(item.quantity)) || 1;
                                      const totalPrice = optionPrice * quantity;
                                      
                                      // Always show price, even if it's $0.00
                                      return (
                                        <span className="font-medium">
                                          +${totalPrice.toFixed(2)}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                ))
                              : []
                            )}
                            
                            {/* Then display spice level modifiers at the end with quantity controls on the right */}
                            {item.selectedModifiers.flatMap((modifier: any) => 
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
                                        {/* Spice Level:  */}
                                        <span className="ml-1 text-red-500">
                                          {chiliCount === 1 && '🌶️'}
                                          {chiliCount === 2 && '🌶️🌶️'}
                                          {chiliCount === 3 && '🌶️🌶️🌶️'}
                                        </span>
                                      </span>
                                      
                                      {/* Quantity controls moved to right side of spice level */}
                                      <div className="flex items-center">
                                        <button 
                                          className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-xs"
                                          onClick={() => {
                                            // Ensure quantity is a number
                                            const quantity = typeof item.quantity === 'number' ? item.quantity : 
                                              parseInt(String(item.quantity)) || 1;
                                            handleQuantityChange(item, quantity - 1);
                                          }}
                                        >
                                          -
                                        </button>
                                        <span className="mx-2 text-xs">
                                          {typeof item.quantity === 'number' ? item.quantity : 
                                            parseInt(String(item.quantity)) || 1}
                                        </span>
                                        <button 
                                          className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-xs"
                                          onClick={() => {
                                            // Ensure quantity is a number
                                            const quantity = typeof item.quantity === 'number' ? item.quantity : 
                                              parseInt(String(item.quantity)) || 1;
                                            handleQuantityChange(item, quantity + 1);
                                          }}
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
                        
                        {/* Add quantity controls for items without spice level */}
                        {!item.selectedModifiers?.some((modifier: any) => modifier.name === "Spice Level") && (
                          <div className="mt-2 flex justify-end">
                            <div className="flex items-center">
                              <button 
                                className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-xs"
                                onClick={() => {
                                  // Ensure quantity is a number
                                  const quantity = typeof item.quantity === 'number' ? item.quantity : 
                                    parseInt(String(item.quantity)) || 1;
                                  handleQuantityChange(item, quantity - 1);
                                }}
                              >
                                -
                              </button>
                              <span className="mx-2 text-xs">
                                {typeof item.quantity === 'number' ? item.quantity : 
                                  parseInt(String(item.quantity)) || 1}
                              </span>
                              <button 
                                className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-xs"
                                onClick={() => {
                                  // Ensure quantity is a number
                                  const quantity = typeof item.quantity === 'number' ? item.quantity : 
                                    parseInt(String(item.quantity)) || 1;
                                  handleQuantityChange(item, quantity + 1);
                                }}
                              >
                                +
                              </button>
                            </div>
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
              <div className="border-t p-4 z-10">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${!isNaN(subtotal) ? subtotal.toFixed(2) : "0.00"}</span>
                </div>
                
                {/* Place Order Button */}
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
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InDiningCartDrawer;
