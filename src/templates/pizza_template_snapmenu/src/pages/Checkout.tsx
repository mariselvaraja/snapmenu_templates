import React, { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Clock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearCart } from '../cartSlice';
import { setOrder, setOrderLoading, setOrderError, OrderDetails } from '../orderSlice';
import { createOrder, OrderData } from '../services/orderService';
import OrderConfirmation from '../components/OrderConfirmation';

export default function Checkout() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { loading = false, error = null, currentOrder = null } = useSelector((state: RootState) => state.order || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Order type state
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  
  // Customer information state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Validation state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  
  // Order confirmation state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  // Validate form
  const validateForm = () => {
    let isValid = true;

    // Reset all error messages
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setAddressError('');

    // Validate name
    if (!name.trim()) {
      setNameError('Please enter your name');
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError('Please enter your phone number');
      isValid = false;
    }

    // Validate address for delivery orders
    if (orderType === 'delivery' && !address.trim()) {
      setAddressError('Please enter your delivery address');
      isValid = false;
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      dispatch(setOrderError('Your cart is empty. Please add items to your cart before checking out.'));
      return;
    }

    dispatch(setOrderLoading());

    try {
      // Create order data object
      const orderData: OrderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        orderMethod: orderType === 'delivery' ? 'delivery' : 'takeout',
        orderDate: new Date().toISOString().split('T')[0],
        orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        deliveryAddress: orderType === 'delivery' ? address : undefined,
        specialInstructions: specialInstructions.trim() || undefined
      };

      // Call the API to create the order
      const apiDetails = await createOrder(orderData);

      // Convert API response to match our Redux OrderDetails interface
      const orderDetails: OrderDetails = {
        id: apiDetails.orderId,
        orderId: apiDetails.orderId,
        items: cartItems,
        subtotal: parseFloat(apiDetails.subtotal),
        tax: parseFloat(apiDetails.tax),
        total: parseFloat(apiDetails.total),
        orderType: orderType,
        orderMethod: apiDetails.orderMethod,
        customerName: apiDetails.customerName,
        customerEmail: apiDetails.customerEmail,
        customerPhone: apiDetails.customerPhone,
        deliveryAddress: apiDetails.deliveryAddress,
        paymentMethod: paymentMethod,
        status: apiDetails.status,
        createdAt: apiDetails.createdAt,
        estimatedDeliveryTime: apiDetails.estimatedTime,
        specialInstructions: apiDetails.specialInstructions,
        orderDate: apiDetails.orderDate,
        orderTime: apiDetails.orderTime,
        paymentInfo: apiDetails.paymentInfo
      };

      // Store in Redux
      dispatch(setOrder(orderDetails));
      
      // Store for confirmation component
      setOrderDetails(orderDetails);
      
      // Clear the cart
      dispatch(clearCart());
      
      // If payment link is available, open it in a new tab
      if (apiDetails.paymentInfo?.payment_link) {
        window.open(apiDetails.paymentInfo.payment_link, '_blank');
      } else {
        // Show confirmation
        setShowConfirmation(true);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      dispatch(setOrderError('Failed to create order. Please try again.'));
    }
  };

  // If showing confirmation, render the OrderConfirmation component
  if (showConfirmation && orderDetails) {
    return <OrderConfirmation orderDetails={orderDetails} />;
  }

  // If cart is empty and not in confirmation flow, redirect to cart
  if (cartItems.length === 0 && !showConfirmation && !currentOrder) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              You need to add items to your cart before checking out.
            </p>
            <Link
              to="/menu"
              className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            to="/cart"
            className="inline-flex items-center text-red-500 hover:text-red-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
          </Link>
          <h1 className="text-4xl font-bold">Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold">Order Details</h2>
              </div>
              
              {error && (
                <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Order Type Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Order Type</h3>
                  <div className="flex rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 ${
                        orderType === 'delivery' ? 'bg-red-500 text-white' : 'bg-gray-100'
                      }`}
                    >
                      <Truck className="h-5 w-5" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
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

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        className={`w-full px-4 py-2 border ${nameError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                        placeholder="John Doe"
                      />
                      {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className={`w-full px-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                        placeholder="john.doe@example.com"
                      />
                      {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                        className={`w-full px-4 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                        placeholder="(555) 123-4567"
                      />
                      {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
                    </div>
                    
                    {orderType === 'delivery' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address
                        </label>
                        <textarea
                          value={address}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)}
                          className={`w-full px-4 py-2 border ${addressError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                          placeholder="123 Main St, Anytown, CA 12345"
                          rows={3}
                        ></textarea>
                        {addressError && <p className="mt-1 text-sm text-red-600">{addressError}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Credit Card"
                        checked={paymentMethod === 'Credit Card'}
                        onChange={() => setPaymentMethod('Credit Card')}
                        className="h-4 w-4 text-red-500 focus:ring-red-500"
                      />
                      <span className="ml-2">Credit Card</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash"
                        checked={paymentMethod === 'Cash'}
                        onChange={() => setPaymentMethod('Cash')}
                        className="h-4 w-4 text-red-500 focus:ring-red-500"
                      />
                      <span className="ml-2">Cash on {orderType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                    </label>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSpecialInstructions(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Any special requests or instructions for your order"
                    rows={3}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </form>
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
              
              <div className="max-h-80 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-3 border-b">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>
                  {orderType === 'delivery' 
                    ? 'Estimated delivery time: 30-45 minutes' 
                    : 'Estimated pickup time: 15-20 minutes'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
