import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export interface OrderDetails {
  id?: string;
  orderId?: string; // Added for compatibility with orderService
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  orderType: 'delivery' | 'pickup';
  orderMethod?: 'delivery' | 'takeout'; // Added for compatibility with orderService
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  paymentMethod: string;
  status?: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  createdAt?: string;
  estimatedDeliveryTime?: string;
  estimatedTime?: string; // Added for compatibility with orderService
  specialInstructions?: string;
  orderDate?: string; // Added for compatibility with orderService
  orderTime?: string; // Added for compatibility with orderService
  deliveryFee?: string | number; // Added for compatibility with orderService
  paymentInfo?: {
    message: string;
    payment_link: string;
  }; // Added for payment link functionality
}

interface OrderState {
  currentOrder: OrderDetails | null;
  orderHistory: OrderDetails[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  orderHistory: [],
  loading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setOrder: (state, action: PayloadAction<OrderDetails>) => {
      state.currentOrder = action.payload;
      state.loading = false;
      state.error = null;
    },
    addToOrderHistory: (state, action: PayloadAction<OrderDetails>) => {
      state.orderHistory.push(action.payload);
    },
    setOrderError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
      state.loading = false;
    }
  }
});

export const { 
  setOrderLoading, 
  setOrder, 
  addToOrderHistory,
  setOrderError, 
  clearCurrentOrder 
} = orderSlice.actions;

export default orderSlice.reducer;
