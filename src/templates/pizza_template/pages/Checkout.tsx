import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../common/redux';
import { useCart } from '../context/CartContext';
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
  spice_level?: any;
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

interface CartItemOption {
  name: string;
  price: number | string;
}

interface CartItemModifier {
  name: string;
  options: CartItemOption[];
}

interface CartItem {
  pk_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedModifiers?: CartItemModifier[];
}

export default function Checkout() {
  const navigate = useNavigate();
  const { state: { items: cartItems }, clearCart } = useCart();
  
  // Calculate cart totals including modifiers
  const subtotal = cartItems.reduce((total: number, item: any) => {
    // Base item price
    const baseItemPrice = typeof item.price === 'number' ? item.price : 
      parseFloat(String(item.price).replace(/[^\d.-]/g, '')) || 0;
    
    // Calculate modifier total
    let modifierTotal = 0;
    if (item.selectedModifiers && item.selectedModifiers.length > 0) {
      item.selectedModifiers.forEach((modifier: any) => {
        modifier.options.forEach((option: any) => {
          // Ensure option price is a number
          const optionPrice = typeof option.price === 'number' ? option.price : 
            parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0;
          modifierTotal += optionPrice;
        });
      });
    }
    
    // Ensure quantity is a number
    const quantity = typeof item.quantity === 'number' ? item.quantity : 
      parseInt(String(item.quantity)) || 1;
    
    // Calculate total price (base price + modifiers) * quantity
    const itemTotal = (baseItemPrice + modifierTotal) * quantity;
    
    return total + itemTotal;
  }, 0);
  const total = subtotal; // No tax applied

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
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  
  // Function to close the payment popup
  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
  };

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
    const orderedItems: OrderedItem[] = cartItems.map((item:any) => {
      console.log("ITEM", item)

      const formatModifiers = item?.selectedModifiers.filter((modifiers:any)=>!modifiers.name?.toLowerCase().includes("spice"));
      const spiceLevel = item?.selectedModifiers.find((modifiers:any)=>modifiers.name.includes("Spice Level"));
      console.log("spiceLevel", spiceLevel)
      let payloadObj: OrderedItem = {
        name: item.name,
        quantity: item.quantity,
        itemPrice: item.price?.toFixed(2),
        modifiers: formatModifiers,
        modifier_price: "0.00",
        total_item_price: (item.price * item.quantity)?.toFixed(2)
      }
      if(spiceLevel)
      {
        payloadObj = {...payloadObj, spice_level:spiceLevel?.options?.[0]?.name}
      }
     return  payloadObj
    });

    return {
      restaurant_id: "", // Hardcoded as requested
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      special_requests: formData.specialRequests.trim() || null,
      order_type: "manual", // Hardcoded as requested
      ordered_items: orderedItems,
      grand_total: total?.toFixed(2)
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
      let response : any= 
      await cartService.placeOrder(orderData,restaurant_id);
      response = JSON.parse(response)
      console.log('Order placed successfullys:', response);
      
      // Set the response first
      setOrderResponse(response);
      
      // Check for payment link and ensure it's properly detected
      if (response && typeof response === 'object' && 'payment_link' in response && response.payment_link) {
        console.log('Payment link detected:', response.payment_link);
        // Force the payment popup to open immediately
        // setShowPaymentPopup(true);
        window.open(response.payment_link,"_blank")
      }
      
      // Set order complete after all other state updates
      setOrderComplete(true); 
      // Clear the cart after successful order
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error (could show an error message to the user)
    } finally {
      setIsSubmitting(false);
    }
  };

  




  if (orderComplete) {
    if (orderResponse?.payment_link) {
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
                <Check className="h-10 w-10 text-green-500" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
              
              {orderResponse.message && (
                <p className="text-xl text-gray-600 mb-8">{orderResponse.message}</p>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">  
                <Link
                  to="/"
                  className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Payment Popup */}
          {/* {showPaymentPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="relative w-full  h-[100vh] bg-white rounded-lg shadow-xl">
                <div className="absolute top-2 right-2 z-10">
                  <button 
                    onClick={closePaymentPopup}
                    className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <iframe 
                  src={orderResponse.payment_link} 
                  className="w-full h-full border-0 rounded-lg"
                  title="Payment"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
                  allow="payment"
                />
              </div>
            </div>
          )} */}
        </div>
      );
    }
    
    // If no payment link, show the regular order confirmation
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
              <Check className="h-10 w-10 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
            <p className="text-xl text-gray-600 mb-8">Thank you for your order.</p>
            
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
                    {isSubmitting ? 'Processing...' : cartItems.length === 0 ? 'Your Cart is Empty' : 'Pay'}
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
                {cartItems.map((item: CartItem) => (
                  <div key={item.pk_id} className="py-3 border-b">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-md mr-2 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-red-100 flex items-center justify-center rounded-md mr-2 flex-shrink-0">
                            <span className="text-sm font-bold text-red-500">
                              {item.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium">{item.quantity}x</span>
                            <span className="ml-2 font-medium">{item.name}</span>
                          </div>
                          
                          {/* Display selected modifiers */}
                          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                            <div className="mt-1 text-xs text-gray-600">
                              {/* Display non-spice level modifiers */}
                              {item.selectedModifiers.flatMap((modifier: CartItemModifier) => 
                                modifier.name !== "Spice Level" ? 
                                  modifier.options.map((option: CartItemOption, index: number) => (
                                    <div key={`${modifier.name}-${option.name}-${index}`}>
                                      <span>• {option.name || modifier.name}</span>
                                    </div>
                                  ))
                                : []
                              )}
                              
                              {/* Display spice level */}
                              {item.selectedModifiers.flatMap((modifier: CartItemModifier) => 
                                modifier.name === "Spice Level" ? 
                                  modifier.options.map((option: CartItemOption, index: number) => {
                                    let chiliCount = 1; // Default to 1
                                    if (option.name === "Medium") chiliCount = 2;
                                    if (option.name === "Hot") chiliCount = 3;
                                    
                                    return (
                                      <div key={`${modifier.name}-${option.name}-${index}`} className="flex items-center mt-1">
                                        <span className="text-gray-600">• Spice Level: </span>
                                        <span className="ml-1 text-red-500">
                                          {chiliCount === 1 && '🌶️'}
                                          {chiliCount === 2 && '🌶️🌶️'}
                                          {chiliCount === 3 && '🌶️🌶️🌶️'}
                                        </span>
                                        <span className="ml-1 text-gray-600">({option.name})</span>
                                      </div>
                                    );
                                  })
                                : []
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(item.price * item.quantity)?.toFixed(2)}</div>
                        {/* Display modifier prices under item price (excluding spice level) */}
                        {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.selectedModifiers.flatMap((modifier: CartItemModifier) => 
                              modifier.name !== "Spice Level" ? 
                                modifier.options.map((option: CartItemOption, index: number) => {
                                  const optionPrice = typeof option.price === 'number' ? option.price : parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0;
                                  return optionPrice > 0 ? (
                                    <div key={`${modifier.name}-${option.name}-${index}-price`}>
                                      +${(optionPrice * item.quantity).toFixed(2)}
                                    </div>
                                  ) : null;
                                })
                              : []
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
