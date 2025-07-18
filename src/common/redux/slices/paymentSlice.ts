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
  isRequestCheckLoading: boolean;
  error: string | null;
  paymentResponse: any | null;
  requestCheckResponse: any | null;
  currentPaymentRequest: PaymentRequest | null;
}

const initialState: PaymentState = {
  isLoading: false,
  isRequestCheckLoading: false,
  error: null,
  paymentResponse: null,
  requestCheckResponse: null,
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
    makePaymentSuccess: (state, action: PayloadAction<any>) => {
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
      state.isRequestCheckLoading = false;
      state.error = null;
      state.paymentResponse = null;
      state.requestCheckResponse = null;
      state.currentPaymentRequest = null;
    },
    
    // Clear error
    clearPaymentError: (state) => {
      state.error = null;
    },
    
    // Show payment message (for toast notifications)
    showPaymentMessage: (state, action: PayloadAction<string>) => {
      // This action is primarily for triggering UI notifications
      // The message can be stored temporarily if needed
    },

    // Request check actions
    makeRequestCheckRequest: (state, action: PayloadAction<{table_id: string, total_amount?: number}>) => {
      state.isRequestCheckLoading = true;
      state.error = null;
      state.requestCheckResponse = null;
    },
    makeRequestCheckSuccess: (state, action: PayloadAction<any>) => {
      state.isRequestCheckLoading = false;
      state.error = null;
      state.requestCheckResponse = action.payload;
    },
    makeRequestCheckFailure: (state, action: PayloadAction<string>) => {
      state.isRequestCheckLoading = false;
      state.error = action.payload;
      state.requestCheckResponse = null;
    },
  },
});

export const {
  makePaymentRequest,
  makePaymentSuccess,
  makePaymentFailure,
  resetPaymentState,
  clearPaymentError,
  showPaymentMessage,
  makeRequestCheckRequest,
  makeRequestCheckSuccess,
  makeRequestCheckFailure,
} = paymentSlice.actions;

export default paymentSlice.reducer;
