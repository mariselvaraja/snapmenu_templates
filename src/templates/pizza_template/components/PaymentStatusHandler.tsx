import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import usePaymentManagement from '../hooks/usePaymentManagement';

interface PaymentStatusHandlerProps {
  // Optional callback when payment status is determined
  onPaymentStatusDetermined?: (status: 'success' | 'failed') => void;
  // Optional callback for in-dining try again flow
  onInDiningTryAgain?: () => void;
  // Optional callback for in-dining continue (success) flow
  onInDiningContinue?: () => void;
}

const PaymentStatusHandler: React.FC<PaymentStatusHandlerProps> = ({ 
  onPaymentStatusDetermined,
  onInDiningTryAgain,
  onInDiningContinue
}) => {
  const [showPaymentSuccessPopup, setShowPaymentSuccessPopup] = useState(false);
  const [showPaymentFailedPopup, setShowPaymentFailedPopup] = useState(false);
  const [showVerifyingStatusPopup, setShowVerifyingStatusPopup] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchPaymentStatus } = usePaymentManagement();

  // Check for responseCode, transactionId, or payment_status query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const responseCode = searchParams.get('responseCode');
    const transactionId = searchParams.get('transactionId');
    const paymentStatus = searchParams.get('payment_status');
    
    // Handle responseCode parameter (existing functionality)
    if (responseCode === '200') {
      setShowPaymentSuccessPopup(true);
      onPaymentStatusDetermined?.('success');
    } else if (responseCode === '400') {
      setShowPaymentFailedPopup(true);
      onPaymentStatusDetermined?.('failed');
    }
    
    // Handle transactionId parameter for Square payment status check
    if (transactionId) {
      checkSquarePaymentStatus(transactionId);
    }
    
    // Handle payment_status parameter for Clover payment status check
    if (paymentStatus) {
      checkCloverPaymentStatus(paymentStatus);
    }
  }, [location.search]);

  // Function to remove query parameters from URL
  const removeQueryParams = () => {
    const currentPath = location.pathname;
    navigate(currentPath, { replace: true });
  };

  // Function to check Square payment status using transactionId
  const checkSquarePaymentStatus = async (transactionId: string) => {
    try {
      console.log('Checking Square payment status for transactionId:', transactionId);
      
      // Show verifying status popup
      setShowVerifyingStatusPopup(true);
      
      // Use the fetchPaymentStatus function from usePaymentManagement hook
      const paymentStatus = await fetchPaymentStatus(transactionId);
      
      console.log('Square payment status result:', paymentStatus);
      
      // Hide verifying status popup
      setShowVerifyingStatusPopup(false);
      
      // Check if payment was successful based on the status
      if (paymentStatus?.status) {
        console.log('Square payment successful');
        setShowPaymentSuccessPopup(true);
        onPaymentStatusDetermined?.('success');
      } else {
        console.log('Square payment failed');
        setShowPaymentFailedPopup(true);
        onPaymentStatusDetermined?.('failed');
      }
    } catch (error) {
      console.error('Error checking Square payment status:', error);
      // Hide verifying status popup
      setShowVerifyingStatusPopup(false);
      // On error, show payment failed popup
      setShowPaymentFailedPopup(true);
      onPaymentStatusDetermined?.('failed');
    }
  };

  // Function to check Clover payment status using payment_status query parameter
  const checkCloverPaymentStatus = (paymentStatus: string) => {
    console.log('Checking Clover payment status for payment_status:', paymentStatus);
    
    // Check if payment was successful based on the payment_status parameter
    if (paymentStatus.toLowerCase() === 'success') {
      console.log('Clover payment successful');
      setShowPaymentSuccessPopup(true);
      onPaymentStatusDetermined?.('success');
    } else {
      console.log('Clover payment failed');
      setShowPaymentFailedPopup(true);
      onPaymentStatusDetermined?.('failed');
    }
  };

  // Handle continue button click
  const handleContinue = () => {
    setShowPaymentSuccessPopup(false);
    setShowPaymentFailedPopup(false);
    removeQueryParams();
    
    // If in-dining continue callback is provided, use it
    if (onInDiningContinue) {
      onInDiningContinue();
    }
  };

  // Handle try again button click for failed payments
  const handleTryAgain = () => {
    setShowPaymentFailedPopup(false);
    removeQueryParams();
    
    // If in-dining callback is provided, use it
    if (onInDiningTryAgain) {
      onInDiningTryAgain();
    }
  };

  return (
    <>
      {/* Payment Success Popup */}
      {showPaymentSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-8">Your payment has been processed successfully. Thank you for your order!</p>
            
            <button
              onClick={handleContinue}
              className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}

      {/* Payment Failed Popup */}
      {showPaymentFailedPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="h-10 w-10 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-8">We're sorry, but your payment could not be processed. Please try again or contact support.</p>
            
            <button
              onClick={handleTryAgain}
              className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      )}

      {/* Verifying Payment Status Popup */}
      {showVerifyingStatusPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Verifying Payment Status</h2>
            <p className="text-gray-600 mb-8">Please wait while we verify your payment status...</p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PaymentStatusHandler;
