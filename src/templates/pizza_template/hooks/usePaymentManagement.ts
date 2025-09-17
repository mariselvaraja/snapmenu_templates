import { useState } from 'react';
import endpoints from '../../../common/config/endpoints';

const usePaymentManagement = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(false);
  const [paymentStatusError, setPaymentStatusError] = useState(null);
  
  // Function to navigate to payment link using href
  const navigateToPayment = (paymentLink: string) => {
    if (!paymentLink) {
      console.error("No payment link provided");
      return;
    }

    console.log("Navigating to payment link:", paymentLink);
    window.location.href = paymentLink;
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
  

  // Handle payment initiation - simplified to use href only
  const initiatePayment = (paymentLink: string) => {
    console.log("initiatePayment called with:", paymentLink);
    
    if (!paymentLink) {
      console.log("No payment link provided");
      return;
    }
    
    console.log("Starting payment process with href navigation...");
    navigateToPayment(paymentLink);
  };

  return {
    // Handler functions
    initiatePayment,
    navigateToPayment,
    fetchPaymentStatus,
    
    // Payment status state
    paymentStatus,
    paymentStatusLoading,
    paymentStatusError
  };
};

export default usePaymentManagement;
