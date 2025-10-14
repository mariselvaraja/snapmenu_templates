import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../common/store';
import { useAppSelector } from '../../../../common/redux';
import { makePaymentRequest, makeRequestCheckRequest, resetPaymentState } from '../../../../common/redux/slices/paymentSlice';
import { clearCurrentOrder } from '../../../../common/redux/slices/inDiningOrderSlice';
import { motion } from 'framer-motion';
import { usePayment } from '../../../../hooks/usePayment';
import { useToast } from '../../context/ToastContext';
import RenderSpice from '@/components/renderSpicelevel';
import usePaymentManagement from '../../hooks/usePaymentManagement';
import { clearCart } from '../../../../common/redux/slices/inDiningCartSlice';
import VerifyingPaymentPopup from '../VerifyingPaymentPopup';
import PaymentSuccessPopup from '../PaymentSuccessPopup';
import PaymentFailedProcessingPopup from '../PaymentFailedProcessingPopup';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  modifiers?: {
    modifier_name?: string;
    modifier_price?: number;
    modified_price?: number;
    price?: number;
    name?: string;
    options?: {
      name: string;
      price: number;
    }[];
  }[];
  spiceLevel?: string | null;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface CartItem {
  pk_id?: number;
  id?: string | number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  selectedModifiers?: {
    name: string;
    options: {
      name: string;
      price: number;
    }[];
  }[];
}

interface QuickBillComponentProps {
  onClose: () => void;
  onOrderSuccess?: () => void; // Callback for successful order placement
  cartItems: CartItem[]; // Cart items to place order
  specialRequest?: string; // Special request from cart
  displayName?: string; // Optional display name instead of table
}

