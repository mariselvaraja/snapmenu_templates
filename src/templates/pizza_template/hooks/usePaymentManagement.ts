import { useState, useEffect, useRef } from 'react';
import endpoints from '@/config/endpoints';

const usePaymentManagement = () => {
  const [showVerifyingPaymentPopup, setShowVerifyingPaymentPopup] = useState(false);
  const [showPaymentFailedPopup, setShowPaymentFailedPopup] = useState(false);
  const [showPaymentFailedProcessingPopup, setShowPaymentFailedProcessingPopup] = useState(false);
  const [showPaymentSuccessPopup, setShowPaymentSuccessPopup] = useState(false);
  
  // Payment management
  const paymentRef = useRef<any>(null);
  const isPaymentInProgress = useRef(false);

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(false);
  const [paymentStatusError, setPaymentStatusError] = useState(null);
  
  // Function to navigate to payment link
  const navigateToPayment = (paymentLink: string) => {
    if (!paymentLink) {
      console.error("No payment link provided");
      return;
    }

    console.log("Navigating to payment link:", paymentLink);
    
    // Reset payment reference before navigation
    paymentRef.current = null;
    
    // Navigate to the payment link in the current window
    window.location.href = paymentLink;
  };

    // Payment status tracking function
    const fetchPaymentStatus = async (order_id:any) => {

      const restaurant_id = sessionStorage.getItem('franchise_id');
      if (!restaurant_id) {
        console.log('No restaurant_id available for payment status tracking');
        return;
      }
  
      setPaymentStatusLoading(true);
      setPaymentStatusError(null);
  
      try {
        const response = await fetch(endpoints.baseUrl.apiBaseUrl+'/pos/order/track?order_id='+order_id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'restaurantId': restaurant_id
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching payment status:', error);
        return error;
      } finally {
        setPaymentStatusLoading(false);
      }
    };
  

  // Handle OAuth popup messages
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      console.log("Payment EVENT", event);
      
      // Handle IPOS payment response
      if (event.data.type === 'IPOS_PAYMENT') {
        const { responseMessage, transactionReferenceId, responseCode, amount } = event.data.payload;
        paymentRef.current = { responseMessage, transactionReferenceId, responseCode, amount, paymentType: "ipos" };
        console.log("IPOS PAYMENT", responseCode)
        // Handle iPos payment response
        setShowVerifyingPaymentPopup(false);
        isPaymentInProgress.current = false;
        
        // Check if payment is successful (response code 200 only)
        if (responseCode == 200) {
          console.log("Payment Success");
          setShowPaymentSuccessPopup(true);
        } else {
          console.log("Payment Failed");
          setShowPaymentFailedProcessingPopup(true);
        }
      }
      if (event.data.type === 'CLOVER_PAYMENT') {
        const { payment_status } = event.data.payload;
        paymentRef.current = { payment_status, paymentType: "clover" };
        
        // Handle Clover payment response
        setShowVerifyingPaymentPopup(false);
        isPaymentInProgress.current = false;
        
        // Check if payment is successful (response code 200 only)
        if (payment_status?.toLowerCase() == 'success') {
          console.log("Payment Success");
          setShowPaymentSuccessPopup(true);
        } else {
          console.log("Payment Failed");
          setShowPaymentFailedProcessingPopup(true);
        }
      }

            if (event.data.type === 'SQUARE_PAYMENT') {
        const { transactionId, orderId } = event.data.payload;
        paymentRef.current = { transactionId, orderId, paymentType: "square" };

        let paymentStatus = await fetchPaymentStatus(orderId);

        console.log("paymentStatus", paymentStatus)

        if(paymentStatus?.status)
        {
        // Handle Square payment response
        setShowVerifyingPaymentPopup(false);
        setShowPaymentSuccessPopup(true);
        isPaymentInProgress.current = false;
        console.log("SUCCESS")
        }
        else
        {
          setShowPaymentFailedProcessingPopup(true);
          setShowVerifyingPaymentPopup(false);
        }
      }
      
      // Handle payment status check message (existing functionality)
      if (event.data.type === 'PAYMENT_STATUS_CHECK') {
        const { transaction_id } = event.data.payload;
        console.log("Received transaction_id:", transaction_id);
        paymentRef.current = { transaction_id, paymentType: "status_check" };
        
        // Handle the transaction ID
        setShowVerifyingPaymentPopup(false);
        isPaymentInProgress.current = false;
        setShowPaymentSuccessPopup(true);
      }
    };

    window.addEventListener('message', handleMessage, false);
    
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, []);


  // Function to reset all popup states
  const resetAllPopupStates = () => {
    setShowVerifyingPaymentPopup(false);
    setShowPaymentFailedPopup(false);
    setShowPaymentFailedProcessingPopup(false);
    setShowPaymentSuccessPopup(false);
    paymentRef.current = null;
  };

  // Handle payment initiation
  const initiatePayment = (paymentLink: string) => {
    console.log("initiatePayment called with:", paymentLink);
    console.log("isPaymentInProgress.current:", isPaymentInProgress.current);
    
    // Prevent multiple payment attempts
    if (isPaymentInProgress.current) {
      console.log("Payment already in progress, ignoring initiate request");
      return;
    }
    
    if (!paymentLink) {
      console.log("No payment link provided");
      return;
    }
    
    console.log("Starting payment process...");
    
    // Set payment in progress FIRST to prevent multiple calls
    isPaymentInProgress.current = true;
    
    // Reset popup states
    setShowVerifyingPaymentPopup(false);
    setShowPaymentFailedPopup(false);
    setShowPaymentFailedProcessingPopup(false);
    setShowPaymentSuccessPopup(false);
    paymentRef.current = null;
    
    // Navigate to payment link
    navigateToPayment(paymentLink);
  };

  // Handle payment success
  const handlePaymentSuccess = (onClose?: () => void) => {
    setShowPaymentSuccessPopup(false);
    // Reset payment progress state
    isPaymentInProgress.current = false;
    // Close the drawer or callback
    if (onClose) {
      onClose();
    }
  };

  // Handle payment retry
  const handlePaymentRetry = (retryCallback?: () => void) => {
    setShowPaymentFailedPopup(false);
    setShowPaymentFailedProcessingPopup(false);
    // Reset payment progress state to allow new payment attempts
    isPaymentInProgress.current = false;
    // Execute retry callback (usually reopens the order popup or retries payment)
    if (retryCallback) {
      retryCallback();
    }
  };

  return {
    // State variables
    showVerifyingPaymentPopup,
    showPaymentFailedPopup,
    showPaymentFailedProcessingPopup,
    showPaymentSuccessPopup,
    
    // State setters
    setShowVerifyingPaymentPopup,
    setShowPaymentFailedPopup,
    setShowPaymentFailedProcessingPopup,
    setShowPaymentSuccessPopup,
    
    // Handler functions
    initiatePayment,
    handlePaymentSuccess,
    handlePaymentRetry,
    resetAllPopupStates,
    
    // Payment navigation
    navigateToPayment,
    
    // References
    paymentRef
  };
};

export default usePaymentManagement;
