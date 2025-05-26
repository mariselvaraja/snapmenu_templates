import api from './api';
import endpoints from '../config/endpoints';

export const paymentService = {
  getPaymentInfo: async (): Promise<any> => {
    try {
      const response = await api.get<any>(endpoints.payment.info);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;
