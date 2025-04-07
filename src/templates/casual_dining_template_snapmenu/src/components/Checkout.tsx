import React, { useState } from 'react';
import { createOrder, OrderDetails as ApiOrderDetails } from '../services/orderService';
import { ShoppingCart } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { useCart } from '../context/CartContext';
import OrderConfirmation from './OrderConfirmation';

const Checkout: React.FC = () => {
  const [orderMethod, setOrderMethod] = useState<'takeout' | 'delivery'>('takeout');
  const { cart } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Use the same OrderItem interface as in OrderConfirmation
  interface OrderItem {
    id: string;
    name: string;
    price: string;
    quantity: number;
    imageUrl: string;
  }

  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    orderDate: '',
    orderTime: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    orderMethod: 'takeout' as 'takeout' | 'delivery',
    deliveryAddress: '',
    items: [] as OrderItem[],
    subtotal: '',
    tax: '',
    deliveryFee: '',
    total: '',
    estimatedTime: '',
    specialInstructions: '',
    paymentInfo: undefined as { message: string; payment_link: string } | undefined
  });
  
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  };
  
  const calculateTax = () => {
    return (parseFloat(calculateSubtotal()) * 0.08).toFixed(2);
  };
  
  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const tax = parseFloat(calculateTax());
    const deliveryFee = orderMethod === 'delivery' ? 2.99 : 0;
    return (subtotal + tax + deliveryFee).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />
      
      {/* Hero Section with Background Image */}
      <div className="relative bg-center bg-cover h-96" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-6xl font-bold mb-4">Checkout</h1>
            <p className="text-2xl">Complete your order</p>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Customer Information */}
          <div className="lg:w-2/3 bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">How would you like to receive your order?</h2>
            
            {/* Order Method Selection */}
            <div className="flex mb-8 gap-4">
              <div 
                className={`w-1/2 p-4 border rounded-lg cursor-pointer transition ${
                  orderMethod === 'takeout' 
                    ? 'border-yellow-400 bg-zinc-800' 
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
                onClick={() => setOrderMethod('takeout')}
              >
                <div className="text-center">
                  <div className="text-yellow-400 text-xl mb-2">Takeout</div>
                  <p className="text-gray-400 text-sm">Pick up at restaurant</p>
                </div>
              </div>
              
              <div 
                className={`w-1/2 p-4 border rounded-lg cursor-pointer transition ${
                  orderMethod === 'delivery' 
                    ? 'border-yellow-400 bg-zinc-800' 
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
                onClick={() => setOrderMethod('delivery')}
              >
                <div className="text-center">
                  <div className="text-yellow-400 text-xl mb-2">Delivery</div>
                  <p className="text-gray-400 text-sm">Delivered to your address</p>
                </div>
              </div>
            </div>
            
            {/* Customer Information Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {orderMethod === 'takeout' ? 'Pickup Information' : 'Delivery Information'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-gray-300 text-sm font-bold mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-zinc-800 text-white border-zinc-700"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-300 text-sm font-bold mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-zinc-800 text-white border-zinc-700"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-zinc-800 text-white border-zinc-700"
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-300 text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-zinc-800 text-white border-zinc-700"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              
              {orderMethod === 'delivery' && (
                <div className="mb-4">
                  <label htmlFor="address" className="block text-gray-300 text-sm font-bold mb-2">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-zinc-800 text-white border-zinc-700 mb-2"
                    placeholder="Street Address"
                  />
                  <input
                    type="text"
                    id="addressLine2"
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-zinc-800 text-white border-zinc-700"
                    placeholder="Apt, Suite, etc. (optional)"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="pickupTime" className="block text-gray-300 text-sm font-bold mb-2">
                  {orderMethod === 'takeout' ? 'Preferred Pickup Time' : 'Preferred Delivery Time'}
                </label>
                <input
                  type="datetime-local"
                  id="pickupTime"
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-zinc-800 text-white border-zinc-700"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-gray-300 text-sm font-bold mb-2">
                  Special Instructions (optional)
                </label>
                <textarea
                  id="notes"
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-zinc-800 text-white border-zinc-700 h-24"
                  placeholder="Any special requests or notes for your order..."
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-zinc-900 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center py-2 border-b border-zinc-800">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p>${(parseFloat(item?.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-b border-zinc-700 py-4 my-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax (8%):</span>
                  <span>${calculateTax()}</span>
                </div>
                {orderMethod === 'delivery' && (
                  <div className="flex justify-between mb-2">
                    <span>Delivery Fee:</span>
                    <span>$2.99</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
              
              <button
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-6 rounded-full w-full text-lg transition"
                type="button"
                onClick={async () => {
                  try {
                    // Get form values
                    const firstName = (document.getElementById('firstName') as HTMLInputElement)?.value || 'Guest';
                    const lastName = (document.getElementById('lastName') as HTMLInputElement)?.value || 'User';
                    const email = (document.getElementById('email') as HTMLInputElement)?.value || 'guest@example.com';
                    const phone = (document.getElementById('phone') as HTMLInputElement)?.value || '555-555-5555';
                    const address = (document.getElementById('address') as HTMLInputElement)?.value || '';
                    const notes = (document.getElementById('notes') as HTMLTextAreaElement)?.value || '';
                    
                    // Get current date and time
                    const now = new Date();
                    const orderDate = now.toISOString().split('T')[0];
                    const orderTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    // Calculate estimated delivery/pickup time (30-45 minutes from now)
                    const estimatedTime = orderMethod === 'delivery' ? '30-45 minutes' : '15-20 minutes';
                    
                    // Create order data
                    const orderData = {
                      orderDate,
                      orderTime,
                      customerName: `${firstName} ${lastName}`,
                      customerEmail: email,
                      customerPhone: phone,
                      orderMethod,
                      deliveryAddress: address,
                      items: cart.map(item => ({
                        ...item,
                        price: item.price.toString()
                      })),
                      subtotal: calculateSubtotal(),
                      tax: calculateTax(),
                      deliveryFee: orderMethod === 'delivery' ? '2.99' : '0.00',
                      total: calculateTotal(),
                      estimatedTime,
                      specialInstructions: notes
                    };
                    
                    // Call the API to create the order
                    const details = await createOrder(orderData);
                    
                    // If payment link is available, open it in a new tab
                    if (details.paymentInfo?.payment_link) {
                      window.open(details.paymentInfo.payment_link, '_blank');
                    } else {
                      // Set order details for confirmation
                      setOrderDetails({
                        orderId: details.orderId,
                        orderDate: details.orderDate,
                        orderTime: details.orderTime,
                        customerName: details.customerName,
                        customerEmail: details.customerEmail,
                        customerPhone: details.customerPhone,
                        orderMethod: details.orderMethod,
                        deliveryAddress: details.deliveryAddress || '',
                        items: details.items,
                        subtotal: details.subtotal,
                        tax: details.tax,
                        deliveryFee: details.deliveryFee || '0.00',
                        total: details.total,
                        estimatedTime: details.estimatedTime,
                        specialInstructions: details.specialInstructions || '',
                        paymentInfo: details.paymentInfo
                      });
                      
                      // Show confirmation
                      setShowConfirmation(true);
                    }
                  } catch (error) {
                    console.error('Error creating order:', error);
                    // You could add error handling here
                  }
                }}
              >
                Place Order
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
  
  // If confirmation is shown, render the OrderConfirmation component
  if (showConfirmation) {
    return <OrderConfirmation orderDetails={orderDetails} />;
  }
};

export default Checkout;
