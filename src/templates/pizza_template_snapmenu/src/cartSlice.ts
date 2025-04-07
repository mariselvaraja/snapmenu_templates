import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Import the OrderModifier interface from orderService
import { OrderModifier } from './services/orderService';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  modifiers?: OrderModifier[];
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isCartOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      // Open the cart drawer when an item is added
      state.isCartOpen = true;
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
    openCartDrawer: (state) => {
      state.isCartOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isCartOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const { 
  addItem, 
  removeItem, 
  updateItemQuantity, 
  clearCart, 
  openCartDrawer, 
  closeCartDrawer, 
  toggleCartDrawer 
} = cartSlice.actions;

export default cartSlice.reducer;
