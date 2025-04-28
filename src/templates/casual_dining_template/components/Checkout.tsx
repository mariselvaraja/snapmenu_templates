import React, { useState } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useCart } from '../context/CartContext';
import OrderConfirmation from './OrderConfirmation';
import { cartService } from '../../../services';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
  selectedModifiers?: {
    name: string;
    options: {
      name: string;
      price: number;
    }[];
  }[];
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  specialRequests: string;
}

const Checkout: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [orderResponse, setOrderResponse] = useState<{ message?: string, payment_link?: string } | null>(null);

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
    specialInstructions: ''
  });
  
  // Calculate cart totals
  const subtotal = cart.reduce((total, item) => {
    // Calculate base price
    let itemTotal = parseFloat(item.price) * item.quantity;
    
    // Add modifier prices
    if (item.selectedModifiers && item.selectedModifiers.length > 0) {
      item.selectedModifiers.forEach(modifier => {
        modifier.options.forEach(option => {
          itemTotal += option.price * item.quantity;
        });
      });
    }
    
    return total + itemTotal;
  }, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the order data
      const orderData = {
        items: cart.map(item => {
          // Calculate total item price including modifiers
          let itemPrice = parseFloat(item.price);
          let modifiers: { name: string; price: number }[] = [];
          
          if (item.selectedModifiers && item.selectedModifiers.length > 0) {
            item.selectedModifiers.forEach(modifier => {
              modifier.options.forEach(option => {
                itemPrice += option.price;
                modifiers.push({
                  name: option.name || modifier.name,
                  price: option.price
                });
              });
            });
          }
          
          return {
            id: parseInt(item.id) || 0, // Convert string id to number, default to 0 if conversion fails
            name: item.name,
            price: itemPrice,
            quantity: item.quantity,
            image: item.imageUrl || '', // Use imageUrl as image
            modifiers: modifiers
          };
        }),
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.specialRequests || '', // Use special requests as address
        },
        paymentInfo: {
          method: 'card', // Default payment method
        },
      };

      let restaurant_id = sessionStorage.getItem("franchise_id");
      
      // Call the placeOrder API endpoint
      const response = await cartService.placeOrder(orderData, restaurant_id);
      console.log('Order placed successfully:', response);
      
      setOrderResponse(response);
      
      // Generate a random order ID
      const orderId = Math.floor(10000 + Math.random() * 90000).toString();
      
      // Get current date and time
      const now = new Date();
      const orderDate = now.toISOString().split('T')[0];
      const orderTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Calculate estimated delivery/pickup time (30-45 minutes from now)
      const estimatedDate = new Date(now.getTime() + 40 * 60000);
      const estimatedTime = estimatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Set order details
      setOrderDetails({
        orderId,
        orderDate,
        orderTime,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        orderMethod: 'takeout',
        deliveryAddress: '',
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          selectedModifiers: item.selectedModifiers
        })),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        deliveryFee: '0.00',
        total: total.toFixed(2),
        estimatedTime,
        specialInstructions: formData.specialRequests
      });
      
      // Clear the cart after successful order
      cart.forEach(item => removeFromCart(item.id));
      
      // Show confirmation
      setIsSubmitting(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error placing order:', error);
      setIsSubmitting(false);
      // Handle error (could show an error message to the user)
    }
  };

  if (showConfirmation) {
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
    
    // If no payment_link or it's empty, show the order confirmation
    return <OrderConfirmation orderDetails={orderDetails} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />
      
      {/* Hero Section with Background Image */}
      <div className="relative bg-center bg-cover h-[500px]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-2">Checkout</h1>
            <p className="text-xl">Complete your order</p>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
          </Link>
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-2xl font-semibold">Contact Information</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-zinc-800 text-white ${
                      errors.name ? 'border-red-500' : 'border-zinc-700'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-zinc-800 text-white ${
                      errors.phone ? 'border-red-500' : 'border-zinc-700'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-zinc-800 text-white ${
                      errors.email ? 'border-red-500' : 'border-zinc-700'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-300 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-zinc-800 text-white"
                    placeholder="Any special instructions for your order"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className={`w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors ${
                      (isSubmitting || cart.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : cart.length === 0 ? 'Your Cart is Empty' : 'Complete Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-zinc-900 rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              
              <div className="max-h-60 overflow-y-auto mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="py-2 border-b border-zinc-800">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-md mr-2"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-yellow-400 bg-opacity-20 flex items-center justify-center rounded-md mr-2">
                            <span className="text-sm font-bold text-yellow-400">
                              {item.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">{item.quantity}x</span>
                          <span className="ml-2">{item.name}</span>
                        </div>
                      </div>
                      <span>
                        ${(() => {
                          let totalItemPrice = parseFloat(item.price);
                          
                          if (item.selectedModifiers && item.selectedModifiers.length > 0) {
                            item.selectedModifiers.forEach(modifier => {
                              modifier.options.forEach(option => {
                                totalItemPrice += option.price;
                              });
                            });
                          }
                          
                          return (totalItemPrice * item.quantity).toFixed(2);
                        })()}
                      </span>
                    </div>
                    
                    {/* Display selected modifiers */}
                    {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                      <div className="mt-1 ml-12">
                        {item.selectedModifiers.flatMap(modifier => 
                          modifier.options.map((option, index) => (
                            <div 
                              key={`${modifier.name}-${option.name}-${index}`}
                              className="flex justify-between text-xs text-gray-400"
                            >
                              <span>{option.name || modifier.name}</span>
                              {option.price > 0 && (
                                <span>+${(option.price * item.quantity).toFixed(2)}</span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
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
                <div className="border-t border-zinc-800 pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 text-center mt-6">
                Estimated delivery time: 30-45 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
