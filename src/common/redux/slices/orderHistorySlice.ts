import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InDiningOrder } from './inDiningOrderSlice';

interface OrderHistoryState {
  orders: InDiningOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderHistoryState = {
  orders: [],
  loading: false,
  error: null,
};

export const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {
    // Get order history
    getOrderHistoryRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    getOrderHistorySuccess: (state, action: PayloadAction<InDiningOrder[]>) => {
      state.orders = action.payload;
      state.loading = false;
    },
    getOrderHistoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear order history
    clearOrderHistory: (state) => {
      state.orders = [];
    },
  },
});

export const {
  getOrderHistoryRequest,
  getOrderHistorySuccess,
  getOrderHistoryFailure,
  clearOrderHistory,
} = orderHistorySlice.actions;

export default orderHistorySlice.reducer;
