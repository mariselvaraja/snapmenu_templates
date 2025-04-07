import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, Loader2, ShoppingBag, MapPin, Phone, Mail, Clock, CreditCard, FileText, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { OrderDetails } from '../orderSlice';
import { getOrder } from '../services/orderService';

interface OrderConfirmationProps {
  orderDetails: OrderDetails & {
    paymentInfo?: {
      message: string;
      payment_link: string;
    };
  };
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderDetails }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  
  // Automatically show payment popup if payment info is available
  useEffect(() => {
    if (orderDetails.paymentInfo?.payment_link) {
      setShowPaymentPopup(true);
    }
  }, [orderDetails]);
  
  // If the component receives an ID but not full details, fetch the details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = orderDetails.id || orderDetails.orderId;
      if (orderId && !orderDetails.items?.length) {
        try {
          setLoading(true);
          const details = await getOrder(orderId);
          // Update the orderDetails with the fetched data
          // In a real app, you might use a state setter or Redux action here
          Object.assign(orderDetails, details);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching order details:', err);
          setError('Failed to load order details. Please try again.');
          setLoading(false);
        }
      }
    };
    
    fetchOrderDetails();
  }, [orderDetails]);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString; // fallback to original format
    }
  };

  // Use the ID or orderId as the confirmation code if available, otherwise generate one
  const confirmationCode = orderDetails.id 
    ? orderDetails.id.substring(0, 8).toUpperCase() 
    : orderDetails.orderId
    ? orderDetails.orderId.substring(0, 8).toUpperCase()
    : Math.random().toString(36).substring(2, 10).toUpperCase();

  if (loading) {
    return (
      <div className="py-20 bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-20 bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Order</h2>
          <p className="mb-6">{error}</p>
          <Link
            to="/order"
            className="bg-red-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-600 transition-colors inline-block"
          >
            Return to Orders
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-6">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-300">
            {orderDetails.orderType === 'delivery' 
              ? 'Your delicious pizza is on its way!' 
              : 'Your order will be ready for pickup soon!'}
          </p>
          {orderDetails.paymentInfo && (
            <button 
              onClick={() => setShowPaymentPopup(true)}
              className="mt-6 bg-green-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center justify-center mx-auto"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Make Payment
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900 rounded-xl p-8 shadow-xl border border-gray-800 mb-10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <ShoppingBag className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Order Type</h3>
                  <p className="text-gray-300">{orderDetails.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Estimated Time</h3>
                  <p className="text-gray-300">{orderDetails.estimatedDeliveryTime || '30-45 minutes'}</p>
                </div>
              </div>
              
              {orderDetails.orderType === 'delivery' && orderDetails.deliveryAddress && (
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Delivery Address</h3>
                    <p className="text-gray-300">{orderDetails.deliveryAddress}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <CreditCard className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Payment Method</h3>
                  <p className="text-gray-300">{orderDetails.paymentMethod}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Name</h3>
                  <p className="text-gray-300">{orderDetails.customerName}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Email</h3>
                  <p className="text-gray-300">{orderDetails.customerEmail}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Phone</h3>
                  <p className="text-gray-300">{orderDetails.customerPhone}</p>
                </div>
              </div>
              
              {orderDetails.specialInstructions && (
                <div className="flex items-start">
                  <FileText className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Special Instructions</h3>
                    <p className="text-gray-300">{orderDetails.specialInstructions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 mt-8">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Order Confirmation Code</div>
              <div className="font-mono text-xl text-red-500 font-bold">{confirmationCode}</div>
              <p className="text-sm text-gray-400 mt-2">
                A confirmation email has been sent to {orderDetails.customerEmail}
              </p>
              <p className="text-sm text-gray-400">
                Order placed on {formatDate(orderDetails.createdAt)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-900 rounded-xl p-8 shadow-xl border border-gray-800 mb-10"
        >
          <h3 className="text-xl font-semibold mb-6 text-red-500">Order Summary</h3>
          
          <div className="space-y-6">
            {orderDetails.items.map((item) => (
              <div key={item.id} className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{item.name}</h4>
                  <p className="text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-6 pt-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">${orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Tax</span>
              <span className="text-white">${orderDetails.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-white">Total</span>
              <span className="text-red-500">${orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
        >
          {orderDetails.paymentInfo && (
            <button 
              onClick={() => setShowPaymentPopup(true)}
              className="bg-green-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Make Payment
            </button>
          )}
          
          <Link
            to="/menu"
            className="bg-red-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            Order Again
          </Link>
          
          <Link
            to="/"
            className="bg-gray-800 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return Home
          </Link>
          
          <button
            onClick={() => window.print()}
            className="bg-gray-800 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            Print Receipt
          </button>
        </motion.div>
      </div>

      {/* Payment Popup */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-800">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white">Complete Your Payment</h3>
              <button 
                onClick={() => setShowPaymentPopup(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-grow overflow-auto">
              {orderDetails.paymentInfo && orderDetails.paymentInfo.payment_link ? (
                <iframe 
                  src={orderDetails.paymentInfo.payment_link} 
                  className="w-full h-full min-h-[500px]" 
                  title="Payment Gateway"
                  frameBorder="0"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="text-red-500 text-5xl mb-4">!</div>
                    <h2 className="text-2xl font-bold mb-4 text-white">Payment Error</h2>
                    <p className="text-gray-300 mb-6">
                      We couldn't process your payment at this time. Please try again later or contact customer support.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
