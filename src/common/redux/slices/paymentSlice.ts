import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  tableNumber?: string;
  paymentMethod: 'card' | 'cash';
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  paymentUrl?: string;
  paymentLink?: string;
  payment_link?: string;
}

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  paymentResponse: PaymentResponse | null;
  currentPaymentRequest: PaymentRequest | null;
}

const initialState: PaymentState = {
  isLoading: false,
  error: null,
  paymentResponse: null,
  currentPaymentRequest: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Make payment actions
    makePaymentRequest: (state, action: PayloadAction<{table_id: string, total_amount?: number}>) => {
      state.isLoading = true;
      state.error = null;
      state.currentPaymentRequest = null;
    },
    makePaymentSuccess: (state, action: PayloadAction<PaymentResponse>) => {
      state.isLoading = false;
      state.error = null;
      state.paymentResponse = action.payload;
    },
    makePaymentFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.paymentResponse = null;
    },
    
    // Reset payment state
    resetPaymentState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.paymentResponse = null;
      state.currentPaymentRequest = null;
    },
    
    // Clear error
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
});

export const {
  makePaymentRequest,
  makePaymentSuccess,
  makePaymentFailure,
  resetPaymentState,
  clearPaymentError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
