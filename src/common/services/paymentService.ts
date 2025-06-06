import { api } from './api';
import { endpoints } from '../config/endpoints';
import { PaymentRequest, PaymentResponse } from '../redux/slices/paymentSlice';

export const paymentService = {
  /**
   * Make a payment for an order
   */
  makePayment: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const response = await api.post(endpoints.payment.makePayment, paymentData);
      return response.data as PaymentResponse;
    } catch (error: any) {
      // Handle different error scenarios
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Invalid payment data');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.status === 402) {
        throw new Error('Payment required or insufficient funds');
      } else if (error.response?.status === 500) {
        throw new Error('Payment service temporarily unavailable');
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    }
  },

  /**
   * Get payment information/configuration
   */
  getPaymentInfo: async (): Promise<any> => {
    try {
      const response = await api.get(endpoints.payment.info);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get payment information');
    }
  },
};

export default paymentService;
