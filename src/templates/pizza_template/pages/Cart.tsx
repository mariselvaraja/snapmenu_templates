import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch, removeItem, updateItemQuantity, addItem } from '../../../common/redux';
import ModifierModal from '../components/ModifierModal';

export default function Cart() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // State for modifier modal
  const [isModifierModalOpen, setIsModifierModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Define types for cart items and modifiers
  interface CartItemOption {
    name: string;
    price: number | string;
  }

  interface CartItemModifier {
    name: string;
    options: CartItemOption[];
  }

  interface CartItem {
    id: number;
    name: string;
    price: number | string;
    quantity: number | string;
    image?: string;
    selectedModifiers?: CartItemModifier[];
  }

  // Calculate cart totals
  const subtotal = cartItems.reduce((total: number, item: CartItem) => {
    // Ensure price is a number
    const baseItemPrice = typeof item.price === 'number' ? item.price : 
      parseFloat(String(item.price).replace(/[^\d.-]/g, '')) || 0;
    
    // Calculate modifier total
    let modifierTotal = 0;
    if (item.selectedModifiers && item.selectedModifiers.length > 0) {
      item.selectedModifiers.forEach(modifier => {
        modifier.options.forEach(option => {
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
  
  // No tax calculation
  const total = subtotal;

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
  
  // Open modifier modal for editing
  const handleEditItem = (item: any) => {
    setEditingItem({
      ...item,
      modifiers_list: [] // This would normally come from your menu data
    });
    setIsModifierModalOpen(true);
  };
  
  // Close modifier modal
  const handleCloseModifierModal = () => {
    setIsModifierModalOpen(false);
    setEditingItem(null);
  };
  
  // Handle updating item with new modifiers
  const handleUpdateItem = (updatedItem: any) => {
    if (editingItem) {
      // First remove the old item
      dispatch(removeItem(editingItem.id));
      
      // Then add the updated item with the same quantity
      // We need to set the quantity explicitly to avoid incrementing it
      const updatedCartItem = {
        ...updatedItem,
        quantity: editingItem.quantity
      };
      
      // Use setTimeout to ensure the remove action completes first
      setTimeout(() => {
        dispatch(addItem(updatedCartItem));
      }, 0);
    }
    handleCloseModifierModal();
  };
  
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/menu"
            className="inline-flex items-center text-red-500 hover:text-red-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold">Your Cart</h1>
        </motion.div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-semibold">Cart Items ({cartItems.length})</h2>
                </div>
                <ul className="divide-y">
                  {cartItems.map((item: CartItem) => (
                    <li key={item.id} className="p-6 flex items-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg mr-6"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-red-100 flex items-center justify-center rounded-lg mr-6">
                          <span className="text-2xl font-bold text-red-500">
                            {item.name && item.name.length > 0 
                              ? item.name.charAt(0).toUpperCase() 
                              : 'P'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-lg font-semibold">
                            {(() => {
                              // Ensure price is a number
                              const baseItemPrice = typeof item.price === 'number' ? item.price : 
                                parseFloat(String(item.price).replace(/[^\d.-]/g, '')) || 0;
                              
                              // Calculate modifier total
                              let modifierTotal = 0;
                              if (item.selectedModifiers && item.selectedModifiers.length > 0) {
                                item.selectedModifiers.forEach((modifier: CartItemModifier) => {
                                  modifier.options.forEach((option: CartItemOption) => {
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
                              const totalItemPrice = (baseItemPrice ) * quantity;
                              
                              // Ensure we have a valid number before using toFixed
                              const formattedPrice = !isNaN(totalItemPrice) ? 
                                totalItemPrice.toFixed(2) : "0.00";
                              
                              return `$${formattedPrice}`;
                            })()}
                          </p>
                        </div>
                        
                        {/* Display selected modifiers one by one with name on left and price on right */}
                        {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                          <div className="mt-1 mb-2 text-xs text-gray-600">
                            {/* First display all non-spice level modifiers */}
                            {item.selectedModifiers.flatMap((modifier: CartItemModifier) => 
                              modifier.name !== "Spice Level" ? 
                                modifier.options.map((option: CartItemOption, index: number) => (
                                  <div 
                                    key={`${modifier.name}-${option.name}-${index}`} 
                                    className="flex justify-between items-center py-0.5"
                                  >
                                    <span>{option.name || modifier.name}</span>
                                    {(typeof option.price === 'number' ? option.price : parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0) > 0 && 
                                      <span className="font-medium">
                                        +${((typeof option.price === 'number' ? option.price : parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0) * (typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity)) || 1)).toFixed(2)}
                                      </span>
                                    }
                                  </div>
                                ))
                              : []
                            )}
                            
                            {/* Then display spice level modifiers at the end */}
                            {item.selectedModifiers.flatMap((modifier: CartItemModifier) => 
                              modifier.name === "Spice Level" ? 
                                modifier.options.map((option: CartItemOption, index: number) => {
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
                                          className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-sm"
                                          onClick={() => handleQuantityChange(item.id, (typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity)) || 1) - 1)}
                                        >
                                          -
                                        </button>
                                        <span className="mx-2 text-sm">{item.quantity}</span>
                                        <button 
                                          className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-sm"
                                          onClick={() => handleQuantityChange(item.id, (typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity)) || 1) + 1)}
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
                        {/* Add quantity controls if there's no spice level */}
                        {!item.selectedModifiers?.some((modifier: CartItemModifier) => modifier.name === "Spice Level") && (
                          <div className="mt-2">
                            <div className="flex justify-end">
                              <div className="flex items-center">
                                <button 
                                  className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-sm"
                                  onClick={() => handleQuantityChange(item.id, (typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity)) || 1) - 1)}
                                >
                                  -
                                </button>
                                <span className="mx-2 text-sm">{item.quantity}</span>
                                <button 
                                  className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-sm"
                                  onClick={() => handleQuantityChange(item.id, (typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity)) || 1) + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-end mt-2">
                              <button 
                                className="text-red-500 hover:text-red-600 transition-colors text-xs flex items-center"
                                onClick={() => handleEditItem(item)}
                              >
                                <Pencil className="h-3 w-3 mr-1" />
                                Edit
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Add edit button if there is a spice level (since quantity controls are already shown) */}
                        {item.selectedModifiers?.some((modifier: CartItemModifier) => modifier.name === "Spice Level") && (
                          <div className="flex justify-end mt-2">
                            <button 
                              className="text-red-500 hover:text-red-600 transition-colors text-xs flex items-center"
                              onClick={() => handleEditItem(item)}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total?.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  disabled={cartItems.length === 0}
                  className={`w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors mt-6 ${
                    cartItems.length === 0 ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {cartItems.length === 0 ? 'Your Cart is Empty' : 'Proceed to Checkout'}
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Estimated delivery time: 30-45 minutes
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/menu"
              className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
            >
              Browse Menu
            </Link>
          </motion.div>
        )}
      </div>
      
      {/* Modifier Modal for editing items */}
      {isModifierModalOpen && (
        <ModifierModal 
          isOpen={isModifierModalOpen}
          onClose={(updatedItem) => {
            // If an updated item was returned, update it in the cart
            if (updatedItem && editingItem) {
              handleUpdateItem(updatedItem);
            } else {
              handleCloseModifierModal();
            }
          }}
          menuItem={editingItem}
        />
      )}
    </div>
  );
}
