import { useState, useEffect, useRef } from 'react';
import { usePaymentPopup } from '../../../common/popups/usePaymentPopup';
import endpoints from '../../../common/config/endpoints';

const usePaymentManagement = () => {
  const [showVerifyingPaymentPopup, setShowVerifyingPaymentPopup] = useState(false);
  const [showPaymentFailedPopup, setShowPaymentFailedPopup] = useState(false);
  const [showPaymentFailedProcessingPopup, setShowPaymentFailedProcessingPopup] = useState(false);
  const [showPaymentSuccessPopup, setShowPaymentSuccessPopup] = useState(false);
  
  // Payment window management
  const { openPopup, closePopup } = usePaymentPopup();
  const popupRef = useRef<Window | null>(null);
  const paymentRef = useRef<any>(null);
  const isPaymentInProgress = useRef(false);

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(false);
  const [paymentStatusError, setPaymentStatusError] = useState(null);
  
  // Function to navigate to payment link using href (fallback)
  const navigateToPayment = (paymentLink: string) => {
    if (!paymentLink) {
      console.error("No payment link provided");
      return;
    }

    console.log("Fallback: Navigating to payment link via href:", paymentLink);
    window.location.href = paymentLink;
  };

  // Function to open payment popup with fallback to href
  const openPaymentPopup = (paymentLink: string) => {
    if (!paymentLink) {
      console.error("No payment link provided");
      return;
    }

    // Prevent opening multiple popups
    if (popupRef.current && !popupRef.current.closed) {
      console.log("Payment popup already open, ignoring request");
      return popupRef.current;
    }

    console.log("Attempting to open payment popup with link:", paymentLink);
    
    // Reset payment reference before opening new popup
    paymentRef.current = null;
    
    // Try to open the popup using the usePaymentPopup hook
    const popup = openPopup(paymentLink, 'PaymentWindow', 800, 600);
    
    if (!popup) {
      console.error("Failed to open popup - popup blocker might be active, falling back to window.location.href");
      // If popup failed to open, fallback to window.location.href
      navigateToPayment(paymentLink);
      return null;
    }
    
    // Store the popup reference
    popupRef.current = popup;
    
    console.log("Popup opened successfully, starting monitoring");
    
    // Enhanced popup monitoring with multiple approaches
    let checkInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    
    // Method 1: Regular interval checking
    checkInterval = setInterval(() => {
      try {
        if (popup && popup.closed) {
          console.log("Popup detected as closed via interval check");
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          
          if (paymentRef.current) {
            // Payment completed - cleanup
            console.log("Payment completed, cleaning up");
            popupRef.current = null;
            paymentRef.current = null;
            isPaymentInProgress.current = false;
          } else {
            // Payment window manually closed without completion
            console.log("Payment window manually closed - showing failed popup");
            popupRef.current = null;
            paymentRef.current = null;
            isPaymentInProgress.current = false;
            
            // Show failed popup when payment popup is manually closed
            setTimeout(() => {
              setShowVerifyingPaymentPopup(false);
              setShowPaymentFailedPopup(true);
            }, 100);
          }
        }
      } catch (error) {
        console.error("Error checking popup status:", error);
      }
    }, 500); // Check every 500ms for better responsiveness
    
    // Method 2: Timeout fallback (in case interval fails)
    timeoutId = setTimeout(() => {
      try {
        if (popup && popup.closed && !paymentRef.current) {
          console.log("Popup timeout - assuming manual close");
          clearInterval(checkInterval);
          
          popupRef.current = null;
          paymentRef.current = null;
          isPaymentInProgress.current = false;
          
          setTimeout(() => {
            setShowVerifyingPaymentPopup(false);
            setShowPaymentFailedPopup(true);
          }, 100);
        }
      } catch (error) {
        console.error("Error in timeout check:", error);
      }
    }, 30000); // 30 second timeout
    
    return popup;
  };

  // Payment status tracking function
  const fetchPaymentStatus = async (order_id: any) => {
    const restaurant_id = sessionStorage.getItem('franchise_id');
    if (!restaurant_id) {
      console.log('No restaurant_id available for payment status tracking');
      return;
    }

    setPaymentStatusLoading(true);
    setPaymentStatusError(null);

    try {
      const response = await fetch(endpoints.baseUrl.apiBaseUrl + '/pos/order/track?order_id=' + order_id, {
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
        closePopup();
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
        
        // Handle iPos payment response
        closePopup();
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
        closePopup();
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
        closePopup();
        setShowVerifyingPaymentPopup(false);
        isPaymentInProgress.current = false;
        setShowPaymentSuccessPopup(true);
      }
    };

    window.addEventListener('message', handleMessage, false);
    
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, [closePopup]);

  // Cleanup popup monitoring when component unmounts
  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  // Function to reset all popup states
  const resetAllPopupStates = () => {
    setShowVerifyingPaymentPopup(false);
    setShowPaymentFailedPopup(false);
    setShowPaymentFailedProcessingPopup(false);
    setShowPaymentSuccessPopup(false);
    paymentRef.current = null;
    
    // Close any open popup
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    popupRef.current = null;
  };

  // Handle payment initiation - try popup first, fallback to href
  const initiatePayment = (paymentLink: string) => {
    console.log("initiatePayment called with:", paymentLink);
    console.log("isPaymentInProgress.current:", isPaymentInProgress.current);
    console.log("popupRef.current:", popupRef.current);
    console.log("popup closed status:", popupRef.current ? popupRef.current.closed : 'no popup');
    
    // Prevent multiple payment windows - enhanced check
    if (isPaymentInProgress.current) {
      console.log("Payment already in progress, ignoring initiate request");
      return;
    }
    
    // Check if popup is already open
    if (popupRef.current && !popupRef.current.closed) {
      console.log("Payment popup already open, ignoring initiate request");
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
    
    // Show the verifying payment status popup
    setShowVerifyingPaymentPopup(true);
    console.log("Set verifying popup to true");
    
    // Try to open payment popup (will fallback to href if popup fails)
    const popup = openPaymentPopup(paymentLink);
    console.log("Payment popup opened:", popup);
    
    // If popup failed to open (returned null), reset the progress flag
    if (!popup) {
      console.log("Popup failed to open, href fallback was used, resetting progress flag");
      isPaymentInProgress.current = false;
      setShowVerifyingPaymentPopup(false);
    }
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
    
    // Popup management
    openPaymentPopup,
    closePopup,
    
    // Payment status functions
    fetchPaymentStatus,
    navigateToPayment,
    
    // Payment status state
    paymentStatus,
    paymentStatusLoading,
    paymentStatusError,
    
    // References
    popupRef,
    paymentRef
  };
};

export default usePaymentManagement;
