import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Receipt, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderDetails {
  orderNumber: string;
  timestamp: string;
}

interface PaymentDetails {
  amount: number;
  transactionId: string;
  method: string;
}

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    // Extract order and payment details from location state or URL params
    const searchParams = new URLSearchParams(location.search);
    const orderNumber = searchParams.get('orderNumber');
    const amount = searchParams.get('amount');
    const transactionId = searchParams.get('transactionId');
    
    // Set order details from URL params or location state
    if (location.state) {
      setOrderDetails(location.state.orderDetails);
      setPaymentDetails(location.state.paymentDetails);
    } else if (orderNumber || amount || transactionId) {
      setOrderDetails({
        orderNumber: orderNumber || 'N/A',
        timestamp: new Date().toISOString()
      });
      setPaymentDetails({
        amount: amount ? parseFloat(amount) : 0,
        transactionId: transactionId || 'N/A',
        method: 'Card Payment'
      });
    }
  }, [location]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewReceipt = () => {
    // Navigate to receipt page or download receipt
    console.log('View receipt clicked');
    // You can implement receipt viewing logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="h-12 w-12 text-green-500" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. Thank you for your order!
          </p>
        </motion.div>

        {/* Order Details */}
        {/* {orderDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-lg p-4 mb-6 text-left"
          >
            <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{orderDetails.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(orderDetails.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {new Date(orderDetails.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </motion.div>
        )} */}

        {/* Payment Details */}
        {/* {paymentDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-green-50 rounded-lg p-4 mb-6 text-left"
          >
            <h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-green-600">
                  ${paymentDetails.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">{paymentDetails.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{paymentDetails.method}</span>
              </div>
            </div>
          </motion.div>
        )} */}

        {/* Action Buttons */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <button
            onClick={handleViewReceipt}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Receipt className="h-5 w-5" />
            View Receipt
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div> */}

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-gray-500 mt-6"
        >
          A confirmation email has been sent to your registered email address.
        </motion.p>
      </motion.div>
    </div>
  );
}
