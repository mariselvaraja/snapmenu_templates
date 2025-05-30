import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, calculateTotal, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  // Calculate cart totals
  const subtotal = calculateTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/menu"
            className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold">Your Cart</h1>
        </motion.div>

        {cart.length > 0 ? (
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
                  <h2 className="text-2xl font-semibold">Cart Items ({cart.length})</h2>
                </div>
                <ul className="divide-y">
                  {cart.map((item) => (
                    <li key={item.id} className="p-6 flex items-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg mr-6"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-green-100 flex items-center justify-center rounded-lg mr-6">
                          <span className="text-2xl font-bold text-green-500">
                            {item.name && item.name.length > 0 
                              ? item.name.charAt(0).toUpperCase() 
                              : 'F'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-600">${item.price}</p>
                        <div className="flex items-center mt-2">
                          <button 
                            className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            -
                          </button>
                          <span className="mx-3">{item.quantity || 1}</span>
                          <button 
                            className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ${((parseFloat(item.price) || 0) * (item.quantity || 1))?.toFixed(2)}
                        </p>
                        <button 
                          className="text-red-500 hover:text-red-600 transition-colors mt-2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
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
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax?.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total?.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  disabled={cart.length === 0}
                  className={`w-full bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600 transition-colors mt-6 ${
                    cart.length === 0 ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {cart.length === 0 ? 'Your Cart is Empty' : 'Proceed to Checkout'}
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
              className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              Browse Menu
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
