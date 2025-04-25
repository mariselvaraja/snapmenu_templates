import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch, clearCart } from '../../../common/redux';
import { cartService } from '../../../services';

interface FormData {
  name: string;
  phone: string;
  email: string;
  specialRequests: string;
}

interface Modifier {
  modifier_name: string;
  modifier_price: string;
}

interface OrderedItem {
  name: string;
  quantity: number;
  itemPrice: string;
  modifiers: Modifier[];
  modifier_price: string;
  total_item_price: string;
}

interface OrderPayload {
  restaurant_id: string;
  name: string;
  phone: string;
  email: string;
  special_requests: string | null;
  order_type: string;
  ordered_items: OrderedItem[];
  grand_total: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderResponse, setOrderResponse] = useState<{ message?: string, payment_link?: string } | null>(null);
  

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

  const createOrderPayload = (): OrderPayload => {
    const orderedItems: OrderedItem[] = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      itemPrice: item.price.toFixed(2),
      modifiers: [
        // Example modifiers - in a real app, these would come from user selections
        {
          modifier_name: "extra cheese",
          modifier_price: "1.50"
        },
        {
          modifier_name: "garlic",
          modifier_price: "0.50"
        }
      ],
      modifier_price: "0.00",
      total_item_price: (item.price * item.quantity).toFixed(2)
    }));

    return {
      restaurant_id: "2256b9a6-5d53-4b77-b6a0-539043489ad3", // Hardcoded as requested
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      special_requests: formData.specialRequests.trim() || null,
      order_type: "manual", // Hardcoded as requested
      ordered_items: orderedItems,
      grand_total: total.toFixed(2)
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create the order payload
    const orderPayload = createOrderPayload();
    
    try {
      // Call the placeOrder API endpoint
      console.log('Placing order with payload:', orderPayload);
      
      // Convert the order payload to the format expected by cartService.placeOrder
      const orderData = {
        items: cartItems,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: '', // Not collected in this form
        },
        paymentInfo: {
          method: 'card', // Default payment method
        },
      };

      let restaurant_id = sessionStorage.getItem("franchise_id");
      
      // Call the placeOrder API endpoint
      const response = await cartService.placeOrder(orderData,restaurant_id);
      console.log('Order placed successfully:', response);
      
      // Handle the specific response format:
      // {"message":"Order Placed Make Payment","payment_link":"https://api.ipospays.tech/v1/sl/BFtqv_240425021156"}
      if (response && response.payment_link && response.payment_link.includes('ipospays.tech')) {
        console.log('Payment link from ipospays.tech detected:', response.payment_link);
      }
      
      setOrderResponse(response);
      setOrderComplete(true);
      // Clear the cart after successful order
      dispatch(clearCart());
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error (could show an error message to the user)
    } finally {
      setIsSubmitting(false);
    }
  };

  




  if (orderComplete) {
    // If payment_link exists and payment is still pending, show it in a full-page iframe
    if (orderResponse?.payment_link) {
      return (
        <div className="fixed inset-0 w-full h-full z-50 flex flex-col">

          <iframe 
            src={orderResponse.payment_link} 
            className="w-full flex-1 border-0"
            title="Payment"
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
            allow="payment"
          />
        </div>
      );
    }
    
    // If payment is completed or cancelled, or if there's no payment link, show the order confirmation message
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <Link
              to="/"
              className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
            >
              Return to Home
            </Link>
          </motion.div>
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="Any special instructions for your order"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className={`w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors ${
                      (isSubmitting || cartItems.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : cartItems.length === 0 ? 'Your Cart is Empty' : 'Complete Order'}
                  </button>
                </div>
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
              
              <div className="max-h-60 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-md mr-2"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-red-100 flex items-center justify-center rounded-md mr-2">
                          <span className="text-sm font-bold text-red-500">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{item.quantity}x</span>
                        <span className="ml-2">{item.name}</span>
                      </div>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
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
              
              <p className="text-sm text-gray-500 text-center mt-6">
                Estimated delivery time: 30-45 minutes
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