const QuickBillComponent: React.FC<QuickBillComponentProps> = ({ onClose, onOrderSuccess, cartItems, specialRequest = '', displayName = 'Quick Menu' }) => {
  const dispatch = useDispatch();
  const { isLoading, isRequestCheckLoading, error, paymentResponse, requestCheckResponse } = useSelector((state: RootState) => state.payment);
  const [wasRequestCheckLoading, setWasRequestCheckLoading] = React.useState<boolean>(false);
  const { isPaymentAvilable } = usePayment();
  const { showToast } = useToast();
  const [paymentMessage, setPaymentMessage] = React.useState<string>('');
  const [isPaymentSuccess, setIsPaymentSuccess] = React.useState<boolean>(false);

  // Use the payment management hook from checkout
  const {
    showVerifyingPaymentPopup,
    showPaymentFailedPopup,
    showPaymentFailedProcessingPopup,
    showPaymentSuccessPopup,
    initiatePayment,
    handlePaymentSuccess,
    handlePaymentRetry,
    resetAllPopupStates
  } = usePaymentManagement();

  // Reset payment state when component mounts
  useEffect(() => {
    dispatch(resetPaymentState());
    setPaymentMessage('');
    setIsPaymentSuccess(false);
  }, [dispatch]);

  // Clear in-dining order state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch]);

  // Track loading state changes for request check
  useEffect(() => {
    if (isRequestCheckLoading && !wasRequestCheckLoading) {
      setWasRequestCheckLoading(true);
    }
    
    if (!isRequestCheckLoading && wasRequestCheckLoading) {
      setTimeout(() => {
        handleClose();
        showRequestCheckPopup(requestCheckResponse?.status || false, requestCheckResponse?.message);
        setWasRequestCheckLoading(false);
      }, 500);
    }
  }, [isRequestCheckLoading, wasRequestCheckLoading, error, requestCheckResponse]);

  const showRequestCheckPopup = (status: boolean, message: any) => {
    if (status) {
      showToast(message, 'success');
    }
  };

  const handleClose = () => {
    onClose();
  };
  
  // Calculate subtotal from cart items including modifiers
  const subtotal = cartItems.reduce((total: number, item: CartItem) => {
    // Base item price
    const baseItemPrice = typeof item.price === 'number' ? item.price : 
      parseFloat(String(item.price).replace(/[^\d.-]/g, '')) || 0;
    
    // Calculate modifier total
    let modifierTotal = 0;
    if (item.selectedModifiers && item.selectedModifiers.length > 0) {
      item.selectedModifiers.forEach((modifier) => {
        modifier.options.forEach((option) => {
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

  const totalAmount = subtotal;

  // State for order submission
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittingMethod, setSubmittingMethod] = React.useState<'takeout' | 'pay_online' | null>(null);
  const [orderResponse, setOrderResponse] = React.useState<{ message?: string, payment_link?: string } | null>(null);
  
  // Form state for customer info
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [formErrors, setFormErrors] = React.useState<{name?: string; phone?: string; email?: string}>({});

  // Validate form
  const validateForm = (): boolean => {
    const errors: {name?: string; phone?: string; email?: string} = {};
    
    // Name is mandatory
    if (!customerName.trim()) {
      errors.name = 'Name is required';
    }
    
    // Phone is mandatory
    if (!customerPhone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(customerPhone.replace(/[^\d]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    // Email is optional, but validate format if provided
    if (customerEmail.trim() && !/\S+@\S+\.\S+/.test(customerEmail)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Pay Later (Takeout) - Place order with pay_now: false
  const handlePayLater = async () => {
    if (!validateForm()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    await handleSubmit('takeout');
  };

  // Handle Pay Online (Pay Now) - Place order with pay_now: true
  const handlePayOnline = async () => {
    if (!validateForm()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    await handleSubmit('pay_online');
  };

  // Handle order submission - Similar to checkout component
  const handleSubmit = async (method: 'takeout' | 'pay_online') => {
    setIsSubmitting(true);
    setSubmittingMethod(method);

    try {
      // Create order payload similar to checkout
      const orderPayload = createOrderPayload(method);
      
      console.log('Placing quick menu order with payload:', orderPayload);
      
      const restaurant_id = sessionStorage.getItem("franchise_id");
      
      // Import cartService from common services
      const { cartService } = await import('../../../../common/services');
      
      // Place the order
      let response: any = await cartService.placeOrder(orderPayload, restaurant_id);
      response = JSON.parse(response);
      console.log('Order placed successfully:', response);
      
      // Set the response
      setOrderResponse(response);
      
      // Check for payment link
      if (response && typeof response === 'object' && 'payment_link' in response && response.payment_link) {
        console.log('Payment link detected:', response.payment_link);
        // Use payment management system to initiate payment
        initiatePayment(response.payment_link);
      } else {
        // No payment link - this is a takeout order
        if (method === 'takeout') {
          showToast('Order placed! Please pay at counter', 'success');
          dispatch(clearCart());
          handleClose();
          // Call onOrderSuccess callback to reset view
          if (onOrderSuccess) {
            onOrderSuccess();
          }
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
      setSubmittingMethod(null);
    }
  };

  // Create order payload
  const createOrderPayload = (method: 'takeout' | 'pay_online') => {
    const orderedItems = cartItems.map((item: CartItem) => {
      const formatModifiers = item.selectedModifiers?.filter((modifiers) => 
        !modifiers.name?.toLowerCase().includes("spice")
      ) || [];
      
      const spiceLevel = item.selectedModifiers?.find((modifiers) => 
        modifiers.name.includes("Spice Level")
      );
      
      // Ensure price is a number
      const itemPrice = typeof item.price === 'number' ? item.price : 
        parseFloat(String(item.price)) || 0;
      const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 
        parseInt(String(item.quantity)) || 1;
      
      let payloadObj: any = {
        name: item.name,
        quantity: itemQuantity,
        itemPrice: itemPrice.toFixed(2),
        image: item.image,
        modifiers: formatModifiers,
        modifier_price: "0.00",
        total_item_price: (itemPrice * itemQuantity).toFixed(2)
      };
      
      if (spiceLevel) {
        payloadObj = { ...payloadObj, spice_level: spiceLevel?.options?.[0]?.name };
      }
      
      return payloadObj;
    });

    return {
      items: cartItems,
      customerInfo: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: specialRequest,
      },
      paymentInfo: {
        method: 'card',
      },
      delivery_type: 'pickup',
      order_type: 'quick_menu', // Set order_type to quick_menu
      pay_now: method === 'pay_online',
    };
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        const currentDate = new Date();
        return currentDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
      
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      const currentDate = new Date();
      return currentDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  // Handle payment response - similar to checkout component
  useEffect(() => {
    if (paymentResponse && typeof paymentResponse === 'object' && 'payment_link' in paymentResponse && paymentResponse.payment_link) {
      console.log('Payment link detected:', paymentResponse.payment_link);
      // Use payment management system to initiate payment
      initiatePayment(paymentResponse.payment_link);
    }
  }, [paymentResponse, initiatePayment]);

  // Check if payment should be available - based on payment hook
  const isPaymentAvailable = isPaymentAvilable;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Bill Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold">Bill Details</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Bill Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4" id="bill-content">
            {/* Display Name */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{displayName}</h1>
            </div>
            
            {/* Customer Information Form */}
            <div className="mb-6 space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (formErrors.name) {
                      setFormErrors({ ...formErrors, name: undefined });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (formErrors.phone) {
                      setFormErrors({ ...formErrors, phone: undefined });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    if (formErrors.email) {
                      setFormErrors({ ...formErrors, email: undefined });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email (optional)"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
            </div>
            
            {/* Bill Info */}
            <div className="text-sm mb-6 border-b border-gray-200 pb-4">
              <div className="flex justify-between">
                <p><span className="font-medium">Items:</span> {cartItems.length}</p>
                <p>{formatDate(new Date().toISOString())}</p>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mb-6">
              <div className="border-b border-gray-200 pb-2 mb-2">
                <div className="flex justify-between">
                  <span className="font-medium">Item</span>
                  <div className="flex">
                    <span className="font-medium w-16 text-center">Qty</span>
                    <span className="font-medium w-20 text-right">Price</span>
                  </div>
                </div>
              </div>
              
              {cartItems.map((item: CartItem, index: number) => (
                <div key={`${item.id || index}`} className="py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex">
                      <span className="w-16 text-center">{item.quantity}</span>
                      <span className="w-20 text-right">
                        ${(() => {
                          const baseItemPrice = typeof item.price === 'number' ? item.price : 
                            parseFloat(String(item.price || 0)) || 0;
                          
                          let modifierTotal = 0;
                          if (item.selectedModifiers && item.selectedModifiers.length > 0) {
                            item.selectedModifiers.forEach((modifier) => {
                              modifier.options.forEach((option) => {
                                const optionPrice = typeof option.price === 'number' ? option.price : 
                                  parseFloat(String(option.price || 0)) || 0;
                                modifierTotal += optionPrice;
                              });
                            });
                          }
                          
                          const quantity = typeof item.quantity === 'number' ? item.quantity : 
                            parseInt(String(item.quantity || 1)) || 1;
                          
                          const totalPrice = (baseItemPrice + modifierTotal) * quantity;
                          
                          return !isNaN(totalPrice) ? totalPrice.toFixed(2) : "0.00";
                        })()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Modifiers */}
                  {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {item.selectedModifiers.flatMap((modifier) => 
                        modifier.name !== "Spice Level" ? 
                          modifier.options.map((option, optIndex) => (
                            <div 
                              key={`${modifier.name}-${option.name}-${optIndex}`} 
                              className="flex justify-between items-center py-0.5"
                            >
                              <span>{option.name || modifier.name}</span>
                              {(() => {
                                const optionPrice = typeof option.price === 'number' ? option.price : 
                                  parseFloat(String(option.price || 0)) || 0;
                                const totalPrice = optionPrice * item.quantity;
                                
                                return totalPrice > 0 ? (
                                  <span className="font-medium">
                                    (+${totalPrice.toFixed(2)})
                                  </span>
                                ) : null;
                              })()}
                            </div>
                          ))
                        : []
                      )}
                      
                      {/* Spice Level */}
                      {item.selectedModifiers.flatMap((modifier) => 
                        modifier.name === "Spice Level" ? 
                          modifier.options.map((option, optIndex) => (
                            <div key={`${modifier.name}-${option.name}-${optIndex}`} className="py-0.5">
                              <RenderSpice spice={option.name} />
                            </div>
                          ))
                        : []
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>${Number(totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Bottom Payment Section - Only show if payment is available and table exists */}
        {isPaymentAvailable && totalAmount > 0 && (
          <div className="border-t border-gray-200 bg-white p-4">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {/* Payment Message Display */}
            {paymentMessage && (
              <div className={`mb-4 p-3 border rounded ${
                isPaymentSuccess 
                  ? 'bg-green-100 border-green-400 text-green-700' 
                  : 'bg-red-100 border-red-400 text-red-700'
              }`}>
                <div className="font-semibold mb-1">
                  {isPaymentSuccess ? 'Payment Success' : 'Payment Error'}
                </div>
                {paymentResponse && (
                  <div className="mb-4 p-3 bg-gray-100 border border-gray-400 text-gray-700 rounded text-xs">
                    <div>{JSON.stringify(paymentResponse)}</div>
                  </div>
                )}
              </div>
            )}
            
            {/* Action Buttons - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Pay Later Button */}
              <button 
                onClick={handlePayLater}
                disabled={isSubmitting || isLoading}
                className="py-3 bg-black text-white rounded-lg flex items-center justify-center font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && submittingMethod === 'takeout' ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Pay Later'
                )}
              </button>
              
              {/* Pay Online Button */}
              <button 
                onClick={handlePayOnline}
                disabled={isSubmitting || isLoading}
                className="py-3 bg-red-500 text-white rounded-lg flex items-center justify-center font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && submittingMethod === 'pay_online' ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Pay Online'
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Payment Popup Components - Same as checkout */}
      <VerifyingPaymentPopup
        isOpen={showVerifyingPaymentPopup}
        onClose={() => resetAllPopupStates()}
      />

      <PaymentSuccessPopup
        isOpen={showPaymentSuccessPopup}
        onClose={() => resetAllPopupStates()}
        onContinue={() => handlePaymentSuccess(() => {
          dispatch(clearCart());
          handleClose();
        })}
      />

      <PaymentFailedProcessingPopup
        isOpen={showPaymentFailedProcessingPopup}
        onClose={() => resetAllPopupStates()}
        onTryAgain={() => handlePaymentRetry(() => {
          // Retry the payment with the same payment link
          if (paymentResponse?.payment_link) {
            initiatePayment(paymentResponse.payment_link);
          }
        })}
      />
    </motion.div>
  );
};

export default QuickBillComponent;
