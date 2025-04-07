import React from 'react';
import { useCart } from '../context/CartContext';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, clearCart, calculateTotal, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">Your Order</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      {cart.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-green-500 text-center italic">Your cart is currently empty. Add some delicious items from our menu!</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto p-4">
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-2" />
                  <div>
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-gray-500">${item.price}</p>
                    <div className="flex items-center mt-1">
                      <button onClick={() => decreaseQuantity(item.id)} className="text-gray-500 hover:text-gray-700">-</button>
                      <span className="mx-2 text-sm">{item.quantity || 1}</span>
                      <button onClick={() => increaseQuantity(item.id)} className="text-gray-500 hover:text-gray-700">+</button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cart.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700">Subtotal:</p>
            <p className="text-gray-700">${calculateTotal().toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700">Tax (8%):</p>
            <p className="text-gray-700">${(calculateTotal() * 0.08).toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">Total:</p>
            <p className="text-lg font-semibold">${(calculateTotal() * 1.08).toFixed(2)}</p>
          </div>
          <Link to="/checkout" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full block text-center">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
