import React, { useContext } from 'react';
import { CartContext, useCart } from '../context/CartContext';
import { Trash, X, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartDrawer: React.FC = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { isCartOpen, toggleCart } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div
      className={`fixed top-0 right-0 min-h-screen w-96 bg-black text-white shadow-2xl border-l border-zinc-800 z-50 transform transition-transform duration-300 ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Order</h2>
          <button 
            onClick={toggleCart} 
            className="text-gray-400 hover:text-white transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Cart Content */}
        {cart.length === 0 ? (
          <div className="flex-grow flex justify-center items-center p-6">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b border-zinc-800">
                  {/* Item Image */}
                  <div className="w-20 h-20 mr-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <div className="text-yellow-400 font-semibold mt-1">${item.price.toFixed(2)}</div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded-full border border-zinc-700 hover:border-zinc-500 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="mx-3 min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full border border-zinc-700 hover:border-zinc-500 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Price & Remove */}
                  <div className="text-right">
                    <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="mt-2 text-red-500 hover:text-red-400 transition"
                      aria-label="Remove item"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer with Total and Checkout Button - Fixed at bottom */}
            <div className="mt-auto p-4 border-t border-zinc-800 sticky bottom-0 bg-black">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold text-yellow-400">${calculateTotal()}</span>
              </div>
              
              <Link to="/checkout" className="block w-full">
                <button 
                  onClick={toggleCart}
                  className="bg-yellow-400 text-black py-3 px-4 rounded-md text-lg font-semibold hover:bg-yellow-300 transition w-full"
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
