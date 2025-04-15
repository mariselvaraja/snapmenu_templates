import React from 'react';
import { X, ShoppingBag, Trash, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../../common/redux';
import { removeItem, updateItemQuantity } from '../../../../common/redux/slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';

export function CartDrawer({ isOpen, onClose }) {
  // Use Redux instead of context
  const { items, total } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();
  
  // Calculate item count
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Handle quantity update
  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeItem(id));
    } else {
      dispatch(updateItemQuantity({ id, quantity }));
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`
          fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-white shadow-xl z-[70]
          transform transition-transform duration-300 ease-in-out border-l-2 border-orange-200
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <header className="px-6 py-4 border-b border-orange-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-orange-500" />
              Your Order {itemCount > 0 && `(${itemCount})`}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-orange-50 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="text-orange-500 font-medium hover:text-orange-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-orange-100">
                {items.map((item) => (
                  <li key={item.id} className="p-4 flex">
                    {/* Item Image with Fallback */}
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-orange-100 flex items-center justify-center rounded-lg mr-4">
                        <span className="text-xl font-bold text-orange-500">
                          {item.name && item.name.length > 0 
                            ? item.name.charAt(0).toUpperCase() 
                            : 'F'}
                        </span>
                      </div>
                    )}
                    
                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-serif text-gray-800">{item.name}</h3>
                      <p className="text-orange-600 font-semibold">{formatPrice(item.price)}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center mt-2">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-sm hover:bg-gray-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="mx-2 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-sm hover:bg-gray-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => dispatch(removeItem(item.id))} 
                          className="ml-auto text-red-500 hover:text-red-600 transition-colors"
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

          {items.length > 0 && (
            <div className="border-t border-orange-100 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold text-orange-600">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Shipping and taxes calculated at checkout
              </p>
              <div className="space-y-2">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="block w-full bg-white border border-orange-500 text-orange-500 py-2 rounded-full font-semibold text-center hover:bg-orange-50 transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full bg-orange-500 text-white py-2 rounded-full font-semibold text-center hover:bg-orange-600 transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
