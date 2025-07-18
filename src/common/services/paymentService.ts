import { api } from './api';
import { endpoints } from '../config/endpoints';
import { PaymentRequest, PaymentResponse } from '../redux/slices/paymentSlice';

export const paymentService = {
  /**
   * Make a payment for an order
   */
  makePayment: async (table_id: string, total_amount?: number): Promise<PaymentResponse> => {
    try {
      let url = endpoints.payment.makePayment+"?table_id="+table_id;
      if (total_amount !== undefined) {
        url += "&total_amount=" + total_amount;
      }
      const response = await api.get(url);
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
   * Make a request check for a table
   */
  makeRequestCheck: async (table_id: string, total_amount?: number): Promise<any> => {
    try {
      let url = endpoints.payment.requestCheck + "?table_id=" + table_id;
      if (total_amount !== undefined) {
        url += "&amount=" + total_amount;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      // Handle different error scenarios
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Invalid request check data');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.status === 500) {
        throw new Error('Request check service temporarily unavailable');
      } else {
        throw new Error('Request check failed. Please try again.');
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
