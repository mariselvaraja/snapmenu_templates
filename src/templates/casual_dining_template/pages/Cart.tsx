import React from 'react';
import { motion } from 'framer-motion';
import { Trash, ArrowLeft, Minus, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { toggleDrawer } from '../../../redux/slices/cartSlice';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Calculate cart totals
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price) * (item.quantity || 1), 0);
  };
  
  const subtotal = calculateTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/menu"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mb-4"
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
              <div className="bg-zinc-900 rounded-lg shadow-lg overflow-hidden border border-zinc-800">
                <div className="p-6 border-b border-zinc-800">
                  <h2 className="text-2xl font-semibold">Cart Items ({cart.length})</h2>
                </div>
                <ul className="divide-y divide-zinc-800">
                  {cart.map((item) => (
                    <li key={item.id} className="p-6 flex items-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg mr-6"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-zinc-800 flex items-center justify-center rounded-lg mr-6">
                          <span className="text-2xl font-bold text-yellow-400">
                            {item.name && item.name.length > 0 
                              ? item.name.charAt(0).toUpperCase() 
                              : 'F'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-yellow-400 font-semibold">${item.price}</p>
                        <div className="flex items-center mt-2">
                          <button 
                            className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="mx-3">{item.quantity || 1}</span>
                          <button 
                            className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-yellow-400">
                          ${((parseFloat(item.price) || 0) * (item.quantity || 1))?.toFixed(2)}
                        </p>
                        <button 
                          className="text-red-500 hover:text-red-400 transition-colors mt-2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash className="h-5 w-5" />
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
              <div className="bg-zinc-900 rounded-lg shadow-lg p-6 sticky top-24 border border-zinc-800">
                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Subtotal</span>
                    <span>${subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Tax (8%)</span>
                    <span>${tax?.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-zinc-800 pt-4 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-yellow-400">${total?.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  disabled={cart.length === 0}
                  className={`w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors mt-6 ${
                    cart.length === 0 ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {cart.length === 0 ? 'Your Cart is Empty' : 'Proceed to Checkout'}
                </button>
                <p className="text-sm text-zinc-400 text-center mt-4">
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
            <p className="text-zinc-400 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/menu"
              className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
            >
              Browse Menu
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
