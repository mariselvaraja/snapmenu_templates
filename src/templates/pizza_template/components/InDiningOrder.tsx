import { motion } from 'framer-motion';
import { useState } from 'react';
import { Utensils, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../common/store';
import { useDispatch } from 'react-redux';
import { addItem, updateItemQuantity, removeItem } from '../../../common/redux/slices/cartSlice';

export default function InDiningOrder() {
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const loading = useSelector((state: RootState) => state.menu.loading);
  const dispatch = useDispatch<AppDispatch>();

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    
    // Generate a random order number
    const randomOrderNumber = Math.floor(10000 + Math.random() * 90000).toString();
    setOrderNumber(randomOrderNumber);
    setOrderPlaced(true);
    
    // In a real application, you would send the order to a backend service here
    console.log('Order placed:', {
      items: cartItems,
      orderNumber: randomOrderNumber,
      timestamp: new Date().toISOString()
    });
  };

  const resetOrder = () => {
    setOrderPlaced(false);
    // Clear cart items
    cartItems.forEach(item => {
      dispatch(removeItem(item.id));
    });
  };

  if (orderPlaced) {
    return (
      <div className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
            <p className="text-xl text-gray-600 mb-2">Your order number is:</p>
            <p className="text-4xl font-bold text-red-500 mb-6">{orderNumber}</p>
            <p className="text-gray-600 mb-8">
              We've received your order. Your delicious pizza will be served shortly!
            </p>
            <button
              onClick={resetOrder}
              className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition-colors"
            >
              Place Another Order
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="md:col-span-2">
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
                      Add to Order
                    </button>
                  </div>
                </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
