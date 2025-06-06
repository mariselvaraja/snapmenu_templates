import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, Home, RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorDetails {
  code: string;
  message: string;
  timestamp: string;
}

interface OrderDetails {
  orderNumber: string;
  amount: number;
}

export default function PaymentFailure() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Extract error and order details from location state or URL params
    const searchParams = new URLSearchParams(location.search);
    const errorCode = searchParams.get('errorCode');
    const errorMessage = searchParams.get('errorMessage');
    const orderNumber = searchParams.get('orderNumber');
    const amount = searchParams.get('amount');
    
    // Set error details from URL params or location state
    if (location.state) {
      setErrorDetails(location.state.errorDetails);
      setOrderDetails(location.state.orderDetails);
    } else if (errorCode || errorMessage || orderNumber) {
      setErrorDetails({
        code: errorCode || 'PAYMENT_FAILED',
        message: errorMessage || 'Payment could not be processed. Please try again.',
        timestamp: new Date().toISOString()
      });
      setOrderDetails({
        orderNumber: orderNumber || 'N/A',
        amount: amount ? parseFloat(amount) : 0
      });
    }
  }, [location]);

  const handleRetryPayment = () => {
    // Navigate back to checkout or payment page
    navigate('/checkout');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getErrorIcon = () => {
    if (errorDetails?.code === 'INSUFFICIENT_FUNDS') {
      return <AlertTriangle className="h-12 w-12 text-red-500" />;
    }
    return <XCircle className="h-12 w-12 text-red-500" />;
  };

  const getErrorTitle = () => {
    if (errorDetails?.code === 'INSUFFICIENT_FUNDS') {
      return 'Insufficient Funds';
    }
    if (errorDetails?.code === 'CARD_DECLINED') {
      return 'Card Declined';
    }
    if (errorDetails?.code === 'NETWORK_ERROR') {
      return 'Connection Error';
    }
    return 'Payment Failed';
  };

  const getErrorDescription = () => {
    if (errorDetails?.code === 'INSUFFICIENT_FUNDS') {
      return 'Your account does not have sufficient funds to complete this transaction.';
    }
    if (errorDetails?.code === 'CARD_DECLINED') {
      return 'Your card was declined. Please check your card details or try a different payment method.';
    }
    if (errorDetails?.code === 'NETWORK_ERROR') {
      return 'There was a connection issue while processing your payment. Please check your internet connection and try again.';
    }
    return errorDetails?.message || 'We encountered an issue while processing your payment. Please try again.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          {getErrorIcon()}
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {getErrorTitle()}
          </h1>
          <p className="text-gray-600 mb-6">
            {getErrorDescription()}
          </p>
        </motion.div>

        {/* Error Details */}
        {/* {errorDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-50 rounded-lg p-4 mb-6 text-left"
          >
            <h3 className="font-semibold text-gray-800 mb-3">Error Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Error Code:</span>
                <span className="font-medium text-red-600">{errorDetails.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {new Date(errorDetails.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </motion.div>
        )} */}

        {/* Order Details */}
        {/* {orderDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 rounded-lg p-4 mb-6 text-left"
          >
            <h3 className="font-semibold text-gray-800 mb-3">Order Information</h3>
            <div className="space-y-2 text-sm">
              {orderDetails.orderNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{orderDetails.orderNumber}</span>
                </div>
              )}
              {orderDetails.amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${orderDetails.amount.toFixed(2)}</span>
                </div>
              )}
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
            onClick={handleRetryPayment}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleGoBack}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
            
            <button
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
          </div>
        </motion.div> */}

        {/* Help Text */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg"
        >
          <p className="text-sm text-blue-800 mb-2 font-medium">
            Need Help?
          </p>
          <p className="text-xs text-blue-600">
            If you continue to experience issues, please contact our support team or try using a different payment method.
          </p>
        </motion.div> */}

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-gray-500 mt-4"
        >
          Your order has been saved and no charges were made to your account.
        </motion.p>
      </motion.div>
    </div>
  );
}
