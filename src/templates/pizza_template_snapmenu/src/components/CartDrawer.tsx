import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { RootState } from '../store';
import { removeItem, updateItemQuantity, closeCartDrawer } from '../cartSlice';

const CartDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isCartOpen = useSelector((state: RootState) => state.cart.isCartOpen);

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

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

  const handleCloseCart = () => {
    dispatch(closeCartDrawer());
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">Your Order</h2>
        <button onClick={handleCloseCart} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="flex-grow flex items-center justify-center p-6">
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto p-4">
          <ul className="divide-y">
            {cartItems.map((item) => (
              <li key={item.id} className="py-4">
                <div className="flex items-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-600 mt-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link 
            to="/cart"
            className="block w-full bg-red-500 text-white py-2 rounded-full font-medium hover:bg-red-600 transition-colors text-center"
            onClick={handleCloseCart}
          >
            View Cart
          </Link>
          <Link 
            to="/checkout"
            className="block w-full bg-black text-white py-2 rounded-full font-medium hover:bg-gray-800 transition-colors text-center mt-2"
            onClick={handleCloseCart}
          >
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
