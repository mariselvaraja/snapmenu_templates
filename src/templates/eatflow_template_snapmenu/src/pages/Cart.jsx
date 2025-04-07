import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export function Cart() {
  const { cart, removeFromCart, clearCart, calculateTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-16">
        <h2 className="text-3xl font-semibold text-center">Your cart is empty</h2>
        <p className="text-center mt-4">
          <Link to="/menu" className="text-green-500 hover:text-green-700">
            Browse the menu and add items to your cart
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-3xl font-semibold mb-8">Your Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-500">${item.price}</p>
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
      <div className="mt-8 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: ${calculateTotal().toFixed(2)}</p>
        <div>
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-4"
          >
            Clear Cart
          </button>
          <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
