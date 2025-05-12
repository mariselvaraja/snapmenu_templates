import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function Checkout() {
  const { cart, calculateTotal, isCartOpen, toggleCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
  const navigate = useNavigate();

  // Calculate cart totals
  const subtotal = calculateTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  useEffect(() => {
    if (isCartOpen) {
      toggleCart();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setPlacingOrder(true);
    
    const ordered_items = cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      itemPrice: Number(item.price),
      modifiers: []
    }));

    const payload = {
      "restaurant_id": "e62f39bc-7e8a-4da3-8c47-ed8d8fe28aba",
      "name": formData.name,
      "phone": formData.phone,
      "email": formData.email,
      "ordered_items": ordered_items,
      "grand_total": total?.toFixed(2),
      "special_requests": formData.specialRequests.trim() || "",
      "order_type": "manual"
    };
    
    try {
      // Call the placeOrder API endpoint
      console.log('Placing order with payload:', payload);
      
      const response = await axios.post(`http://localhost:5093/restaurant/placeOrder?restaurant_id=${payload.restaurant_id}`, payload);
      console.log('Order placed successfully:', response.data);
      
      setOrderResponse(response.data);
      setOrderComplete(true);
      // Clear the cart after successful order
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error (could show an error message to the user)
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderComplete) {
    // If payment_link exists, show it in a full-page iframe
    if (orderResponse?.payment_link) {
      return (
        <div className="fixed inset-0 w-full h-full z-50">
          <iframe 
            src={orderResponse.payment_link} 
            className="w-full h-full border-0"
            title="Payment"
          />
        </div>
      );
    }
    
    // If no payment_link, show the order confirmation message
    return (
      <div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              {orderResponse?.message || "Thank you for your order. We've received your order and will begin preparing it right away."}
            </p>
            <p className="text-gray-600 mb-8">
              A confirmation email has been sent to {formData.email}.
            </p>
            <Link
              to="/"
              className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div >
      {/* Hero Section */}
      <div className="relative h-[40vh] mb-12">
        <div className="absolute inset-0">
          <img
            src="https://plus.unsplash.com/premium_photo-1678051386853-5623e723745a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Contact background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <ShoppingCart className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Checkout
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Complete your order
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
          </Link>
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold">Contact Information</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Any special instructions for your order"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={placingOrder || cart.length === 0}
                    className={`w-full bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600 transition-colors ${
                      (placingOrder || cart.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {placingOrder ? 'Processing...' : cart.length === 0 ? 'Your Cart is Empty' : 'Complete Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              
              <div className="max-h-60 overflow-y-auto mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-md mr-2"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-md mr-2">
                          <span className="text-sm font-bold text-green-500">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{item.quantity}x</span>
                        <span className="ml-2">{item.name}</span>
                      </div>
                    </div>
                    <span>${(Number(item.price) * item.quantity)?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax?.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total?.toFixed(2)}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 text-center mt-6">
                Estimated delivery time: 30-45 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
