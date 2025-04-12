import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  drawerOpen: boolean;
  orderPlaced: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  drawerOpen: false,
  orderPlaced: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Synchronous actions
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      // Open drawer when item is added
      state.drawerOpen = true;
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.id === id);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      state.drawerOpen = action.payload !== undefined ? action.payload : !state.drawerOpen;
    },
    
    // Async action triggers for sagas
    fetchCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    saveCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    saveCartSuccess: (state) => {
      state.loading = false;
    },
    saveCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Place order actions
    placeOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.orderPlaced = false;
    },
    placeOrderSuccess: (state) => {
      state.loading = false;
      state.orderPlaced = true;
      state.items = []; // Clear cart after successful order
    },
    placeOrderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.orderPlaced = false;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
  toggleDrawer,
  fetchCartRequest,
  fetchCartSuccess,
  fetchCartFailure,
  saveCartRequest,
  saveCartSuccess,
  saveCartFailure,
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFailure,
} = cartSlice.actions;

export default cartSlice.reducer;
