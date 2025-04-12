import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Clock, Truck, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { useDispatch } from 'react-redux';
import { fetchMenuRequest } from '../shared/redux/slices/menuSlice';
import { addItem, updateItemQuantity, removeItem } from '../shared/redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

export default function Order() {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const loading = useSelector((state: RootState) => state.menu.loading);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch menu items if not already loaded
    if (menuItems.length === 0 && !loading) {
      dispatch(fetchMenuRequest());
    }
  }, [dispatch, menuItems.length, loading]);

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Order Online</h1>
          <p className="text-xl text-gray-600">
            Fresh, hot pizza delivered to your door or ready for pickup
          </p>
        </motion.div>

        {/* Order Type Selection */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex rounded-lg overflow-hidden">
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 ${
                orderType === 'delivery' ? 'bg-red-500 text-white' : 'bg-gray-100'
              }`}
            >
              <Truck className="h-5 w-5" />
              <span>Delivery</span>
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 ${
                orderType === 'pickup' ? 'bg-red-500 text-white' : 'bg-gray-100'
              }`}
            >
              <Clock className="h-5 w-5" />
              <span>Pickup</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Menu</h2>
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading menu items...</p>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-8">
                  <p>No menu items available</p>
                </div>
              ) : (
                menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-1/3 object-cover"
                    />
                  ) : (
                    <div className="w-1/3 bg-red-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-red-500">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <p className="text-lg font-bold text-red-500">${item.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => dispatch(addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        image: item.image || ''
                      }))}
                      className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              
              {cartItems && cartItems.length > 0 ? (
                <div className="space-y-4 mb-6">
                  <ul className="divide-y">
                    {cartItems.map((item) => (
                      <li key={item.id} className="py-4 flex items-center justify-between">
                        <div className="flex items-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg mr-4"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-red-100 flex items-center justify-center rounded-lg mr-4">
                              <span className="text-xl font-bold text-red-500">
                                {item.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end mt-2">
                            <button 
                              onClick={() => {
                                if (item.quantity > 1) {
                                  dispatch(updateItemQuantity({ id: item.id, quantity: item.quantity - 1 }));
                                } else {
                                  dispatch(removeItem(item.id));
                                }
                              }}
                              className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button 
                              onClick={() => dispatch(updateItemQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                              className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => dispatch(removeItem(item.id))}
                            className="text-red-500 hover:text-red-600 transition-colors mt-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              )}


              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${cartItems && cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>${cartItems && (cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartItems && (cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) * 1.08).toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className={`w-full bg-red-500 text-white py-3 rounded-full mt-6 font-semibold hover:bg-red-600 transition-colors ${
                  cartItems && cartItems.length === 0 ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={cartItems && cartItems.length === 0} // Disable if cart is empty
              >
                {cartItems && cartItems.length === 0 ? 'Your Cart is Empty' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
